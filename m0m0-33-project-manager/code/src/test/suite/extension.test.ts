/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the GPLv3 License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { ProjectManagerPublicApi } from '../../../api/api';
import { PROJECTS_FILE } from '../../core/constants';

const timeout = async (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

suite('Extension Test Suite', () => {
    let extension: vscode.Extension<any>;
    vscode.window.showInformationMessage('Start all tests.');

    suiteSetup(() => {
        extension = vscode.extensions.getExtension('m0m0.m0m0-33-project-manager') as vscode.Extension<any>;
    });

    test('Sample test', () => {
        assert.equal(-1, [ 1, 2, 3 ].indexOf(5));
        assert.equal(-1, [ 1, 2, 3 ].indexOf(0));
    });

    test('Activation test', async () => {
        const api = await extension.activate() as ProjectManagerPublicApi;
        assert.equal(extension.isActive, true);
        assert.ok(api);
    });

    test('Public API saves and reads favorite projects', async () => {
        const api = await extension.activate() as ProjectManagerPublicApi;
        const name = `API test ${Date.now()}`;
        const rootPath = path.join(os.tmpdir(), 'project-manager-api-test');
        const otherRootPath = path.join(os.tmpdir(), 'other-project');

        await api.saveProject(name, rootPath, [ 'api' ], 'api-profile');

        const favorites = await api.getFavoriteProjects();
        const savedProject = favorites.find(project => project.name === name);
        assert.ok(savedProject);
        assert.deepStrictEqual(savedProject, {
            name,
            rootPath,
            tags: [ 'api' ],
            profile: 'api-profile',
            enabled: true
        });
        assert.ok((await api.getAllProjects()).some(project => project.name === name));
        await assert.rejects(api.saveProject(name, otherRootPath));
    });

    test('Extension loads in VSCode and is active', async () => {
        await timeout(1500);
        assert.equal(extension.isActive, true);
    });

    test('Saving the projects file from an editor reloads it right away', async () => {
        const api = await extension.activate() as ProjectManagerPublicApi;

        // The extension runs from the webpack bundle, which carries its own copy of the
        // storage path state, so this test cannot recompute the path with PathUtils. It
        // uses the layout the test harness creates, and fails loudly if it moves.
        const projectsFile = path.join(extension.extensionPath, '.vscode-test', 'user-data',
            'User', 'globalStorage', extension.id, PROJECTS_FILE);

        const manualName = `Manual ${Date.now()}`;
        const manualRoot = path.join(os.tmpdir(), 'project-manager-manual');

        await api.saveProject(`Seeded ${Date.now()}`, path.join(os.tmpdir(), 'project-manager-seeded'), [], '');
        assert.ok(fs.existsSync(projectsFile), `the extension did not write ${projectsFile}`);

        // The `fs.watchFile` watcher polls every ~5s, so it would hide a missing reload
        // behind its own delay. Removing it leaves only the on-save reload under test.
        fs.unwatchFile(projectsFile);

        const document = await vscode.workspace.openTextDocument(projectsFile);
        const editor = await vscode.window.showTextDocument(document);
        const entry = `\n\t{ "name": ${JSON.stringify(manualName)}, "rootPath": ${JSON.stringify(manualRoot)} },`;

        assert.ok(await editor.edit(builder => builder.insert(new vscode.Position(0, 1), entry)));
        await document.save();

        // The file now holds a project the extension has never seen. It has to show up
        // without waiting for the watcher, since the watcher is gone.
        const deadline = Date.now() + 1500;
        let found = false;
        let seen: string[] = [];

        while (!found && (Date.now() < deadline)) {
            const favorites = await api.getFavoriteProjects();
            seen = favorites.map(project => project.name);
            found = seen.includes(manualName);
            if (!found) {
                await timeout(50);
            }
        }

        assert.ok(found, `the project added to the projects file was not reloaded on save.`
            + `\nfile: ${projectsFile}\nloaded projects: ${JSON.stringify(seen)}`
            + `\nfile content:\n${fs.readFileSync(projectsFile, 'utf8')}`);
    });
});
