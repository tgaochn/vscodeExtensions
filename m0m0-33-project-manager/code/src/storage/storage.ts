/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import fs = require("fs");
import * as path from "path";
import { applyEdits, ModificationOptions, modify, Node, parse, parseTree, ParseError, printParseErrorCode } from "jsonc-parser";
import { PathUtils } from "../utils/path";
import { isRemotePath } from "../utils/remote";
import { Uri } from "vscode";
import { createProject, Project } from "../core/project";
import { LEGACY_PROJECTS_FILE } from "../core/constants";
import { NO_TAGS_DEFINED } from "../sidebar/constants";

/**
 * The projects file is JSON with Comments (JSONC): line comments, block comments
 * and trailing commas are accepted, and the comments the user adds are kept when
 * the extension saves the file.
 */
const PROJECTS_PARSE_OPTIONS = { allowTrailingComma: true, disallowComments: false };

const PROJECTS_FORMATTING_OPTIONS = { insertSpaces: false, tabSize: 1 };

const PROJECT_PROPERTIES: Array<keyof Project> = [ "name", "rootPath", "paths", "tags", "enabled", "profile" ];

/**
 * Renames the plain `projects.json` of an older version to the JSON with Comments name,
 * so that an existing project list is not left behind. It only ever runs once, when the
 * new file does not exist yet, and returns whether it moved anything.
 */
export function migrateProjectsFile(filename: string): boolean {
    const previous = path.join(path.dirname(filename), LEGACY_PROJECTS_FILE);

    if (fs.existsSync(filename) || !fs.existsSync(previous)) {
        return false;
    }

    fs.renameSync(previous, filename);

    return true;
}

export class ProjectStorage {

    private projects: Project[];
    private filename: string;

    constructor(filename: string) {
        this.filename = filename;
        this.projects = [];
    }

    public push(name: string, rootPath: string, tags: string[] = [], profile: string = ""): void {
        const project = createProject(name, rootPath);
        project.tags = [ ...tags ];
        project.profile = profile;
        this.projects.push(project);
        return;
    }

    public getProjects(): Project[] {
        return this.projects.map(project => ({
            ...project,
            paths: [ ...project.paths ],
            tags: [ ...project.tags ]
        }));
    }

    public pop(name: string): Project {
        for (let index = 0; index < this.projects.length; index++) {
            const element: Project = this.projects[ index ];
            if (element.name.toLowerCase() === name.toLowerCase()) {
                return this.projects.splice(index, 1)[ 0 ];
            }
        }
    }

    public rename(oldName: string, newName: string): void {
        for (const element of this.projects) {
            if (element.name.toLowerCase() === oldName.toLowerCase()) {
                element.name = newName;
                return;
            }
        }
    }

    public editTags(name: string, tags: string[]): void {
        for (const element of this.projects) {
            if (element.name.toLowerCase() === name.toLowerCase()) {
                element.tags = tags;
                return;
            }
        }
    }

    public toggleEnabled(name: string): boolean | undefined {
        for (const element of this.projects) {
            if (element.name.toLowerCase() === name.toLowerCase()) {
                element.enabled = !element.enabled;
                return element.enabled;
            }
        }
    }

    public disabled(): Array<Project> | undefined {
        return this.projects.filter(project => !project.enabled);
    }

    public updateRootPath(name: string, path: string): void {
        for (const element of this.projects) {
            if (element.name.toLowerCase() === name.toLowerCase()) {
                element.rootPath = path;
            }
        }
    }

    public exists(name: string): boolean {
        let found = false;

        for (const element of this.projects) {
            if (element.name.toLocaleLowerCase() === name.toLocaleLowerCase()) {
                found = true;
            }
        }
        return found;
    }

    public existsWithRootPath(rootPath: string, returnExpandedHomePath: boolean = false): Project {
        for (const element of this.projects) {
            const elementPath = PathUtils.expandHomePath(element.rootPath);
            if ((elementPath.toLocaleLowerCase() === rootPath.toLocaleLowerCase()) || (elementPath === rootPath)) {
                if (returnExpandedHomePath) {
                    return {
                        ...element,
                        rootPath: elementPath
                    };
                }
                return element;
            }
        }
    }

    public existsRemoteWithRootPath(uri: Uri): Project {
        for (const element of this.projects) {
            if (!isRemotePath(element.rootPath)) { continue; }

            const uriElement = Uri.parse(element.rootPath);
            if (uriElement.scheme === uri.scheme && uriElement.authority === uri.authority && uriElement.path === uri.path) {
                return element;
            }
        }
    }

