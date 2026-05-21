"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const main_1 = require("./main");
const bookmark_tree_view_1 = require("./tree_view/bookmark_tree_view");
let main;
let treeView;
function activate(context) {
    treeView = new bookmark_tree_view_1.BookmarkTreeView();
    main = new main_1.Main(context, treeView.refreshCallback.bind(treeView));
    let disposable;
    disposable = vscode.commands.registerTextEditorCommand('vsc-labeled-bookmarks.toggleBookmark', (textEditor) => main.editorActionToggleBookmark(textEditor));
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerTextEditorCommand('vsc-labeled-bookmarks.toggleLabeledBookmark', (textEditor) => main.editorActionToggleLabeledBookmark(textEditor));
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerTextEditorCommand('vsc-labeled-bookmarks.navigateToNextBookmark', (textEditor) => main.editorActionnavigateToNextBookmark(textEditor));
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerTextEditorCommand('vsc-labeled-bookmarks.navigateToPreviousBookmark', (textEditor) => main.editorActionNavigateToPreviousBookmark(textEditor));
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('vsc-labeled-bookmarks.navigateToBookmark', () => main.actionNavigateToBookmark());
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('vsc-labeled-bookmarks.navigateToBookmarkOfAnyGroup', () => main.actionNavigateToBookmarkOfAnyGroup());
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('vsc-labeled-bookmarks.selectGroup', () => main.actionSelectGroup());
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('vsc-labeled-bookmarks.addGroup', () => main.actionAddGroup());
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('vsc-labeled-bookmarks.deleteGroup', () => main.actionDeleteGroup());
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('vsc-labeled-bookmarks.setGroupIconShape', () => main.actionSetGroupIconShape());
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('vsc-labeled-bookmarks.setGroupIconColor', () => main.actionSetGroupIconColor());
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('vsc-labeled-bookmarks.deleteBookmark', () => main.actionDeleteBookmark());
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('vsc-labeled-bookmarks.toggleHideAll', () => main.actionToggleHideAll());
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('vsc-labeled-bookmarks.toggleHideInactiveGroups', () => main.actionToggleHideInactiveGroups());
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('vsc-labeled-bookmarks.clearFailedJumpFlags', () => main.actionClearFailedJumpFlags());
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('vsc-labeled-bookmarks.moveBookmarksFromActiveGroup', () => main.actionMoveBookmarksFromActiveGroup());
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerTextEditorCommand('vsc-labeled-bookmarks.expandSelectionToNextBookmark', (textEditor) => main.actionExpandSelectionToNextBookmark(textEditor));
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerTextEditorCommand('vsc-labeled-bookmarks.expandSelectionToPreviousBookmark', (textEditor) => main.actionExpandSelectionToPreviousBookmark(textEditor));
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('vsc-labeled-bookmarks.jumpToBookmark', (bookmark, preview) => main.jumpToBookmark(bookmark, preview));
    context.subscriptions.push(disposable);
    vscode.window.onDidChangeActiveTextEditor(textEditor => {
        main.updateEditorDecorations(textEditor);
    });
    vscode.workspace.onDidChangeTextDocument(textDocumentChangeEvent => {
        main.onEditorDocumentChanged(textDocumentChangeEvent);
    });
    vscode.workspace.onDidRenameFiles(fileRenameEvent => {
        main.onFilesRenamed(fileRenameEvent);
    });
    vscode.workspace.onDidDeleteFiles(fileDeleteEvent => {
        main.onFilesDeleted(fileDeleteEvent);
    });
    vscode.workspace.onDidChangeConfiguration(() => {
        main.readSettings();
    });
    disposable = vscode.commands.registerCommand('vsc-labeled-bookmarks.refreshTreeView', () => treeView.refreshCallback());
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('vsc-labeled-bookmarks.activateTreeItem', (item) => treeView.activateItem(item));
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('vsc-labeled-bookmarks.editTreeItem', (item) => treeView.editItem(item));
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('vsc-labeled-bookmarks.deleteTreeItem', (item) => treeView.deleteItem(item));
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('vsc-labeled-bookmarks.showTreeView', () => treeView.show());
    context.subscriptions.push(disposable);
    treeView.init(main);
}
exports.activate = activate;
function deactivate() {
    main.saveState();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map