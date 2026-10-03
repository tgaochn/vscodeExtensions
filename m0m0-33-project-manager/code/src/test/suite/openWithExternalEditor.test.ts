/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as assert from "assert";
import * as path from "path";
import { CURSOR, resolveEditorExecutable, resolveEditorLaunch, VS_CODE } from "../../commands/openWithExternalEditor";

suite("OpenWithExternalEditor", () => {

    /** A file system made of an explicit list of paths. */
    function fileSystem(paths: string[], caseInsensitive: boolean) {
        const known = new Set(paths.map(candidate => caseInsensitive ? candidate.toLowerCase() : candidate));
        return (candidate: string) => known.has(caseInsensitive ? candidate.toLowerCase() : candidate);
    }

    test("finds the command on the PATH on Linux and macOS", () => {
        const environment = { PATH: "/usr/local/bin:/usr/bin" };
        const exists = fileSystem([ "/usr/bin/code" ], false);

        assert.strictEqual(resolveEditorExecutable(VS_CODE, "", "linux", environment, exists), "/usr/bin/code");
        assert.strictEqual(resolveEditorExecutable(CURSOR, "", "darwin", environment, exists), undefined);
    });

    test("uses an absolute path given in the setting", () => {
        const exists = fileSystem([ "/opt/editors/code" ], false);

        assert.strictEqual(resolveEditorExecutable(VS_CODE, "/opt/editors/code", "linux", {}, exists), "/opt/editors/code");
    });

    test("ignores an absolute path given in the setting that does not exist", () => {
        const exists = fileSystem([ "/usr/bin/code" ], false);

        assert.strictEqual(resolveEditorExecutable(VS_CODE, "/opt/missing/code", "linux", { PATH: "/usr/bin" }, exists), undefined);
    });

    test("resolves the real executable behind the cmd shim on Windows", () => {
        const environment = { PATH: "C:\\Program Files\\Microsoft VS Code\\bin", PATHEXT: ".COM;.EXE;.BAT;.CMD" };
        const exists = fileSystem([
            "C:\\Program Files\\Microsoft VS Code\\bin\\code.cmd",
            "C:\\Program Files\\Microsoft VS Code\\Code.exe"
        ], true);

        assert.strictEqual(
            resolveEditorExecutable(VS_CODE, "", "win32", environment, exists),
            "C:\\Program Files\\Microsoft VS Code\\Code.exe");
    });

    test("gives up when only the cmd shim exists on Windows", () => {
        const environment = { PATH: "C:\\tools\\bin", PATHEXT: ".CMD" };
        const exists = fileSystem([ "C:\\tools\\bin\\cursor.cmd" ], true);

        assert.strictEqual(resolveEditorExecutable(CURSOR, "", "win32", environment, exists), undefined);
    });

    test("does not treat the colon of a Windows drive letter as a PATH separator", () => {
        const environment = { PATH: "C:\\tools\\bin", PATHEXT: ".EXE" };
        const exists = fileSystem([ "C:\\tools\\bin\\cursor.exe" ], true);

        assert.strictEqual(
            resolveEditorExecutable(CURSOR, "", "win32", environment, exists),
            "C:\\tools\\bin\\cursor.exe");
    });

    test("falls back to a well known install location when the command is not on the PATH", () => {
        const environment = { PATH: "/nonexistent", LOCALAPPDATA: "C:\\Users\\me\\AppData\\Local" };
        // `knownPaths` joins with the separator of the running platform, so the expectation
        // is built the same way to keep this test valid on every platform.
        const expected = path.join(environment.LOCALAPPDATA, "Programs", "cursor", "Cursor.exe");
        const exists = fileSystem([ expected ], true);

        assert.strictEqual(resolveEditorExecutable(CURSOR, "", "win32", environment, exists), expected);
    });

    test("returns undefined when the editor cannot be found anywhere", () => {
        assert.strictEqual(
            resolveEditorExecutable(VS_CODE, "", "linux", { PATH: "/nowhere" }, () => false),
            undefined);
    });

    test("splits the PATH with the separator of the requested platform", () => {
        const exists = fileSystem([ "C:\\second\\code.exe", "/second/code" ], true);

        assert.strictEqual(
            resolveEditorExecutable(VS_CODE, "", "win32", { PATH: "C:\\first;C:\\second", PATHEXT: ".EXE" }, exists),
            "C:\\second\\code.exe");
        assert.strictEqual(
            resolveEditorExecutable(VS_CODE, "", "linux", { PATH: "/first:/second" }, exists),
            "/second/code");
    });

    test("the two editors are configured independently", () => {
        assert.notStrictEqual(VS_CODE.settingKey, CURSOR.settingKey);
        assert.strictEqual(VS_CODE.command, "code");
        assert.strictEqual(CURSOR.command, "cursor");
    });

    test("turns a configured cmd wrapper into the executable next to it", () => {
        const root = "C:\\Program Files\\Microsoft VS Code";
        const exists = fileSystem([
            path.win32.join(root, "bin", "code.cmd"),
            path.win32.join(root, "Code.exe")
        ], true);

        assert.strictEqual(
            resolveEditorExecutable(VS_CODE, path.win32.join(root, "bin", "code.cmd"), "win32", {}, exists),
            path.win32.join(root, "Code.exe"));
    });

    test("runs the command line script of the editor on Windows", () => {
        const root = "C:\\Program Files\\Microsoft VS Code";
        const executable = path.win32.join(root, "Code.exe");
        const cliScript = path.win32.join(root, "07f806f999", "resources", "app", "out", "cli.js");
        const exists = fileSystem([ executable, cliScript ], true);

        const launch = resolveEditorLaunch(VS_CODE, executable, "win32", {}, exists, () => [ "07f806f999" ]);

        assert.ok(launch);
        assert.strictEqual(launch?.executable, executable);
        assert.deepStrictEqual(launch?.leadingArguments, [ cliScript ]);
        assert.strictEqual(launch?.environment.ELECTRON_RUN_AS_NODE, "1");
    });

    test("finds the command line script in a flat installation on Windows", () => {
        const root = "C:\\Program Files\\Microsoft VS Code";
        const executable = path.win32.join(root, "Code.exe");
        const cliScript = path.win32.join(root, "resources", "app", "out", "cli.js");
        const exists = fileSystem([ executable, cliScript ], true);

        const launch = resolveEditorLaunch(VS_CODE, executable, "win32", {}, exists, () => []);

        assert.deepStrictEqual(launch?.leadingArguments, [ cliScript ]);
    });

    test("gives up on Windows when the command line script is missing", () => {
        const executable = "C:\\Program Files\\Microsoft VS Code\\Code.exe";
        const exists = fileSystem([ executable ], true);

        assert.strictEqual(resolveEditorLaunch(VS_CODE, executable, "win32", {}, exists, () => []), undefined);
    });

    test("starts the command on the PATH directly on Linux and macOS", () => {
        const exists = fileSystem([ "/usr/bin/code" ], false);

        assert.deepStrictEqual(
            resolveEditorLaunch(VS_CODE, "", "linux", { PATH: "/usr/bin" }, exists, () => []),
            { executable: "/usr/bin/code", leadingArguments: [], environment: {} });
    });

    test("never hands the folder straight to the Windows executable", () => {
        // The extension host runs with ELECTRON_RUN_AS_NODE set, which a spawned process
        // inherits. Starting Code.exe with the folder as its first argument therefore makes
        // it run as plain Node and try to load the folder as a script, which fails silently.
        // The command line script has to be passed first, as the `code.cmd` wrapper does.
        const root = "C:\\Program Files\\Microsoft VS Code";
        const executable = path.win32.join(root, "Code.exe");
        const cliScript = path.win32.join(root, "resources", "app", "out", "cli.js");
        const exists = fileSystem([ executable, cliScript ], true);

        const launch = resolveEditorLaunch(VS_CODE, executable, "win32", {}, exists, () => []);

        assert.strictEqual(launch?.leadingArguments[ 0 ], cliScript);
        assert.strictEqual(launch?.leadingArguments[ 0 ].endsWith("cli.js"), true);
    });
});
