// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('"MarkdownFormat" 现在已激活!');
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
    /**
     * 更新文档
     */
    updateDocument_md2html(document) {
        // 获取配置
        const config = vscode.workspace.getConfiguration("MarkdownFormat");
        // 按照每行进行搞定
        let content = document.getText(this.current_document_range(document));
        let lines = [];
        let tag = true;
        // 每行操作
        lines = content.split("\n").map((line) => {
            line = line.replace(/(.*)[\r\n]$/g, "$1").replace(/(\s*$)/g, "");
            // 代码块
            if (line.trim().search("```") === 0) {
                if (tag) {
                    line = line.replace("```sql", "{code:sql}");
                    line = line.replace("```bash", "{code:bash}");
                    line = line.replace("```go", "{code:go}");
                    line = line.replace("```scala", "{code:scala}");
                    line = line.replace("```java", "{code:java}");
                    line = line.replace("```xml", "{code:xml}");
                    line = line.replace("```json", "{code:json}");
                    line = line.replace("```python", "{code:python}");
                    line = line.replace("```conf", "{code:conf}");
                    line = line.replace("```config", "{code:config}");
                    line = line.replace("```cfg", "{code:cfg}");
                    line = line.replace("```", "{code}");

                    return line
                } else {
                    return "\n" + line;
                }
            } else if (tag) {
                // 忽略 @import 语法
                if (line.trim().search(/^@import /) == -1) {
                    let line_tmp = "";

                    // 使用行中代码块为分割
                    line.split(/(`.*?`)/).forEach(element => {

                        // md2html - 非代码块
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
                }

            }
            return line;
        });

        let i = 1;
        content = "";
        tag = true;
        lines.join("\n").split("\n").forEach(line => {
            if (line.trim().search("```") === 0) {
                tag = !tag;
                if (tag) {
                    content += line + "\n";
                } else {
                    content += line + "\n";
                }
                i = 0;
            } else if (tag) {
                if (line.trim().length === 0) {
                    if (i == 0) {
                        content += "\n";
                    }
                    i += 1;
                } else {
                    i = 0;
                }
                if (i == 0) {
                    content += line.replace(/(.*)[\r\n]$/g, "$1") + "\n";
                }
            } else {
                content += line + "\n";
            }
        });
        content = content.trim() + "\n";
        return content;
    }

    updateDocument_html2md(document) {
        // 获取配置
        const config = vscode.workspace.getConfiguration("MarkdownFormat");
        // 按照每行进行搞定
        let content = document.getText(this.current_document_range(document));
        let lines = [];
        let tag = true;
        // 每行操作
        lines = content.split("\n").map((line) => {
            line = line.replace(/(.*)[\r\n]$/g, "$1").replace(/(\s*$)/g, "");
            // 忽略代码块
            if (line.trim().search("```") === 0) {
                tag = !tag;
                if (tag) {
                    return line + "\n";
                } else {
                    return "\n" + line;
                }
            } else if (tag) {
                // 忽略 @import 语法
                if (line.trim().search(/^@import /) == -1) {
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
                }

            }
            return line;
        });

        let i = 1;
        content = "";
        tag = true;
        lines.join("\n").split("\n").forEach(line => {
            if (line.trim().search("```") === 0) {
                tag = !tag;
                if (tag) {
                    content += line + "\n";
                } else {
                    content += line + "\n";
                }
                i = 0;
            } else if (tag) {
                if (line.trim().length === 0) {
                    if (i == 0) {
                        content += "\n";
                    }
                    i += 1;
                } else {
                    i = 0;
                }
                if (i == 0) {
                    content += line.replace(/(.*)[\r\n]$/g, "$1") + "\n";
                }
            } else {
                content += line + "\n";
            }
        });
        content = content.trim() + "\n";
        return content;
    }

    updateDocument(document) {
        // 获取配置
        const config = vscode.workspace.getConfiguration("MarkdownFormat");
        // 按照每行进行搞定
        let content = document.getText(this.current_document_range(document));
        let lines = [];
        let tag = true;
        // 每行操作
        lines = content.split("\n").map((line) => {
            line = line.replace(/(.*)[\r\n]$/g, "$1").replace(/(\s*$)/g, "");

            // !! 在这里改, 全局生效
            line = this.replaceFullNums(line);
            line = this.replaceFullChars(line);

            // 0.2.12: [ ( -> [(
            line = line.replace(/([\[\({_\^])\s*([\[\({_\^])/g, "$1$2");

            // 0.2.13: ) ] -> )]
            line = line.replace(/([\]\)}_\^])\s*([\]\)}_\^])/g, "$1$2");

            // 0.2.14: 增加全局生效的条件, 不在括号内
            let line_tmp_global = "";
            line.split(/(`.*?`)/).forEach(element => {
                // 跳过各种括号内的内容, 防止链接被断开
                if (
                        !element.match(/tags:.*/g) &&               //0.2.15: obsidian - tags: XX
                        !element.match(/(\[.*\])(\(.*\))/g) &&      //[XX](XX)
                        !element.match(/(^\s*\[.*\]$)/g) &&         //[XX]
                        !element.match(/(^\s*\(.*\)$)/g) &&         //(XX)
                        !element.match(/(^\s*{.*}$)/g) &&           //{XX}
                        !element.match(/(^\s*<.*>$)/g) &&           //<XX>
                        !element.match(/(^\s*`.*`$)/g) &&           //`XX`
                        !element.match(/(^\s*\".*\"$)/g) &&         //"XX"
                        !element.match(/(^\s*\'.*\'$)/g)            //'XX'
                ) {
                    // !! 在这里改, 代码块内生效, 在上面的条件内不生效
                    // 0.2.11: 无论是不是代码块都在汉字和英文之间加空格
                    element = element.replace(/([\u4e00-\u9fa5\u3040-\u30FF])([a-zA-Z0-9@&=\[\$\%\^\-\+(])/g, '$1 $2'); // 不修改正反斜杠, 避免路径被改乱
                    element = element.replace(/([a-zA-Z0-9!&;=\]\,\.\:\?\$\%\^\-\+\)])([\u4e00-\u9fa5\u3040-\u30FF])/g, "$1 $2");
                }
                line_tmp_global += element;
            });
            line = line_tmp_global;

            // 忽略代码块
            if (line.trim().search("```") === 0) {
                tag = !tag;
                if (tag) {
                    return line + "\n";
                } else {
                    return "\n" + line;
                }
            } else if (tag) {
                // 忽略 @import 语法
                if (line.trim().search(/^@import /) == -1) {
                    let line_tmp = "";
                    // 使用行中代码块为分割
                    line.split(/(`.*?`)/).forEach(element => {
                        // !! 在这里改, 只有普通内容里生效, 代码块内/引号等条件内不生效
                        if (element.search(/(`.*`)/) == -1) {
                            // 修复 markdown 链接所使用的标点。
                            if (config.get("line")) {
                                element = element.replace(/[『\[]([^』\]]+)[』\]][『\[]([^』\]]+)[』\]]/g, "[$1]($2)");
                                element = element.replace(/[『\[]([^』\]]+)[』\]][（(]([^』)]+)[）)]/g, "[$1]($2)");
                            }

                            // 注释处理
                            if (config.get("note")) {
                                if (element.trim().search(/^<!--.*-->$/) != -1) {
                                    // 注释前后加入空行
                                    element = element.replace(/(^\s*<!--.*-->)([\r\n]*)/, "\n$1\n");
                                }
                            }

                            // 忽略链接以及注释格式
                            if (!element.match(/(\[.*\])(\(.*\))/g) &&
                                !element.match(/(^\s*\[.*\]$)/g) &&
                                !element.match(/(^\s*\(.*\)$)/g) &&
                                !element.match(/(^\s*{.*}$)/g) &&
                                !element.match(/(^\s*<.*>$)/g) &&
                                !element.match(/(^\s*`.*`$)/g) &&
                                !element.match(/(^\s*\".*\"$)/g) &&
                                !element.match(/(^\s*\'.*\'$)/g)
                            ) {
                                // 替换全角数字
                                if (config.get("replaceFullNums")) {
                                    element = this.replaceFullNums(element);
                                }
                                // 替换全角英文和标点
                                if (config.get("replaceFullChars")) {
                                    element = this.replaceFullChars(element);
                                    element = this.replaceOtherChars(element);
                                }
                                // 汉字后的标点符号，转成全角符号。
                                if (config.get("replacePunctuations")) {
                                    element = this.replacePunctuations(element);
                                }
                                // 汉字与其前后的英文字符、英文标点、数字间增加空白。
                                // if (config.get("cn")) {
                                //     // 汉字修改
                                //     element = element.replace(/([\u4e00-\u9fa5\u3040-\u30FF])([a-zA-Z0-9@&=\[\$\%\^\-\+(])/g, '$1 $2'); // 不修改正反斜杠, 避免路径被改乱
                                //     element = element.replace(/([a-zA-Z0-9!&;=\]\,\.\:\?\$\%\^\-\+\)])([\u4e00-\u9fa5\u3040-\u30FF])/g, "$1 $2"); // 不修改正反斜杠, 避免路径被改乱
                                // }

                                // 英文修改, 英文字符间如果有相关符号, 则增加空格
                                // ![](http://pic-gtfish.oss-us-west-1.aliyuncs.com/pic/2023-02-09_210659_075.png)
                                // "T+he (qui+ck) a+b [br+own] fox+x" -> "T + he (qui+ck) a + b [br+own] fox + x"
                                const pattern = /(.*)(\(|\[|\")(.*)(\)|\]|\")(.*)/g
                                if (element.match(pattern)) {
                                    let element_formatted = ""
                                    const parts = element.split(pattern)
                                    for (let i = 0; i < parts.length; i++) {
                                        let part = parts[i]
                                        if ((i == 1 || i == 5) && part.match(pattern)) {
                                            let subParts = part.split(pattern)
                                            let subElement_formatted = ""

                                            for (let j = 0; j < subParts.length; j++) {
                                                let subPart = subParts[j]
                                                if (j == 1 || j == 5) {
                                                    subPart = subPart.replace(/([a-zA-Z])([=\+])([a-zA-Z])/g, '$1 $2 $3'); // 前后空格: a+b -> a + b
                                                    subPart = subPart.replace(/([a-zA-Z])([\,])([a-zA-Z])/g, '$1$2 $3'); // 后空格: a,b -> a, b
                                                }
                                                subElement_formatted += subPart
                                            }
                                            element_formatted += subElement_formatted
                                        } else if (i == 1 || i == 5) {
                                            part = part.replace(/([a-zA-Z])([=\+])([a-zA-Z])/g, '$1 $2 $3'); // 前后空格: a+b -> a + b
                                            part = part.replace(/([a-zA-Z])([\,])([a-zA-Z])/g, '$1$2 $3'); // 后空格: a,b -> a, b

                                            element_formatted += part
                                        } else {
                                            element_formatted += part
                                        }
                                    }
                                    element = element_formatted
                                }
                                else {
                                    element = element.replace(/([a-zA-Z])([=\+])([a-zA-Z])/g, '$1 $2 $3'); // 前后空格: a+b -> a + b
                                    // element = element.replace(/([a-zA-Z])([\[(\{])([a-zA-Z])/g, '$1 $2$3'); // 前空格: a(123) -> a (123)
                                    element = element.replace(/([a-zA-Z])([\,])([a-zA-Z])/g, '$1$2 $3'); // 后空格: a,b -> a, b
                                }
                            }
                        }
                        line_tmp += element;
                    });
                    // 标题处理
                    if (config.get("title")) {
                        if (line_tmp.trim().search(/(^#{1,6}.*)([\r\n]*)/) != -1) {
                            // 标题后加入一个空格
                            if (line_tmp.trim().search(/(^#{1,6}\s+)([\r\n]*)/) == -1) {
                                // 0.2.16: skip md tags: #XX
                                // line_tmp = line_tmp.trim().replace(/(^#{1,6})(.*)/, "$1 $2");
                            } else {
                                line_tmp = line_tmp.trim().replace(/(^#{1,6})\s+(.*)/, "$1 $2");
                            }
                            // 标题前后加入空行
                            line_tmp = line_tmp.trim().replace(/(^#{1,6}.*)([\r\n]*)/, "\n$1\n");
                        }
                    }
                    line = line_tmp;
                }

            }
            return line;
        });

        let i = 1;
        content = "";
        tag = true;
        lines.join("\n").split("\n").forEach(line => {
            if (line.trim().search("```") === 0) {
                tag = !tag;
                if (tag) {
                    content += line + "\n";
                } else {
                    content += line + "\n";
                }
                i = 0;
            } else if (tag) {
                if (line.trim().length === 0) {
                    if (i == 0) {
                        content += "\n";
                    }
                    i += 1;
                } else {
                    i = 0;
                }
                if (i == 0) {
                    content += line.replace(/(.*)[\r\n]$/g, "$1") + "\n";
                }
            } else {
                content += line + "\n";
            }
        });
        content = content.trim() + "\n";
        return content;
    }
    /**
     * 当前文档范围
     */
    current_document_range(doc) {
        let start = new vscode.Position(0, 0);
        let end = new vscode.Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length);
        let range = new vscode.Range(start, end);
        return range;
    }
    /**
     * 替换汉字后标点
     */
    replacePunctuations(content) {
        // 汉字后的标点符号，转成全角符号。
        content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF])\.($|\s*)/g, '$1。');
        content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF]),\s*/g, '$1，');
        content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF]);\s*/g, '$1；');
        content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF])!\s*/g, '$1！');
        content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF]):\s*/g, '$1：');
        content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF])\?\s*/g, '$1？');
        content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF])\\\s*/g, '$1、');
        // 圆括号（）
        content = content.replace(/\(([\u4e00-\u9fa5\u3040-\u30FF])/g, '（$1');
        content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF])\)/g, '$1）');
        // 方括号【】
        content = content.replace(/\[([\u4e00-\u9fa5\u3040-\u30FF])/g, '【$1');
        content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF。！])\]/g, '$1】');
        // 尖括号《》
        content = content.replace(/<([\u4e00-\u9fa5\u3040-\u30FF])/g, '《$1');
        content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF。！])>/g, '$1》');
        content = content.replace(/。\{3,}/g, '......');
        content = content.replace(/([！？])$1{3,}/g, '$1$1$1');
        content = content.replace(/([。，；：、“”『』〖〗《》])\1{1,}/g, '$1');
        return content;
    }
    /**
     * 替换全角数字
     */
    replaceFullNums(content) {
        content = content.replaceAll("０", "0");
        content = content.replaceAll("１", "1");
        content = content.replaceAll("２", "2");
        content = content.replaceAll("３", "3");
        content = content.replaceAll("４", "4");
        content = content.replaceAll("５", "5");
        content = content.replaceAll("６", "6");
        content = content.replaceAll("７", "7");
        content = content.replaceAll("８", "8");
        content = content.replaceAll("９", "9");
        return content;
    }
    /**
     * 替换全角英文和标点
     */
    replaceFullChars(content) {
        // 全角英文和标点。
        content = content.replaceAll("Ａ", "A");
        content = content.replaceAll("Ｂ", "B");
        content = content.replaceAll("Ｃ", "C");
        content = content.replaceAll("Ｄ", "D");
        content = content.replaceAll("Ｅ", "E");
        content = content.replaceAll("Ｆ", "F");
        content = content.replaceAll("Ｇ", "G");
        content = content.replaceAll("Ｈ", "H");
        content = content.replaceAll("Ｉ", "I");
        content = content.replaceAll("Ｊ", "J");
        content = content.replaceAll("Ｋ", "K");
        content = content.replaceAll("Ｌ", "L");
        content = content.replaceAll("Ｍ", "M");
        content = content.replaceAll("Ｎ", "N");
        content = content.replaceAll("Ｏ", "O");
        content = content.replaceAll("Ｐ", "P");
        content = content.replaceAll("Ｑ", "Q");
        content = content.replaceAll("Ｒ", "R");
        content = content.replaceAll("Ｓ", "S");
        content = content.replaceAll("Ｔ", "T");
        content = content.replaceAll("Ｕ", "U");
        content = content.replaceAll("Ｖ", "V");
        content = content.replaceAll("Ｗ", "W");
        content = content.replaceAll("Ｘ", "X");
        content = content.replaceAll("Ｙ", "Y");
        content = content.replaceAll("Ｚ", "Z");
        content = content.replaceAll("ａ", "a");
        content = content.replaceAll("ｂ", "b");
        content = content.replaceAll("ｃ", "c");
        content = content.replaceAll("ｄ", "d");
        content = content.replaceAll("ｅ", "e");
        content = content.replaceAll("ｆ", "f");
        content = content.replaceAll("ｇ", "g");
        content = content.replaceAll("ｈ", "h");
        content = content.replaceAll("ｉ", "i");
        content = content.replaceAll("ｊ", "j");
        content = content.replaceAll("ｋ", "k");
        content = content.replaceAll("ｌ", "l");
        content = content.replaceAll("ｍ", "m");
        content = content.replaceAll("ｎ", "n");
        content = content.replaceAll("ｏ", "o");
        content = content.replaceAll("ｐ", "p");
        content = content.replaceAll("ｑ", "q");
        content = content.replaceAll("ｒ", "r");
        content = content.replaceAll("ｓ", "s");
        content = content.replaceAll("ｔ", "t");
        content = content.replaceAll("ｕ", "u");
        content = content.replaceAll("ｖ", "v");
        content = content.replaceAll("ｗ", "w");
        content = content.replaceAll("ｘ", "x");
        content = content.replaceAll("ｙ", "y");
        content = content.replaceAll("ｚ", "z");

        // 替换全角字符
        content = content.replaceAll("＠", "@");
        content = content.replaceAll("，", ", ");
        content = content.replaceAll("、", ", ");
        content = content.replaceAll("。", ". ");
        content = content.replaceAll("！", "! ");
        content = content.replaceAll("？", "? ");
        content = content.replaceAll("：", ": ");
        content = content.replaceAll("；", "; ");
        content = content.replaceAll("（", "(");
        content = content.replaceAll("）", ") ");
        content = content.replaceAll("【", "(");
        content = content.replaceAll("】", ") ");
        content = content.replaceAll("｛", "{");
        content = content.replaceAll("｝", "} ");
        content = content.replaceAll("＞", "> ");
        content = content.replaceAll("＜", "< ");
        content = content.replaceAll("》", "> ");
        content = content.replaceAll("《", "< ");
        content = content.replaceAll("≤", ">=");
        content = content.replaceAll("≥", "<=");
        content = content.replaceAll("‘", "\'");
        content = content.replaceAll("’", "\'");
        content = content.replaceAll("“", "\"");
        content = content.replaceAll("”", "\"");

        return content;
    }

    replaceOtherChars(content) {
        // 去掉特殊格式
        content = content.replaceAll("\\mathbb{", "{");
        content = content.replaceAll("\\mathrm{", "{");
        content = content.replaceAll("\\mathcal{", "{");
        content = content.replaceAll("\\mathbf{", "{");
        content = content.replaceAll("\\textit{", "{");
        content = content.replaceAll("\\textrm{", "{");
        content = content.replaceAll("\\boldsymbol{", "{");

        // 替换括号
        content = content.replace(/\\left\s*\\{/g, "{");
        content = content.replace(/\\left\s*\\}/g, "}");
        content = content.replace(/\\right\s*\\}/g, "}");
        content = content.replace(/\\right\s*\\{/g, "{");
        content = content.replace(/\\left\s*\./g, "");
        content = content.replace(/\\right\s*\./g, "");
        content = content.replace(/\\((left)|(right))\s*([[\]{}\(\)|<>])/g, "$4");

        // 去掉 operatorname
        content = content.replace(/\\operatorname\s*{([A-Za-z0-9]+)}/g, "$1");

        // 替换数学符号, 便于识别
        content = content.replace(/\\top([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "T$1");
        content = content.replaceAll("\\cdot", "×");
        content = content.replaceAll("\\times", "×");
        // content = content.replaceAll("\\pm", "±");
        content = content.replace(/\\pm([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "±$1");
        // content = content.replaceAll("\\mid", "|"); // 间隔
        content = content.replace(/\\mid([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "|$1"); // 间隔
        content = content.replaceAll("\\|", "||");
        // content = content.replaceAll("\\gets", "←");
        content = content.replace(/\\gets([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "←$1");
        content = content.replaceAll("\\longleftarrow", "←");
        content = content.replaceAll("\\Longleftarrow", "←");
        content = content.replaceAll("\\Leftarrow", "←");
        // content = content.replaceAll("\\to", "→");
        content = content.replace(/\\to([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "→$1");
        content = content.replaceAll("\\longrightarrow", "→");
        content = content.replaceAll("\\Rightarrow", "→");
        content = content.replaceAll("\\Longrightarrow", "→");
        content = content.replaceAll("\\leftrightarrow", "↔");
        content = content.replaceAll("\\longleftrightarrow", "↔");
        content = content.replaceAll("\\Leftrightarrow", "↔");
        content = content.replaceAll("\\Longleftrightarrow", "↔");
        content = content.replaceAll("\\because", "∵");
        content = content.replaceAll("\\therefore", "∴");
        content = content.replaceAll("\\approx", "≈");
        content = content.replaceAll("\\propto", "∝");
        // content = content.replaceAll("\\sim", "∼");
        content = content.replace(/\\sim([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "∼$1");
        content = content.replaceAll("\\nabla", "▽");

        // 替换希腊字母, 便于识别
        content = content.replaceAll("\\alpha", "α");
        content = content.replaceAll("\\beta", "β");
        content = content.replaceAll("\\gamma", "γ");
        content = content.replaceAll("\\Gamma", "Γ");
        content = content.replaceAll("\\delta", "δ");
        content = content.replaceAll("\\epsilon", "ε");
        content = content.replaceAll("\\varepsilon", "ε");
        content = content.replaceAll("\\zeta", "ζ");
        content = content.replaceAll("\\eta", "η");
        content = content.replaceAll("\\Theta", "Θ");
        content = content.replaceAll("\\theta", "θ");
        content = content.replaceAll("\\iota", "ι");
        content = content.replaceAll("\\kappa", "κ");
        content = content.replaceAll("\\lambda", "λ");
        // content = content.replaceAll("\\mu", "μ");
        // content = content.replaceAll("\\xi", "ξ");
        // content = content.replaceAll("\\pi", "π");
        content = content.replace(/\\mu([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "μ$1");
        content = content.replace(/\\xi([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "ξ$1");
        content = content.replace(/\\pi([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "π$1");
        content = content.replaceAll("\\rho", "ρ");
        content = content.replaceAll("\\sigma", "σ");
        content = content.replaceAll("\\tau", "τ");
        content = content.replaceAll("\\Phi", "Φ");
        content = content.replaceAll("\\phi", "Φ");
        content = content.replaceAll("\\varphi", "φ");
        // content = content.replaceAll("\\chi", "χ");
        content = content.replace(/\\chi([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "χ$1");
        content = content.replaceAll("\\psi", "ψ");
        content = content.replaceAll("\\omega", "ω");
        content = content.replaceAll("\\partial", "∂"); // 偏导

        // 替换数学花写字体, 便于识别
        content = content.replaceAll("\\ell", "l");
        content = content.replaceAll("\\imath", "i");
        content = content.replaceAll("\\jmath", "j");
        content = content.replaceAll("\\hbar", "h");
        content = content.replaceAll("^{\\prime}", "'");
        content = content.replaceAll("\\prime", "'");

        // 连加/连乘/max/min规范化
        content = content.replace(/\\sum\s*_/g, "\\sum\\limits_");
        content = content.replace(/\\prod\s*_/g, "\\prod\\limits_");
        content = content.replace(/\\min\s*_/g, "\\min\\limits_");
        content = content.replace(/\\max\s*_/g, "\\max\\limits_");

        // 如果括号内只有单个字符, 则去掉括号 { X } -> X
        content = content.replace(/(^|[[{\(\^_=<>\+\-\*/\|&%$@#!`~]){(\s*)(\w)(\s*)}/g, '$1$3');
        content = content.replace(/(^|[[{\(\^_=<>\+\-\*/\|&%$@#!`~]){{(\s*)(\w)(\s*)}}/g, '$1$3');

        // 独立的单行公式换成多行公式 -> $$ XXXX $$$$ 的内容变成新行显示
        content = content.replace(/^\s*\$\$(.*)\$\$\s*$/g, '$$$$\n$1\n$$$$');

        content = content.replace(/\\text\s*\{\s*([\sa-zA-Z0-9:=<>\+\-\*/\|&%$@#!`~]+)\s*\}/g, '$1'); // 公式中的 \text 删除掉, \text {overall } -> overall
        content = content.replace(/([a-zA-Z0-9:=<>\+\-\*/\|&%$@#!`~])\s*(\}\])/g, '$1$2'); // {overall } -> {overall}

        // ! 一些特殊替换
        // content = content.replace(/[^\.]\.\s*$/g, ''); // 去掉行末的句号
        // content = content.replaceAll("\\*", " * "); 
        content = content.replaceAll("\\*", "*"); // 0.2.17: 还原prettier替换的 *
        content = content.replaceAll("\\_", "_"); // 还原prettier替换的 _
        content = content.replaceAll("> >", ">>"); // 0.2.17: 还原prettier替换的 >>
        // content = content.replace(/^_(.*)_$/g, "*$1*"); // 0.2.17: 还原prettier替换的 *123* -> _123_

        // 非 "-  [ ]" (todo list)
        // 非 "|    |" (table)
        // 则多空格转成一个空格
        if ((content.search(/^\s*-\s{2}\[(\s|X|x)\]/) == -1) && (content.search(/^\|.*\|$/) == -1)) {
            content = content.replace(/(\S)\s+(\S)/g, '$1 $2'); // 多空格转成一个空格
        }

        // content = content.replace(/\s+([_\^\)\}])/g, '$1'); // 去掉部分符号前的空格, "abc ]" -> "abc]"

        // 0.2.13: "abc ]" -> "abc]", "[ abc" -> "[abc"
        content = content.replace(/(\w+)\s*([\]\)}_\^])/g, "$1$2");
        content = content.replace(/([\[\({_\^])\s*(\w+)/g, "$1$2");

        // 0.2.13: keep markdown todo list tag
        content = content.replaceAll("-  []", "-  [ ]");
        content = content.replaceAll("- []", "- [ ]");

        return content;
    }
}
