/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as assert from "assert";
import * as path from "path";
import * as os from "os";
import fs = require("fs");
import { Uri } from "vscode";
import { migrateProjectsFile, ProjectStorage } from "../../storage/storage";
import { LEGACY_PROJECTS_FILE, PROJECTS_FILE } from "../../core/constants";
import { NO_TAGS_DEFINED } from "../../sidebar/constants";

suite("ProjectStorage", () => {

    function createTempFilename(prefix: string = "project-manager-storage-"): string {
        return path.join(os.tmpdir(), `${prefix}${Date.now()}-${Math.random().toString(16).slice(2)}.json`);
    }

    function createTempDirectory(): string {
        return fs.mkdtempSync(path.join(os.tmpdir(), "project-manager-storage-"));
    }

    test("renames a legacy projects.json to projects.jsonc", () => {
        const directory = createTempDirectory();
        const previous = path.join(directory, LEGACY_PROJECTS_FILE);
        const filename = path.join(directory, PROJECTS_FILE);
        fs.writeFileSync(previous, "[\n\t// a project I saved before\n]\n");

        assert.strictEqual(migrateProjectsFile(filename), true);
        assert.strictEqual(fs.existsSync(previous), false);
        assert.ok(fs.readFileSync(filename, "utf8").includes("a project I saved before"));

        // it only ever runs once
        assert.strictEqual(migrateProjectsFile(filename), false);

        fs.rmSync(directory, { recursive: true, force: true });
    });

    test("does not overwrite a projects.jsonc that already exists", () => {
        const directory = createTempDirectory();
        const previous = path.join(directory, LEGACY_PROJECTS_FILE);
        const filename = path.join(directory, PROJECTS_FILE);
        fs.writeFileSync(previous, "[ ]\n");
        fs.writeFileSync(filename, "[\n\t// the current one\n]\n");

        assert.strictEqual(migrateProjectsFile(filename), false);
        assert.ok(fs.readFileSync(filename, "utf8").includes("the current one"));
        assert.strictEqual(fs.existsSync(previous), true);

        fs.rmSync(directory, { recursive: true, force: true });
    });

    test("does nothing when there is no legacy file", () => {
        const directory = createTempDirectory();

        assert.strictEqual(migrateProjectsFile(path.join(directory, PROJECTS_FILE)), false);
        assert.strictEqual(fs.readdirSync(directory).length, 0);

        fs.rmSync(directory, { recursive: true, force: true });
    });

    test("push and length track added projects", () => {
        const filename = createTempFilename();
        const storage = new ProjectStorage(filename);

        assert.strictEqual(storage.length(), 0);

        storage.push("Project A", "/path/a");
        storage.push("Project B", "/path/b");

        assert.strictEqual(storage.length(), 2);
    });

    test("pop removes and returns project by name (case-insensitive)", () => {
        const filename = createTempFilename();
        const storage = new ProjectStorage(filename);

        storage.push("MyProject", "/path/project");
        storage.push("Other", "/path/other");

        const popped = storage.pop("myproject");
        assert.ok(popped);
        assert.strictEqual(popped!.name, "MyProject");
        assert.strictEqual(storage.length(), 1);

        const notFound = storage.pop("non-existent");
        assert.strictEqual(notFound, undefined);
        assert.strictEqual(storage.length(), 1);
    });

    test("rename changes project name", () => {
        const filename = createTempFilename();
        const storage = new ProjectStorage(filename);

        storage.push("OldName", "/path/old");
        storage.rename("oldname", "NewName");

        assert.strictEqual(storage.exists("OldName"), false);
        assert.strictEqual(storage.exists("NewName"), true);
    });

    test("updateRootPath and existsWithRootPath are case-insensitive", () => {
        const filename = createTempFilename();
        const storage = new ProjectStorage(filename);

        storage.push("Sample", "/path/one");
        storage.updateRootPath("sample", "/PATH/UPDATED");

        assert.ok(storage.exists("Sample"));

        const found = storage.existsWithRootPath("/path/updated");
        assert.ok(found);
        assert.strictEqual(found!.name, "Sample");
    });

    test("toggleEnabled toggles enabled flag and disabled returns list", () => {
        const filename = createTempFilename();
        const storage = new ProjectStorage(filename);

        storage.push("One", "/path/one");
        storage.push("Two", "/path/two");

        const toggled = storage.toggleEnabled("one");
        assert.strictEqual(toggled, false);

        const disabled = storage.disabled();
        assert.ok(disabled);
        assert.strictEqual(disabled!.length, 1);
        assert.strictEqual(disabled![0].name, "One");

        const toggledBack = storage.toggleEnabled("One");
        assert.strictEqual(toggledBack, true);
        assert.strictEqual(storage.disabled()!.length, 0);
    });

    test("editTags and getAvailableTags collect unique tags", () => {
        const filename = createTempFilename();
        const storage = new ProjectStorage(filename);

        storage.push("A", "/a");
        storage.push("B", "/b");
        storage.push("C", "/c");

        storage.editTags("A", [ "frontend", "react" ]);
        storage.editTags("B", [ "backend", "node" ]);
        storage.editTags("C", [ "frontend", "node" ]);

        const tags = storage.getAvailableTags().sort();
        assert.deepStrictEqual(tags, [ "backend", "frontend", "node", "react" ]);
    });

    test("getProjectsByTag returns enabled projects matching tag (including no-tag case)", () => {
        const filename = createTempFilename();
        const storage = new ProjectStorage(filename);

        storage.push("WithTag", "/with");
        storage.push("NoTag", "/notag");

        storage.editTags("WithTag", [ "tag1" ]);
        // NoTag keeps empty tags

        let result = storage.getProjectsByTag("tag1");
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].label, "WithTag");

        result = storage.getProjectsByTag("");
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].label, "NoTag");
    });

    test("getProjectsByTags returns enabled projects matching any tag and NO_TAGS_DEFINED behavior", () => {
        const filename = createTempFilename();
        const storage = new ProjectStorage(filename);

        storage.push("Frontend", "/fe");
        storage.push("Backend", "/be");
        storage.push("NoTags", "/nt");

        storage.editTags("Frontend", [ "frontend" ]);
        storage.editTags("Backend", [ "backend" ]);
        // NoTags has no tags

        let result = storage.getProjectsByTags([ "frontend" ]);
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].label, "Frontend");

        result = storage.getProjectsByTags([ "frontend", "backend" ]);
        assert.strictEqual(result.length, 2);
        const labels = result.map(r => r.label).sort();
        assert.deepStrictEqual(labels, [ "Backend", "Frontend" ]);

        result = storage.getProjectsByTags([ NO_TAGS_DEFINED ]);
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].label, "NoTags");
    });

    test("map returns only enabled projects with expected shape", () => {
        const filename = createTempFilename();
        const storage = new ProjectStorage(filename);

        storage.push("EnabledProject", "/enabled");
        storage.push("DisabledProject", "/disabled");

        storage.toggleEnabled("DisabledProject");

        const mapped = storage.map();
        assert.strictEqual(mapped.length, 1);
        assert.deepStrictEqual(mapped[0], {
            label: "EnabledProject",
            description: "/enabled",
            profile: ""
        });
    });

    test("save and load preserve projects in v2 format", () => {
        const filename = createTempFilename();
        const storage = new ProjectStorage(filename);

        storage.push("A", "/path/a");
        storage.push("B", "/path/b");
        storage.editTags("A", [ "x" ]);
        storage.editTags("B", [ "y" ]);

        storage.save();

        const loadedStorage = new ProjectStorage(filename);
        const error = loadedStorage.load();
        assert.strictEqual(error, "");
        assert.strictEqual(loadedStorage.length(), 2);
        assert.ok(loadedStorage.exists("A"));
        assert.ok(loadedStorage.exists("B"));

        const tags = loadedStorage.getAvailableTags().sort();
        assert.deepStrictEqual(tags, [ "x", "y" ]);

        fs.unlinkSync(filename);
    });

    test("load migrates v1 format (label/description) to v2 projects", () => {
        const filename = createTempFilename();
        const v1Items = [
            { label: "V1Project1", description: "/v1/one" },
            { label: "V1Project2", description: "/v1/two" }
        ];
        fs.writeFileSync(filename, JSON.stringify(v1Items, null, "\t"));

        const storage = new ProjectStorage(filename);
        const error = storage.load();
        assert.strictEqual(error, "");
        assert.strictEqual(storage.length(), 2);
        assert.ok(storage.exists("V1Project1"));
        assert.ok(storage.exists("V1Project2"));

        const mapped = storage.map();
        assert.strictEqual(mapped.length, 2);
        assert.strictEqual(mapped[0].label, "V1Project1");

        fs.unlinkSync(filename);
    });

    test("existsRemoteWithRootPath returns matching project for remote URI", () => {
        const filename = createTempFilename();
        const storage = new ProjectStorage(filename);

        const remoteRoot = "vscode-remote://ssh-remote+test/home/user/project";
        storage.push("RemoteProject", remoteRoot);

        const uri = Uri.parse(remoteRoot);
        const found = storage.existsRemoteWithRootPath(uri);

        assert.ok(found);
        assert.strictEqual(found!.name, "RemoteProject");
    });

    test("existsRemoteWithRootPath uses the remote URI authority when matching", () => {
        const filename = createTempFilename();
        const storage = new ProjectStorage(filename);

        storage.push("RemoteA", "vscode-remote://ssh-remote+server-A/home/user/project");
        storage.push("RemoteB", "vscode-remote://ssh-remote+server-B/home/user/project");

        const found = storage.existsRemoteWithRootPath(Uri.parse("vscode-remote://ssh-remote+server-B/home/user/project"));

        assert.ok(found);
        assert.strictEqual(found!.name, "RemoteB");
    });

    test("existsRemoteWithRootPath ignores same path on a different remote authority", () => {
        const filename = createTempFilename();
        const storage = new ProjectStorage(filename);

        storage.push("RemoteA", "vscode-remote://ssh-remote+server-A/home/user/project");

        const found = storage.existsRemoteWithRootPath(Uri.parse("vscode-remote://ssh-remote+server-B/home/user/project"));

        assert.strictEqual(found, undefined);
    });

    test("existsRemoteWithRootPath ignores same authority and path on a different URI scheme", () => {
        const filename = createTempFilename();
        const storage = new ProjectStorage(filename);

        storage.push("RemoteProject", "vscode-remote://ssh-remote+server/home/user/project");

        const found = storage.existsRemoteWithRootPath(Uri.parse("vscode-vfs://ssh-remote+server/home/user/project"));

        assert.strictEqual(found, undefined);
    });

    test("existsWithRootPath returns expandedHomePath when asked", () => {
        const filename = createTempFilename();
        const storage = new ProjectStorage(filename);

        storage.push("Regular", "/reg");
        storage.push("ExpandsTilde", "~/et");
        storage.push("ExpandsHome", "$home/eh");
        
        const foundTildeExpanded = storage.existsWithRootPath(path.join(os.homedir(), "et"), true);
        assert.ok(foundTildeExpanded);
        assert.strictEqual(foundTildeExpanded!.name, "ExpandsTilde");
        assert.strictEqual(foundTildeExpanded!.rootPath, path.join(os.homedir(), "et"));

        const foundTilde = storage.existsWithRootPath(path.join(os.homedir(), "et"), false);
        assert.ok(foundTilde);
        assert.strictEqual(foundTilde!.name, "ExpandsTilde");
        assert.strictEqual(foundTilde!.rootPath, "~/et");

        const foundHomeExpanded = storage.existsWithRootPath(path.join(os.homedir(), "eh"), true);
        assert.ok(foundHomeExpanded);
        assert.strictEqual(foundHomeExpanded!.name, "ExpandsHome");
        assert.strictEqual(foundHomeExpanded!.rootPath, path.join(os.homedir(), "eh"));
        
        const foundHome = storage.existsWithRootPath(path.join(os.homedir(), "eh"), false);
        assert.ok(foundHome);
        assert.strictEqual(foundHome!.name, "ExpandsHome");
        assert.strictEqual(foundHome!.rootPath, "$home/eh");
    });

    // The projects file is JSON with Comments: these cover the comments being read
    // and, more importantly, kept when the extension saves the file.

    const jsoncProjectsFile = [
        "[",
        "\t// The projects I use every day",
        "\t{",
        "\t\t\"name\": \"Alpha\",",
        "\t\t\"rootPath\": \"/projects/alpha\"",
        "\t},",
        "\t/* Work related projects */",
        "\t{",
        "\t\t\"name\": \"Beta\",",
        "\t\t\"rootPath\": \"/projects/beta\",",
        "\t},",
        "]",
        ""
    ].join("\n");

    function writeJsoncProjectsFile(filename: string): void {
        fs.writeFileSync(filename, jsoncProjectsFile);
    }

    function readProjectsFile(filename: string): string {
        return fs.readFileSync(filename, "utf8");
    }

    test("load accepts comments and trailing commas", () => {
        const filename = createTempFilename();
        writeJsoncProjectsFile(filename);

        const storage = new ProjectStorage(filename);
        const error = storage.load();

        assert.strictEqual(error, "");
        assert.strictEqual(storage.length(), 2);
        assert.ok(storage.exists("Alpha"));
        assert.ok(storage.exists("Beta"));

        const alpha = storage.getProjects().find(project => project.name === "Alpha")!;
        assert.ok(alpha.rootPath.endsWith("alpha"));

        fs.unlinkSync(filename);
    });

    test("save keeps the comments when a property changes", () => {
        const filename = createTempFilename();
        writeJsoncProjectsFile(filename);

        const storage = new ProjectStorage(filename);
        storage.load();
        storage.editTags("Alpha", [ "favorite" ]);
        storage.save();

        const saved = readProjectsFile(filename);
        assert.ok(saved.includes("// The projects I use every day"));
        assert.ok(saved.includes("/* Work related projects */"));

        const reloaded = new ProjectStorage(filename);
        assert.strictEqual(reloaded.load(), "");
        assert.deepStrictEqual(reloaded.getAvailableTags(), [ "favorite" ]);

        fs.unlinkSync(filename);
    });

    test("save keeps the comments when a project is added", () => {
        const filename = createTempFilename();
        writeJsoncProjectsFile(filename);

        const storage = new ProjectStorage(filename);
        storage.load();
        storage.push("Gamma", "/projects/gamma");
        storage.save();

        const saved = readProjectsFile(filename);
        assert.ok(saved.includes("// The projects I use every day"));
        assert.ok(saved.includes("/* Work related projects */"));
        assert.ok(saved.includes("\"name\": \"Gamma\""));

        const reloaded = new ProjectStorage(filename);
        assert.strictEqual(reloaded.load(), "");
        assert.strictEqual(reloaded.length(), 3);
        assert.ok(reloaded.exists("Alpha"));
        assert.ok(reloaded.exists("Beta"));
        assert.ok(reloaded.exists("Gamma"));

        fs.unlinkSync(filename);
    });

    test("save keeps the comments when a project is removed", () => {
        const filename = createTempFilename();
        writeJsoncProjectsFile(filename);

        const storage = new ProjectStorage(filename);
        storage.load();
        storage.pop("Alpha");
        storage.save();

        const saved = readProjectsFile(filename);
        assert.ok(saved.includes("/* Work related projects */"));
        assert.ok(!saved.includes("\"name\": \"Alpha\""));

        const reloaded = new ProjectStorage(filename);
        assert.strictEqual(reloaded.load(), "");
        assert.strictEqual(reloaded.length(), 1);
        assert.ok(reloaded.exists("Beta"));

        fs.unlinkSync(filename);
    });

    test("save keeps the comments when a project is renamed", () => {
        const filename = createTempFilename();
        writeJsoncProjectsFile(filename);

        const storage = new ProjectStorage(filename);
        storage.load();
        storage.rename("Beta", "Beta Renamed");
        storage.save();

        const saved = readProjectsFile(filename);
        assert.ok(saved.includes("// The projects I use every day"));
        assert.ok(saved.includes("/* Work related projects */"));
        assert.ok(saved.includes("\"name\": \"Beta Renamed\""));
        assert.ok(!saved.includes("\"name\": \"Beta\""));

        const reloaded = new ProjectStorage(filename);
        assert.strictEqual(reloaded.load(), "");
        assert.strictEqual(reloaded.length(), 2);
        assert.ok(reloaded.exists("Beta Renamed"));

        fs.unlinkSync(filename);
    });

    test("save keeps the comments added to the file after the load", () => {
        const filename = createTempFilename();
        writeJsoncProjectsFile(filename);

        const storage = new ProjectStorage(filename);
        storage.load();

        // the user opens the projects file in the editor and adds a comment
        fs.writeFileSync(filename, readProjectsFile(filename)
            .replace("\t// The projects I use every day", "\t// The projects I use every day\n\t// Added in the editor"));

        storage.push("Gamma", "/projects/gamma");
        storage.save();

        const saved = readProjectsFile(filename);
        assert.ok(saved.includes("// Added in the editor"));
        assert.ok(saved.includes("/* Work related projects */"));
        assert.ok(saved.includes("\"name\": \"Gamma\""));

        fs.unlinkSync(filename);
    });

    // A project added to the file by hand is picked up by the `fs.watchFile` watcher,
    // which reloads the file before the next save. Within the polling interval the
    // in-memory list is still the old one, and it is the one that gets written.

    test("a project added by hand is kept once the file is reloaded", () => {
        const filename = createTempFilename();
        writeJsoncProjectsFile(filename);

        const storage = new ProjectStorage(filename);
        storage.load();

        fs.writeFileSync(filename, jsoncProjectsFile
            .replace("\t{", "\t{ \"name\": \"Manual\", \"rootPath\": \"/projects/manual\" },\n\t{"));

        storage.load();   // what the watcher does

        storage.push("Gamma", "/projects/gamma");
        storage.save();

        const reloaded = new ProjectStorage(filename);
        assert.strictEqual(reloaded.load(), "");
        assert.deepStrictEqual(reloaded.getProjects().map(project => project.name),
            [ "Manual", "Alpha", "Beta", "Gamma" ]);

        fs.unlinkSync(filename);
    });

    test("a project added by hand is lost when the extension saves before the reload", () => {
        const filename = createTempFilename();
        writeJsoncProjectsFile(filename);

        const storage = new ProjectStorage(filename);
        storage.load();

        fs.writeFileSync(filename, jsoncProjectsFile
            .replace("\t{", "\t{ \"name\": \"Manual\", \"rootPath\": \"/projects/manual\" },\n\t{"));

        // no reload: the extension still holds the list it loaded at activation
        storage.push("Gamma", "/projects/gamma");
        storage.save();

        const saved = readProjectsFile(filename);
        assert.ok(saved.includes("// The projects I use every day"), "comments should still be kept");

        const reloaded = new ProjectStorage(filename);
        assert.strictEqual(reloaded.load(), "");
        assert.deepStrictEqual(reloaded.getProjects().map(project => project.name),
            [ "Alpha", "Beta", "Gamma" ]);

        fs.unlinkSync(filename);
    });

    test("save leaves the file untouched when nothing changed", () => {
        const filename = createTempFilename();
        writeJsoncProjectsFile(filename);

        const storage = new ProjectStorage(filename);
        storage.load();

        const before = readProjectsFile(filename);
        storage.save();

        assert.strictEqual(readProjectsFile(filename), before);

        fs.unlinkSync(filename);
    });

    test("save keeps comments and line endings on a no-op save of a CRLF file", () => {
        const filename = createTempFilename();
        fs.writeFileSync(filename, jsoncProjectsFile.replace(/\n/g, "\r\n"));

        const storage = new ProjectStorage(filename);
        assert.strictEqual(storage.load(), "");

        const before = readProjectsFile(filename);
        storage.save();

        assert.strictEqual(readProjectsFile(filename), before);

        fs.unlinkSync(filename);
    });

    test("load reports a file with invalid JSONC", () => {
        const filename = createTempFilename();
        fs.writeFileSync(filename, "[\n\t// a comment\n\t{ \"name\": \"Alpha\" ");

        const storage = new ProjectStorage(filename);
        const error = storage.load();

        assert.notStrictEqual(error, "");
        assert.ok(error.includes("line"));

        fs.unlinkSync(filename);
    });

    test("load reports a file that is not an array of projects", () => {
        const filename = createTempFilename();
        fs.writeFileSync(filename, "{ \"name\": \"Alpha\" }");

        const storage = new ProjectStorage(filename);
        const error = storage.load();

        assert.notStrictEqual(error, "");

        fs.unlinkSync(filename);
    });

    test("save writes a new file as plain JSON", () => {
        const filename = createTempFilename();
        assert.strictEqual(fs.existsSync(filename), false);

        const storage = new ProjectStorage(filename);
        storage.push("Alpha", "/projects/alpha");
        storage.save();

        const saved = readProjectsFile(filename);
        assert.strictEqual(saved.trimStart().startsWith("["), true);

        const reloaded = new ProjectStorage(filename);
        assert.strictEqual(reloaded.load(), "");
        assert.strictEqual(reloaded.length(), 1);
        assert.ok(reloaded.exists("Alpha"));

        fs.unlinkSync(filename);
    });

});