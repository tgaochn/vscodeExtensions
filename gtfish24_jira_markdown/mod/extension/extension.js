const vscode = require('vscode');
const path = require('path');

/**
 * Helper functions below
 */

function getCurrentDirectory(document) {
    return path.dirname(document.uri.path);
}

function getCurrentFilePath() {
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        // Get the first workspace folder
        const workspaceFolder = vscode.workspace.workspaceFolders[0];

        // Get the filesystem path
        const workspacePath = workspaceFolder.uri.fsPath;

        return workspacePath;
    } else {
        // No workspace is open
        return getCurrentDirectory(vscode.window.activeTextEditor.document);
    }
}

function getCurrentDatetimeText() {
    const now = new Date();

    // Get individual components
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // getMonth() returns 0-11
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // var rlt = year + month + day + " " + hour + minute + second;
    const formattedDateTime = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}${seconds.toString().padStart(2, '0')}`;

    return formattedDateTime;
}

function openNewDocumentWithConvertedText(directory, newFileText, fileExtension) {
    // Establish new file path for formatted file
    let curDatatime = getCurrentDatetimeText();
    let newFilePath = path.join(directory + '/tempfile/jira2md', curDatatime + fileExtension);

    const uri = vscode.Uri.file(newFilePath)
    const encoder = new TextEncoder();
    const data = encoder.encode('');

    return vscode.workspace.fs.writeFile(uri, data)
        .then(() => vscode.workspace.openTextDocument(uri))
        .then(document => {
            let addedText = new vscode.WorkspaceEdit();
            addedText.insert(uri, new vscode.Position(0, 0), newFileText);

            return vscode.workspace.applyEdit(addedText).then(success => {
                if (success) {
                    return vscode.window.showTextDocument(document, {
                        viewColumn: vscode.ViewColumn.Active,
                        preview: false
                    });
                } else {
                    vscode.window.showInformationMessage('Sorry, we were unable to show you the converted text!');
                    return null;
                }
            });
        })
        .catch(error => {
            vscode.window.showErrorMessage('Error creating or opening file: ' + error);
        });
}

function toMarkdownString(text) {
    return text.replace(/^[ \t]*(\*+)\s+/gm, function (match, stars) {
        return Array(stars.length).join("  ") + '* ';
    })
        // Un-ordered lists
        .replace(/^[ \t]*(#+)\s+/gm, function (match, nums) {
            return Array(nums.length).join("  ") + '1. ';
        })
        // Headers 1-6
        .replace(/^h([0-6])\.(.*)$/gm, function (match, level, content) {
            return Array(parseInt(level) + 1).join('#') + content;
        })
        // Bold
        .replace(/\*(\S.*)\*/g, '**$1**')
        // ! Italic - canceled due to buggy regex
        // .replace(/\_(\S.*)\_/g, '*$1*')
        // Monospaced text
        .replace(/\{\{([^}]+)\}\}/g, '`$1`')
        // Citations (buggy)
        //.replace(/\?\?((?:.[^?]|[^?].)+)\?\?/g, '<cite>$1</cite>')
        // ! Inserts - canceled due to buggy regex
        // .replace(/\+([^+]*)\+/g, '<ins>$1</ins>')
        // Superscript
        .replace(/\^([^^]*)\^/g, '<sup>$1</sup>')
        // Subscript
        .replace(/~([^~]*)~/g, '<sub>$1</sub>')
        // Strikethrough
        .replace(/\s+-(\S+.*?\S)-\s+/g, ' ~~$1~~ ')
        // Code Block
        .replace(/\{code(:([a-z]+))?([:|]?(title|borderStyle|borderColor|borderWidth|bgColor|titleBGColor)=.+?)*\}([^]*)\{code\}/gm, '```$2$5```')
        // Pre-formatted text
        .replace(/{noformat}/g, '```')
        // ! Un-named Links - bug fixed
        // .replace(/\[([^|]+)\]/g, '<$1>')
        .replace(/\[([^\]\|]+)\]/g, '<$1>')
        // ! Named Links - bug fixed
        // .replace(/\[(.+?)\|(.+)\]/g, '[$1]($2)')
        .replace(/\[([^\|]+)\|([^\]]+)\]/g, '[$1]($2)')
        // Single Paragraph Blockquote
        .replace(/^bq\.\s+/gm, '> ')
        // Remove color: unsupported in md
        .replace(/\{color:[^}]+\}([^]*)\{color\}/gm, '$1')
        // panel into table
        .replace(/\{panel:title=([^}]*)\}\n?([^]*?)\n?\{panel\}/gm, '\n| $1 |\n| --- |\n| $2 |')
        // table header
        .replace(/^[ \t]*((?:\|\|.*?)+\|\|)[ \t]*$/gm, function (match, headers) {
            var singleBarred = headers.replace(/\|\|/g, '|');
            return '\n' + singleBarred + '\n' + singleBarred.replace(/\|[^|]+/g, '| --- ');
        })
        // remove leading-space of table headers and rows
        .replace(/^[ \t]*\|/gm, '|');

}