    public length(): number {
        return this.projects.length;
    }

    public load(): string {
        let items: Array<any> = [];

        // missing file (new install)
        if (!fs.existsSync(this.filename)) {
            return "";
        }

        try {
            const text = fs.readFileSync(this.filename, "utf8");

            const parseErrors: ParseError[] = [];
            const parsed = parse(text, parseErrors, PROJECTS_PARSE_OPTIONS);

            if (parseErrors.length > 0) {
                return describeParseError(text, parseErrors[ 0 ]);
            }

            if (!Array.isArray(parsed)) {
                return "The projects file must contain an array of projects.";
            }

            items = parsed;

            // OLD v1 format
            if ((items.length > 0) && (items[ 0 ].label)) {
                for (const element of items) {
                    this.projects.push(createProject(element.label, element.description));
                }
                // save updated
                this.save();
            } else { // NEW v2 format
                this.projects = normalizeProjects(items);
            }

            this.updatePaths();

            return "";
        } catch (error) {
            console.log(error);
            return error.toString();
        }
    }

    public save() {
        const text = this.serializePreservingComments();
        fs.writeFileSync(this.filename, text);
    }

    /**
     * Produces the file content by editing the document that is on disk in place, so
     * that the comments, the blank lines and the formatting the user added to the
     * projects file survive every save.
     */
    private serializePreservingComments(): string {
        const document = this.readDocument();

        // Nothing to preserve: a new file, or one we could not understand.
        if (document === undefined) {
            return serializeProjects(this.projects);
        }

        try {
            return this.editDocument(document);
        } catch (error) {
            console.log(error);
            return serializeProjects(this.projects);
        }
    }

    /**
     * Applies the projects held in memory to the document that is on disk, touching
     * only the parts that changed.
     */
    private editDocument(document: { text: string; projects: Project[] }): string {
        const options: ModificationOptions = { formattingOptions: PROJECTS_FORMATTING_OPTIONS };
        const baseProjects = document.projects;
        const pairs = alignProjects(baseProjects, this.projects);
        const pairedBaseIndexes = new Set(pairs.map(pair => pair[ 0 ]));
        const pairedIndexes = new Set(pairs.map(pair => pair[ 1 ]));

        let text = document.text;

        // 1) Update the properties of the projects that are still there. The array
        //    structure does not change, so the indexes remain valid.
        for (const [ baseIndex, index ] of pairs) {
            for (const property of PROJECT_PROPERTIES) {
                const value = this.projects[ index ][ property ];
                if (isSameValue(baseProjects[ baseIndex ][ property ], value)) {
                    continue;
                }
                text = applyEdits(text, modify(text, [ baseIndex, property ], value, options));
            }
        }

        // 2) Remove the projects that are gone, from the last to the first, so the
        //    indexes of the entries that stay keep pointing at the same project.
        const removedBaseIndexes: number[] = [];
        for (let baseIndex = 0; baseIndex < baseProjects.length; baseIndex++) {
            if (!pairedBaseIndexes.has(baseIndex)) {
                removedBaseIndexes.push(baseIndex);
            }
        }

        for (const baseIndex of removedBaseIndexes.reverse()) {
            text = removeProject(text, baseIndex);
        }

        // 3) Insert the new projects at the position they take in the list.
        let inserted = 0;
        for (let index = 0; index < this.projects.length; index++) {
            if (pairedIndexes.has(index)) {
                continue;
            }
            const position = pairs.filter(pair => pair[ 1 ] < index).length + inserted;
            const insertionOptions: ModificationOptions = { ...options, isArrayInsertion: true };
            text = applyEdits(text, modify(text, [ position ], serializeProject(this.projects[ index ]), insertionOptions));
            inserted++;
        }

        // Never write a document that does not match the projects held in memory. When
        // the in-place edits do not round-trip, fall back to a full serialization: the
        // comments are lost, but the project list is always correct.
        if (isEquivalentToProjects(text, this.projects)) {
            return text;
        }

        console.log("Project Manager: could not preserve the comments in the projects file, rewriting it.");

        return serializeProjects(this.projects);
    }

