// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const {
    processMdContent,
    isCodeBlockStart
} = require('./utils');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    let documentFormatter = new DocumentFormatter();

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('markdown', {
        provideDocumentFormattingEdits(document) {
            let content = documentFormatter.updateDocument(document);
            return [new vscode.TextEdit(documentFormatter.current_document_range(document), content)];
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.reFormat', () => {
        let editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            return;
        }
        let doc = editor.document;

        // Only update status if an Markdown file
        if (doc.languageId !== "markdown") {
            return;
        }
        editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            return;
        }

        let content = documentFormatter.updateDocument(doc);
        editor.edit((editorBuilder) => {
            editorBuilder.replace(documentFormatter.current_document_range(doc), content);
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.reFormat_md2html', () => {
        let editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            return;
        }
        let doc = editor.document;

        // Only update status if an Markdown file
        if (doc.languageId !== "markdown") {
            return;
        }
        editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            return;
        }

        let content = documentFormatter.updateDocument_md2html(doc);
        editor.edit((editorBuilder) => {
            editorBuilder.replace(documentFormatter.current_document_range(doc), content);
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.reFormat_html2md', () => {
        let editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            return;
        }
        let doc = editor.document;

        // Only update status if an Markdown file
        if (doc.languageId !== "markdown") {
            return;
        }
        editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            return;
        }

        let content = documentFormatter.updateDocument_html2md(doc);
        editor.edit((editorBuilder) => {
            editorBuilder.replace(documentFormatter.current_document_range(doc), content);
        });
    }));

    // 0.3.1: 添加 extension.copyEncodedRelativePathOfCurrentFile 命令, 可以复制当前文件的相对路径
    context.subscriptions.push(vscode.commands.registerCommand('extension.copyEncodedRelativePathOfCurrentFile', () => {
        if (!vscode.workspace.rootPath) {
            throw new NoWorkspaceOpen;
        }
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            throw new NoTextEditorOpen;
        }
        let document = editor.document;
        if (document.isUntitled) {
            throw new DocumentIsUntitled;
        }
        // const relativePath = encodeURI(vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.uri).replace(/\\/g, '/'));
        const relativePath = vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.uri).replace(/\\/g, '/').replaceAll(' ', '%20');
        const finalText = `[desc](${relativePath})`

        vscode.env.clipboard.writeText(finalText);
    }));
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;