function toMarkdownString2(input) {
    // function from https://github.com/FokkeZB/J2M/blob/master/src/J2M.js
    // !! seems not working properly

    input = input.replace(/^bq\.(.*)$/gm, function (match, content) {
        return '> ' + content + "\n";
    });

    input = input.replace(/([*_])(.*)\1/g, function (match, wrapper, content) {
        var to = (wrapper === '*') ? '**' : '*';
        return to + content + to;
    });

    // multi-level numbered list
    input = input.replace(/^((?:#|-|\+|\*)+) (.*)$/gm, function (match, level, content) {
        var len = 2;
        var prefix = '1.';
        if (level.length > 1) {
            len = parseInt((level.length - 1) * 4) + 2;
        }

        // take the last character of the level to determine the replacement
        var prefix = level[level.length - 1];
        if (prefix == '#') prefix = '1.';

        return Array(len).join(" ") + prefix + ' ' + content;
    });

    // headers, must be after numbered lists
    input = input.replace(/^h([0-6])\.(.*)$/gm, function (match, level, content) {
        return Array(parseInt(level) + 1).join('#') + content;
    });

    input = input.replace(/\{\{([^}]+)\}\}/g, '`$1`');
    input = input.replace(/\?\?((?:.[^?]|[^?].)+)\?\?/g, '<cite>$1</cite>');
    input = input.replace(/\+([^+]*)\+/g, '<ins>$1</ins>');
    input = input.replace(/\^([^^]*)\^/g, '<sup>$1</sup>');
    input = input.replace(/~([^~]*)~/g, '<sub>$1</sub>');
    input = input.replace(/-([^-]*)-/g, '-$1-');

    input = input.replace(/\{code(:([a-z]+))?\}([^]*?)\{code\}/gm, '```$2$3```');
    input = input.replace(/\{quote\}([^]*)\{quote\}/gm, function (match, content) {
        lines = content.split(/\r?\n/gm);

        for (var i = 0; i < lines.length; i++) {
            lines[i] = '> ' + lines[i];
        }

        return lines.join("\n");
    });

    // Images with alt= among their parameters
    input = input.replace(/!([^|\n\s]+)\|([^\n!]*)alt=([^\n!\,]+?)(,([^\n!]*))?!/g, '![$3]($1)');
    // Images with just other parameters (ignore them)
    input = input.replace(/!([^|\n\s]+)\|([^\n!]*)!/g, '![]($1)');
    // Images without any parameters or alt
    input = input.replace(/!([^\n\s!]+)!/g, '![]($1)');

    input = input.replace(/\[([^|]+)\|(.+?)\]/g, '[$1]($2)');
    input = input.replace(/\[(.+?)\]([^\(]+)/g, '<$1>$2');

    input = input.replace(/{noformat}/g, '```');
    input = input.replace(/{color:([^}]+)}([^]*?){color}/gm, '<span style="color:$1">$2</span>');

    // Convert header rows of tables by splitting input on lines
    lines = input.split(/\r?\n/gm);
    lines_to_remove = []
    for (var i = 0; i < lines.length; i++) {
        line_content = lines[i];

        seperators = line_content.match(/\|\|/g);
        if (seperators != null) {
            lines[i] = lines[i].replace(/\|\|/g, "|");
            console.log(seperators)

            // Add a new line to mark the header in Markdown,
            // we require that at least 3 -'s are between each |
            header_line = "";
            for (var j = 0; j < seperators.length - 1; j++) {
                header_line += "|---";
            }

            header_line += "|";

            lines.splice(i + 1, 0, header_line);

        }
    }

    // Join the split lines back
    input = ""
    for (var i = 0; i < lines.length; i++) {
        input += lines[i] + "\n"
    }

    return input;
};

