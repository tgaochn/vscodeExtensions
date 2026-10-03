/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { commands, l10n, window, workspace } from "vscode";
import { Container } from "../core/container";
import { ProjectNode } from "../sidebar/nodes";
import { isRemotePath } from "../utils/remote";

/**
 * An editor that can be started from the outside to open a project folder. The folder is
 * passed as an argument of a process, never as part of a shell command line.
 */
export interface ExternalEditor {
    /** the product name, shown to the user and deliberately not translated */
    displayName: string;
    /** the setting that overrides the auto detection */
    settingKey: string;
    /** the command looked up on the PATH when the setting is empty */
    command: string;
    /** the real executables, used when only a script wrapper was found */
    executableNames: string[];
    /** well known install locations, tried when the command is not on the PATH */
    knownPaths: (environment: NodeJS.ProcessEnv) => string[];
}

function under(base: string | undefined, ...segments: string[]): string[] {
    return base ? [ path.join(base, ...segments) ] : [];
}

export const VS_CODE: ExternalEditor = {
    displayName: "VS Code",
    settingKey: "openWith.vsCodeCommand",
    command: "code",
    executableNames: [ "Code.exe" ],
    knownPaths: environment => [
        ...under(environment.LOCALAPPDATA, "Programs", "Microsoft VS Code", "Code.exe"),
        ...under(environment.ProgramFiles, "Microsoft VS Code", "Code.exe"),
        "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"
    ]
};

export const CURSOR: ExternalEditor = {
    displayName: "Cursor",
    settingKey: "openWith.cursorCommand",
    command: "cursor",
    executableNames: [ "Cursor.exe" ],
    knownPaths: environment => [
        ...under(environment.LOCALAPPDATA, "Programs", "cursor", "Cursor.exe"),
        ...under(environment.LOCALAPPDATA, "Programs", "Cursor", "Cursor.exe"),
        ...under(environment.ProgramFiles, "Cursor", "Cursor.exe"),
        "/Applications/Cursor.app/Contents/Resources/app/bin/cursor"
    ]
};

/** How far up from a command line script the real executable is looked for. */
const EXECUTABLE_SEARCH_LEVELS = 5;

/** Where the command line interface lives inside an installation. */
const CLI_SCRIPT_SEGMENTS = [ "resources", "app", "out", "cli.js" ];

/**
 * Everything needed to open a folder in an editor.
 */
export interface EditorLaunch {
    /** the process to start */
    executable: string;
    /** arguments that go before the folder (the command line script, on Windows) */
    leadingArguments: string[];
    /** environment variables the editor needs to be started this way */
    environment: NodeJS.ProcessEnv;
}

/**
 * Finds something that can be started to open a folder in `editor`, or `undefined` when
 * the editor could not be located.
 *
 * `platform`, `environment` and `exists` are parameters so that the lookup of every
 * platform can be exercised from a single machine.
 */
export function resolveEditorExecutable(
    editor: ExternalEditor,
    configuredCommand: string,
    platform: NodeJS.Platform,
    environment: NodeJS.ProcessEnv,
    exists: (candidate: string) => boolean): string | undefined {

    const pathApi = platform === "win32" ? path.win32 : path.posix;
    const command = configuredCommand.trim() || editor.command;

    let resolved: string | undefined;

    if (pathApi.isAbsolute(command)) {
        // An explicit path is taken as given, and is not corrected when it is wrong.
        resolved = exists(command) ? command : undefined;
    } else {
        resolved = findOnPath(command, platform, environment, exists) ?? editor.knownPaths(environment).find(exists);
    }

    if (!resolved) {
        return undefined;
    }

    // On Windows the command on the PATH, and the path a user is likely to configure, is a
    // `cmd` wrapper. It can only be started through a shell, so the real executable next to
    // it is used instead, and the folder path never has to be quoted for a shell.
    if ((platform === "win32") && isWindowsScript(resolved)) {
        return findExecutableNear(resolved, editor.executableNames, exists);
    }

    return resolved;
}

/**
 * Works out how to start `editor` on a folder.
 *
 * On Linux and macOS the command found on the PATH is a script that already starts the
 * editor, so it can be run as it is.
 *
 * On Windows it is the editor application itself. The command line handling lives in a
 * separate script that the application has to be asked to run, exactly as the `code.cmd`
 * wrapper does it:
 *
 *     set ELECTRON_RUN_AS_NODE=1
 *     Code.exe <installation>\resources\app\out\cli.js %*
 *
 * Starting the application directly instead would hand the folder to it as if it were a
 * script to execute, which fails silently.
 */