class DocumentFormatter {
    current_document_range(doc) {
        // 当前文档范围
        let start = new vscode.Position(0, 0);
        let end = new vscode.Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length);
        let range = new vscode.Range(start, end);
        return range;
    }

    updateDocument_md2html(document) {
        const content = document.getText(this.current_document_range(document));
        let inCodeBlock = false;

        const processLine = (line) => {
            line = line.trim();

            if (isCodeBlockStart(line)) {
                inCodeBlock = !inCodeBlock;
                return this.processCodeBlockStart_md2html(line);
            }

            if (inCodeBlock) {
                return line;
            }

            if (line.startsWith('@import')) {
                return line;
            }

            return this.processNonCodeLine_md2html(line);
        };

        const lines = content.split("\n").map(processLine);
        return this.assembleContent(lines);
    }

    updateDocument_html2md(document) {
        const content = document.getText(this.current_document_range(document));
        let inCodeBlock = false;

        const processLine = (line) => {
            line = line.trim();

            if (isCodeBlockStart(line)) {
                inCodeBlock = !inCodeBlock;
                return this.processCodeBlockStart_html2md(line);
            }

            if (inCodeBlock) {
                return line;
            }

            if (line.startsWith('@import')) {
                return line;
            }

            return this.processNonCodeLine_html2md(line);
        };

        const lines = content.split("\n").map(processLine);
        return this.assembleContent(lines);
    }

    processCodeBlockStart_md2html(line) {
        const codeTypes = ['sql', 'bash', 'go', 'scala', 'java', 'xml', 'json', 'python', 'conf', 'config', 'cfg'];
        for (let type of codeTypes) {
            if (line === `\`\`\`${type}`) {
                return `{code:${type}}`;
            }
        }
        return line.replace('```', '{code}');
    }

    processCodeBlockStart_html2md(line) {
        const codeTypes = ['sql', 'bash', 'go', 'scala', 'java', 'xml', 'json', 'python', 'conf', 'config', 'cfg'];
        for (let type of codeTypes) {
            if (line === `{code:${type}}`) {
                return `\`\`\`${type}`;
            }
        }
        return line.replace('{code}', '```');
    }

    processNonCodeLine_md2html(line) {
        let line_tmp = "";

        // 使用行中代码块为分割
        line.split(/(`.*?`)/).forEach(element => {
            if (element.search(/(`.*`)/) == -1) {
                // title
                element = element.replace(/^# (.*)/g, "h1. $1");
                element = element.replace(/^## (.*)/g, "h2. $1");
                element = element.replace(/^### (.*)/g, "h3. $1");
                element = element.replace(/^#### (.*)/g, "h4. $1");
                element = element.replace(/^##### (.*)/g, "h5. $1");
                element = element.replace(/^###### (.*)/g, "h6. $1");

                // bold
                element = element.replace(/^_(.*)_/g, "*$1*");

                // align
                element = element.replace(/^  \* (.*)/g, "\*\* $1");
                element = element.replace(/^    \* (.*)/g, "\*\*\* $1");
                element = element.replace(/^      \* (.*)/g, "\*\*\*\* $1");
            }

            line_tmp += element;
        });

        line = line_tmp;

        return line;
    }

    processNonCodeLine_html2md(line) {
        let line_tmp = "";
        // 使用行中代码块为分割
        line.split(/(`.*?`)/).forEach(element => {

            // html2md
            if (element.search(/(`.*`)/) == -1) {
                // title
                element = element.replace(/^h1\. (.*)/g, "# $1");
                element = element.replace(/^h2\. (.*)/g, "## $1");
                element = element.replace(/^h3\. (.*)/g, "### $1");
                element = element.replace(/^h4\. (.*)/g, "#### $1");
                element = element.replace(/^h5\. (.*)/g, "##### $1");
                element = element.replace(/^h6\. (.*)/g, "###### $1");

                // code block
                element = element.replace("{code:sql}", "```sql");
                element = element.replace("{code:bash}", "```bash");
                element = element.replace("{code:go}", "```go");
                element = element.replace("{code:scala}", "```scala");
                element = element.replace("{code:java}", "```java");
                element = element.replace("{code:xml}", "```xml");
                element = element.replace("{code:json}", "```json");
                element = element.replace("{code:python}", "```python");
                element = element.replace("{code:conf}", "```conf");
                element = element.replace("{code:config}", "```config");
                element = element.replace("{code:cfg}", "```cfg");
                element = element.replace("{code}", "```");

                // align
                element = element.replace(/^ *\*\* (.*)/g, "  \* $1");
                element = element.replace(/^ *\*\*\* (.*)/g, "    \* $1");
                element = element.replace(/^ *\*\*\*\* (.*)/g, "      \* $1");
            }
            line_tmp += element;
        });

        line = line_tmp;

        return line;
    }

    assembleContent(lines) {
        let content = "";
        let isInCodeBlock = false;
        let consecutiveBlankLines = 0;

        for (let line of lines) {
            if (isCodeBlockStart(line)) {
                isInCodeBlock = !isInCodeBlock;
                content += line + "\n";
                consecutiveBlankLines = 0;
            } else if (isInCodeBlock) {
                content += line + "\n";
            } else {
                if (line.trim().length === 0) {
                    if (consecutiveBlankLines === 0) {
                        content += "\n";
                    }
                    consecutiveBlankLines++;
                } else {
                    content += line + "\n";
                    consecutiveBlankLines = 0;
                }
            }
        }

        return content.trim() + "\n";
    }

    updateDocument(document) {
        const content = document.getText(this.current_document_range(document));

        return processMdContent(content);
    }

}