function toMarkdown() {
    let document = vscode.window.activeTextEditor.document;
    let markdownFormatted = toMarkdownString(document.getText())
    openNewDocumentWithConvertedText(getCurrentFilePath(), markdownFormatted, ".md");
}

function toJiraString(text) {
    var map = {
        //cite: '??',
        del: '-',
        ins: '+',
        sup: '^',
        sub: '~'
    };
    return text
        // Bold, Italic, and Combined (bold+italic)
        .replace(/([*_]+)(\S.*?)\1/g, function (match, wrapper, content) {
            switch (wrapper.length) {
                case 1: return '_' + content + '_';
                case 2: return '*' + content + '*';
                case 3: return '_*' + content + '*_';
                default: return wrapper + content * wrapper;
            }
        })
        // All Headers (# format)
        .replace(/^([#]+)(.*?)$/gm, function (match, level, content) {
            return 'h' + level.length + '.' + content;
        })
        // Headers (H1 and H2 underlines)
        .replace(/^(.*?)\n([=-]+)$/gm, function (match, content, level) {
            return 'h' + (level[0] === '=' ? 1 : 2) + '. ' + content;
        })
        // Ordered lists
        .replace(/^([ \t]*)\d+\.\s+/gm, function (match, spaces) {
            return Array(Math.floor(spaces.length / 2 + 1)).join("#") + '# ';
        })
        // Un-Ordered Lists
        .replace(/^([ \t]*)\*\s+/gm, function (match, spaces) {
            return Array(Math.floor(spaces.length / 2 + 1)).join("*") + '* ';
        })
        // Headers (h1 or h2) (lines "underlined" by ---- or =====)
        // Citations, Inserts, Subscripts, Superscripts, and Strikethroughs
        .replace(new RegExp('<(' + Object.keys(map).join('|') + ')>(.*?)<\/\\1>', 'g'), function (match, from, content) {
            var to = map[from];
            return to + content + to;
        })
        // Other kind of strikethrough
        .replace(/\s+~~(.*?)~~\s+/g, ' -$1- ')
        // Named/Un-Named Code Block
        .replace(/`{3,}(\w+)?((?:\n|[^`])+)`{3,}/g, function (match, synt, content) {
            var code = '{code';
            if (synt) code += ':' + synt;
            return code + '}' + content + '{code}';
        })
        // Inline-Preformatted Text
        .replace(/`([^`]+)`/g, '{{$1}}')
        // Named Link
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '[$1|$2]')
        // Un-Named Link
        .replace(/<([^>]+)>/g, '[$1]')
        // Single Paragraph Blockquote
        .replace(/^>/gm, 'bq.')
        // ! tables - still buggy but it seems that most of the time it works
        .replace(/^\s*(\|(?:.*?\|)+)\s*\n\s*(\|(?:\s*:?-+:?\s*\|)+)\s*\n((?:\s*\|(?:.*?\|)+\s*\n?)*)/gm,
            function (match, headerLine, separatorLine, rowstr) {
                var headers = headerLine.match(/(?<=\|)[^|]+(?=\|)/g);
                var separators = separatorLine.match(/(?<=\|)[^|]+(?=\|)/g);
                if (headers.length !== separators.length) {
                    return match;
                }
                headers = headers.map(h => h.trim());
                var rows = rowstr.trim().split('\n');
                if (rows.length === 1 && headers.length === 1) {
                    // panel
                    return '{panel:title=' + headers[0].trim() + '}\n' +
                        rows[0].replace(/^\|(.*)[ \t]*\|$/, '$1').trim() +
                        '\n{panel}\n\n';
                } else {
                    var jiraTable = '||' + headers.join('||') + '||\n' +
                        rows.map(row => row.trim().replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '[$1|$2]')).join('\n');

                    // Preserve empty lines after the table
                    var emptyLinesAfter = match.match(/\n*$/)[0];
                    return jiraTable + emptyLinesAfter;
                }
            });
}