export function resolveEditorLaunch(
    editor: ExternalEditor,
    configuredCommand: string,
    platform: NodeJS.Platform,
    environment: NodeJS.ProcessEnv,
    exists: (candidate: string) => boolean,
    listDirectories: (directory: string) => string[]): EditorLaunch | undefined {

    const executable = resolveEditorExecutable(editor, configuredCommand, platform, environment, exists);
    if (!executable) {
        return undefined;
    }

    if (platform !== "win32") {
        return { executable, leadingArguments: [], environment: {} };
    }

    const cliScript = findCliScript(executable, exists, listDirectories);
    if (!cliScript) {
        return undefined;
    }

    return {
        executable,
        leadingArguments: [ cliScript ],
        environment: { ELECTRON_RUN_AS_NODE: "1" }
    };
}

function findCliScript(
    executable: string,
    exists: (candidate: string) => boolean,
    listDirectories: (directory: string) => string[]): string | undefined {

    const root = path.win32.dirname(executable);

    const direct = path.win32.join(root, ...CLI_SCRIPT_SEGMENTS);
    if (exists(direct)) {
        return direct;
    }

    // Recent builds keep the application in a folder named after the commit, next to the
    // executable, as in `<installation>\07f806f999\resources\app\out\cli.js`.
    for (const entry of listDirectories(root)) {
        const candidate = path.win32.join(root, entry, ...CLI_SCRIPT_SEGMENTS);
        if (exists(candidate)) {
            return candidate;
        }
    }

    return undefined;
}

function findOnPath(
    command: string,
    platform: NodeJS.Platform,
    environment: NodeJS.ProcessEnv,
    exists: (candidate: string) => boolean): string | undefined {

    const pathApi = platform === "win32" ? path.win32 : path.posix;
    const separator = platform === "win32" ? ";" : ":";
    const extensions = platform === "win32" ? windowsExtensions(environment) : [ "" ];
    const entries = (environment.PATH ?? environment.Path ?? "").split(separator);

    for (const entry of entries) {
        if (!entry) {
            continue;
        }

        for (const extension of extensions) {
            const candidate = pathApi.join(entry, command + extension);
            if (exists(candidate)) {
                return candidate;
            }
        }
    }

    return undefined;
}

function windowsExtensions(environment: NodeJS.ProcessEnv): string[] {
    return (environment.PATHEXT ?? ".COM;.EXE;.BAT;.CMD")
        .split(";")
        .filter(extension => extension.length > 0)
        .map(extension => extension.toLowerCase());
}

function isWindowsScript(candidate: string): boolean {
    return /\.(cmd|bat)$/i.test(candidate);
}

function findExecutableNear(
    scriptPath: string,
    executableNames: string[],
    exists: (candidate: string) => boolean): string | undefined {

    let directory = path.win32.dirname(scriptPath);

    for (let level = 0; level < EXECUTABLE_SEARCH_LEVELS; level++) {
        for (const name of executableNames) {
            const candidate = path.win32.join(directory, name);
            if (exists(candidate)) {
                return candidate;
            }
        }

        const parent = path.win32.dirname(directory);
        if (parent === directory) {
            break;
        }
        directory = parent;
    }

    return undefined;
}

function openInEditor(editor: ExternalEditor, node: ProjectNode) {
    if (!node) {
        return;
    }

    const projectPath: string = node.command.arguments[ 0 ];

    if (isRemotePath(projectPath)) {
        window.showErrorMessage(l10n.t("Remote projects can't be opened in {0}", editor.displayName));
        return;
    }

    const configured = workspace.getConfiguration("projectManager").get<string>(editor.settingKey) ?? "";
    const launch = resolveEditorLaunch(editor, configured, process.platform, process.env, fs.existsSync, listDirectories);

    if (!launch) {
        window.showErrorMessage(l10n.t("Could not find {0}. Install its command line, or set the {1} setting to the full path of its executable.",
            editor.displayName, `projectManager.${editor.settingKey}`));
        return;
    }

    // `-n` opens a new window, so the project does not replace the one the command was run from.
    const child = spawn(launch.executable, [ ...launch.leadingArguments, "-n", projectPath ], {
        detached: true,
        stdio: "ignore",
        env: { ...process.env, ...launch.environment }
    });

    child.on("error", error => {
        window.showErrorMessage(l10n.t("Could not open the project in {0}. {1}", editor.displayName, error.message));
    });

    child.unref();
}

function listDirectories(directory: string): string[] {
    try {
        return fs.readdirSync(directory, { withFileTypes: true })
            .filter(entry => entry.isDirectory())
            .map(entry => entry.name);
    } catch (error) {
        return [];
    }
}

export function registerOpenWithExternalEditor() {
    Container.context.subscriptions.push(
        commands.registerCommand("_projectManager.openWithVSCode", (node) => openInEditor(VS_CODE, node)));
    Container.context.subscriptions.push(
        commands.registerCommand("_projectManager.openWithCursor", (node) => openInEditor(CURSOR, node)));
}