    /**
     * Reads the projects file as the base for the comment preserving edits. Returns
     * `undefined` when the file is missing, cannot be understood, or still uses the
     * old v1 format, in which cases the file is written from scratch.
     */
    private readDocument(): { text: string; projects: Project[] } | undefined {
        try {
            const text = fs.readFileSync(this.filename, "utf8");

            const parseErrors: ParseError[] = [];
            const parsed = parse(text, parseErrors, PROJECTS_PARSE_OPTIONS);

            if ((parseErrors.length > 0) || !Array.isArray(parsed)) {
                return undefined;
            }

            // OLD v1 format: it is migrated to the v2 shape instead of being edited in place.
            if ((parsed.length > 0) && parsed[ 0 ].label) {
                return undefined;
            }

            const projects = normalizeProjects(parsed);
            updateProjectPaths(projects);

            return { text, projects };
        } catch (error) {
            return undefined;
        }
    }

    public map(): any {
        const newItems = this.projects.filter(item => item.enabled).map(item => {
            return {
                label: item.name,
                description: item.rootPath,
                profile: item.profile
            };
        });
        return newItems;
    }

    private updatePaths(): void {
        updateProjectPaths(this.projects);
    }

    public getAvailableTags(): string[] {
        const tags: string[] = [];
        for (const project of this.projects) {
            tags.push(...project.tags);
        }
        const tagsSet = new Set(tags);
        return [ ...tagsSet ];
    }

    public getProjectsByTag(tag: string): any {
        const newItems = this.projects.filter(item => item.enabled && (item.tags.includes(tag) || (tag === '' && item.tags.length === 0))).map(item => {
            return {
                label: item.name,
                description: item.rootPath
            };
        });
        return newItems;
    }

    public getProjectsByTags(tags: string[]): any {
        const newItems = this.projects.filter(
            item => item.enabled
                && (item.tags.some(t => tags.includes(t))
                    || ((tags.length === 0 || tags.includes(NO_TAGS_DEFINED) && item.tags.length === 0)
                    ))
        ).map(item => {
            return {
                label: item.name,
                description: item.rootPath,
                profile: item.profile
            };
        });
        return newItems;
    }

}

/** Builds a project with the exact set of properties the projects file stores. */
function serializeProject(project: Project): object {
    return {
        name: project.name,
        rootPath: project.rootPath,
        paths: [ ...project.paths ],
        tags: [ ...project.tags ],
        enabled: project.enabled,
        profile: project.profile
    };
}

function serializeProjects(projects: Project[]): string {
    return JSON.stringify(projects.map(project => serializeProject(project)), null, "\t");
}

/** Reads the stored projects, filling in the properties an older file may not have. */
function normalizeProjects(items: Array<Partial<Project>>): Project[] {
    return items.map(item => ({
        name: item.name ?? "",
        rootPath: item.rootPath ?? "",
        paths: item.paths ?? [],
        tags: item.tags ?? [],
        enabled: item.enabled ?? true,
        profile: item.profile ?? ""
    }));
}

/** Brings the root paths to the separator of the running platform, the same way a load does. */
function updateProjectPaths(projects: Project[]): void {
    for (const project of projects) {
        if (!isRemotePath(project.rootPath)) {
            project.rootPath = PathUtils.updateWithPathSeparatorStr(project.rootPath);
        }
    }
}

function isSameValue(left: unknown, right: unknown): boolean {
    if (Array.isArray(left) && Array.isArray(right)) {
        return (left.length === right.length) && left.every((value, index) => value === right[ index ]);
    }
    return left === right;
}

function describeParseError(text: string, error: ParseError): string {
    const lines = text.substring(0, error.offset).split(/\r\n|\r|\n/);
    const column = lines[ lines.length - 1 ].length + 1;
    return `${printParseErrorCode(error.error)} at line ${lines.length}, column ${column}`;
}

/**
 * Whether two entries of the projects file are the same project, either moved
 * (same name) or renamed (same path). Used to tell a change to an existing entry
 * apart from an entry being removed and another one being added, so that the
 * comments attached to a project survive both a rename and a path update.
 */
function isSameProjectEntry(left: Project, right: Project): boolean {
    return (left.rootPath === right.rootPath) || (left.name === right.name);
}

/**
 * Pairs the projects of the loaded document with the projects held in memory,
 * keeping the order of both lists (longest common subsequence). Added projects and
 * removed projects are left unpaired.
 */