function toJiraString2(input) {
    // function from https://github.com/FokkeZB/J2M/blob/master/src/J2M.js
    // !! seems not working properly

    // remove sections that shouldn't be recursively processed
    var START = 'J2MBLOCKPLACEHOLDER';
    var replacementsList = [];
    var counter = 0;

    input = input.replace(/`{3,}(\w+)?((?:\n|.)+?)`{3,}/g, function (match, synt, content) {
        var code = '{code';

        if (synt) {
            code += ':' + synt;
        }

        code += '}' + content + '{code}';
        var key = START + counter++ + '%%';
        replacementsList.push({ key: key, value: code });
        return key;
    });

    input = input.replace(/`([^`]+)`/g, function (match, content) {
        var code = '{{' + content + '}}';
        var key = START + counter++ + '%%';
        replacementsList.push({ key: key, value: code });
        return key;
    });

    input = input.replace(/`([^`]+)`/g, '{{$1}}');

    input = input.replace(/^(.*?)\n([=-])+$/gm, function (match, content, level) {
        return 'h' + (level[0] === '=' ? 1 : 2) + '. ' + content;
    });

    input = input.replace(/^([#]+)(.*?)$/gm, function (match, level, content) {
        return 'h' + level.length + '.' + content;
    });

    input = input.replace(/([*_]+)(.*?)\1/g, function (match, wrapper, content) {
        var to = (wrapper.length === 1) ? '_' : '*';
        return to + content + to;
    });

    // multi-level bulleted list
    input = input.replace(/^(\s*)- (.*)$/gm, function (match, level, content) {
        var len = 2;
        if (level.length > 0) {
            len = parseInt(level.length / 4.0) + 2;
        }
        return Array(len).join("-") + ' ' + content;
    });

    // multi-level numbered list
    input = input.replace(/^(\s+)1. (.*)$/gm, function (match, level, content) {
        var len = 2;
        if (level.length > 1) {
            len = parseInt(level.length / 4) + 2;
        }
        return Array(len).join("#") + ' ' + content;
    });

    var map = {
        cite: '??',
        del: '-',
        ins: '+',
        sup: '^',
        sub: '~'
    };

    input = input.replace(new RegExp('<(' + Object.keys(map).join('|') + ')>(.*?)<\/\\1>', 'g'), function (match, from, content) {
        //console.log(from);
        var to = map[from];
        return to + content + to;
    });

    input = input.replace(/<span style="color:(#[^"]+)">([^]*?)<\/span>/gm, '{color:$1}$2{color}');

    input = input.replace(/~~(.*?)~~/g, '-$1-');

    // Images without alt
    input = input.replace(/!\[\]\(([^)\n\s]+)\)/g, '!$1!');
    // Images with alt
    input = input.replace(/!\[([^\]\n]+)\]\(([^)\n\s]+)\)/g, '!$2|alt=$1!');

    input = input.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '[$1|$2]');
    input = input.replace(/<([^>]+)>/g, '[$1]');

    // restore extracted sections
    for (var i = 0; i < replacementsList.length; i++) {
        var sub = replacementsList[i];
        input = input.replace(sub["key"], sub["value"]);
    }

    // Convert header rows of tables by splitting input on lines
    lines = input.split(/\r?\n/gm);
    lines_to_remove = []
    for (var i = 0; i < lines.length; i++) {
        line_content = lines[i];

        if (line_content.match(/\|---/g) != null) {
            lines[i - 1] = lines[i - 1].replace(/\|/g, "||")
            lines.splice(i, 1)
        }
    }

    // Join the split lines back
    input = ""
    for (var i = 0; i < lines.length; i++) {
        input += lines[i] + "\n"
    }
    return input;
};

function toJira() {
    let document = vscode.window.activeTextEditor.document;
    let jiraFormatted = toJiraString(document.getText());
    openNewDocumentWithConvertedText(getCurrentFilePath(), jiraFormatted, ".jira");
}

// Method is called when the extension is first activated
function activate(context) {
    console.log('The Markdown <-> JIRA extension is now active!');

    // Register the commands for converting Markdown and JIRA
    let to_jira = vscode.commands.registerCommand('extension.convertMarkdown',
        function () {
            toJira();
        }
    );
    let to_markdown = vscode.commands.registerCommand('extension.convertJira',
        function () {
            toMarkdown();
        }
    );
    context.subscriptions.push(to_jira, to_markdown);
}
exports.activate = activate;

// Method is called when the extension is deactivated
function deactivate() {
    vscode.window.showInformationMessage(":(");
}
exports.deactivate = deactivate;