function alignProjects(base: Project[], current: Project[]): Array<[number, number]> {
    const rows = base.length;
    const columns = current.length;

    const lengths: number[][] = [];
    for (let row = 0; row <= rows; row++) {
        lengths.push(new Array<number>(columns + 1).fill(0));
    }

    for (let row = rows - 1; row >= 0; row--) {
        for (let column = columns - 1; column >= 0; column--) {
            lengths[ row ][ column ] = isSameProjectEntry(base[ row ], current[ column ])
                ? lengths[ row + 1 ][ column + 1 ] + 1
                : Math.max(lengths[ row + 1 ][ column ], lengths[ row ][ column + 1 ]);
        }
    }

    const pairs: Array<[number, number]> = [];
    let row = 0;
    let column = 0;
    while ((row < rows) && (column < columns)) {
        if (isSameProjectEntry(base[ row ], current[ column ])) {
            pairs.push([ row, column ]);
            row++;
            column++;
        } else if (lengths[ row + 1 ][ column ] >= lengths[ row ][ column + 1 ]) {
            row++;
        } else {
            column++;
        }
    }

    return pairs;
}

function isEquivalentToProjects(text: string, projects: Project[]): boolean {
    const parseErrors: ParseError[] = [];
    const parsed = parse(text, parseErrors, PROJECTS_PARSE_OPTIONS);

    if ((parseErrors.length > 0) || !Array.isArray(parsed)) {
        return false;
    }

    // Normalize both sides the same way a load does, otherwise the root paths of the
    // file (which keep the separators the user wrote) would never match the ones a
    // project added in this session still has.
    const reloaded = normalizeProjects(parsed);
    updateProjectPaths(reloaded);

    const expected = projects.map(project => ({ ...project, paths: [ ...project.paths ], tags: [ ...project.tags ] }));
    updateProjectPaths(expected);

    return JSON.stringify(reloaded) === JSON.stringify(expected);
}

/**
 * Removes the project at `index` from the array, deleting only that entry and the
 * comma that separates it from its neighbour. `modify` cannot be used for this: it
 * removes the whole span up to the next entry, which takes the comments placed
 * between the two projects with it.
 */
function removeProject(text: string, index: number): string {
    const array = parseTree(text);

    if (!array || (array.type !== "array") || !array.children || !array.children[ index ]) {
        throw new Error(`Cannot remove project at index ${index}`);
    }

    const child = array.children[ index ];
    const entryEnd = child.offset + child.length;
    const lineStart = startOfEntryLine(text, array, child);
    const isOnly = array.children.length === 1;
    const isLast = index === array.children.length - 1;

    if (!isLast) {
        // Drop the entry together with the comma that follows it. Everything between
        // this entry and the next one, which is where its comments live, is kept.
        const comma = text.indexOf(",", entryEnd);
        return applyEdits(text, [ { offset: lineStart, length: comma + 1 - lineStart, content: "" } ]);
    }

    const entryStart = (lineStart === child.offset) ? lineStart : includeLineBreak(text, lineStart);

    if (isOnly) {
        return applyEdits(text, [ { offset: entryStart, length: entryEnd - entryStart, content: "" } ]);
    }

    // Last entry: the separator to drop is the one that precedes it. It is looked up
    // from the end of the previous entry, since searching backwards from this one
    // could land on a comma inside the previous entry's own values.
    const previous = array.children[ index - 1 ];
    const comma = text.indexOf(",", previous.offset + previous.length);

    return applyEdits(text, [
        { offset: comma, length: 1, content: "" },
        { offset: entryStart, length: entryEnd - entryStart, content: "" }
    ]);
}

/** The offset the entry's line starts at, or the entry itself when it is not alone on its line. */
function startOfEntryLine(text: string, array: Node, child: Node): number {
    const lineStart = startOfLine(text, child.offset);
    const prefix = text.substring(lineStart, child.offset);

    if ((lineStart > array.offset) && /^[ \t]*$/.test(prefix)) {
        return lineStart;
    }

    return child.offset;
}

/** The offset the line containing `offset` starts at. */
function startOfLine(text: string, offset: number): number {
    let start = offset;
    while ((start > 0) && (text[ start - 1 ] !== "\n") && (text[ start - 1 ] !== "\r")) {
        start--;
    }
    return start;
}

/** Extends `offset` to include the line break that precedes it, if there is one. */
function includeLineBreak(text: string, offset: number): number {
    let start = offset;

    if ((start > 0) && (text[ start - 1 ] === "\n")) {
        start--;
        if ((start > 0) && (text[ start - 1 ] === "\r")) {
            start--;
        }
    } else if ((start > 0) && (text[ start - 1 ] === "\r")) {
        start--;
    }

    return start;
}
