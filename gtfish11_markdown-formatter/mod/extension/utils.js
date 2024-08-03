// !! T5: 生效范围: 常规md范围, 非代码内部, 不含分隔符, 如: (), [], {}, ``, ""
function noDelimiterReplace(content) {
    content = replaceMathChars(content);

    // ! 一些特殊替换
    // content = content.replaceAll("\\*", " * "); 
    content = content.replaceAll("\\*", "*"); // 0.2.17: 还原prettier替换的 *
    content = content.replaceAll("\\_", "_"); // 还原prettier替换的 _
    // content = content.replace(/^_(.*)_$/g, "*$1*"); // 0.2.17: 还原prettier替换的 *123* -> _123_

    // 0.2.13: "abc ]" -> "abc]", "[ abc" -> "[abc"
    content = content.replace(/(\w+)\s*([\]\)}_\^])/g, "$1$2");
    content = content.replace(/([\[\({_\^])\s*(\w+)/g, "$1$2");

    // // 0.4.4: 部分字符前增加空格
    content = content.replace(/([^\s{\[\(}\]\)!])([\[\(])/g, '$1 $2'); // `a(` -> `a (`

    // // 0.4.4: 部分字符后增加空格
    content = content.replace(/([\]\)])([^\s}\]\){\[\(,:])/g, '$1 $2'); // `)a` -> `) a`
    content = content.replace(/(,)([^\d\s}\]\){\[\(,:])/g, '$1 $2'); // 逗号特殊处理, `,a` -> `, a` / `1,000` -> `1,000`
    content = content.replace(/(:)([\u4e00-\u9fa5\u3040-\u30FFa-zA-Z])/g, '$1 $2'); // `:a` -> `: a`

    // 0.4.4: 部分字符前/后增加空格
    content = content.replace(/(\S)\s*(\+|-|=)\s*(\S)/g, "$1 $2 $3"); // `a+b` -> `a + b`

    // 0.4.4: 部分字符前减少空格
    content = content.replace(/\s+[,]/g, ','); // ` ,` -> `,`
    content = content.replace(/\s+$/g, ''); // 移除每个部分的尾部空格
    content = content.replace(/(\(|\[|\"|\'|<)\s+(\(|\[|\"|\'|<)/g, '$1$2'); // `[ (` -> `[(`
    content = content.replace(/(\)|\]|\"|\'|>)\s+(\)|\]|\"|\'|>)/g, '$1$2'); // `] )` -> `])`

    return content;
}

// !! T4: 生效范围: 常规md范围, 非代码内部, 处理带分隔符的内容, 如: (), [], {}, ``, ""
// 一般每行只有一个的标志符在这里处理
function regularReplace(content) {
    // 处理标题 header
    content = processHeaders(content);

    // 0.2.17: 还原分开的 > >
    content = content.replaceAll("> >", ">>");

    // ! 处理带有分隔符的字符, 即: cont1`cont2`cont3, 只修改 cont1, cont3
    content = processContentWithDelimiters(content);

    // ! cont1, cont2, cont3 之间不应该加空格的情况则删掉空格
    content = content.replace(/([\(\[\{<"'])\s*`/g, '$1`'); // 前空格
    content = content.replace(/`\s*([\)\]\}>"'])/g, '`$1'); // 后空格

    // 0.2.11: 汉字和英文之间加空格
    content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF])\s*([a-zA-Z0-9]|(@|&|=|\[|\$|\%|\^|\-|\+|\(|`))/g, '$1 $2'); // 不修改正反斜杠, 避免路径被改乱
    content = content.replace(/([a-zA-Z0-9]|(!|&|;|=|\]|,|\.|:|\?|\$|%|\^|\-|\+|\)|`))\s*([\u4e00-\u9fa5\u3040-\u30FF])/g, "$1 $3");

    // 0.2.13: keep markdown todo list tag
    content = content.replace(/-\s+\[\s*\]/g, "- [ ]");
    content = content.replace(/-\s+\[[xX]\]/g, "- [x]");

    // 非 "-  [ ]" (todo list)
    // 非 "|    |" (table)
    // 则多空格转成一个空格
    // if ((content.search(/^\s*-\s{2}\[(\s|X|x)\]/) == -1) && (content.search(/^\|.*\|$/) == -1)) {
    if (content.search(/^\|.*\|$/) == -1) {
        content = content.replace(/(\S)\s+(\S)/g, '$1 $2'); // 多空格转成一个空格
    }

    // 移除行尾空格
    // content = content.replace(/(.*)[\r\n]$/g, "$1").replace(/(\s*$)/g, "");

    return content;
}

// !! T3: 代码块内生效, 即 ```content``` 内生效
function codeBlockReplace(content) {
    // 0.2.11: 汉字和英文之间加空格
    content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF])([a-zA-Z0-9@&=\[\$\%\^\-\+(])/g, '$1 $2'); // 不修改正反斜杠, 避免路径被改乱
    content = content.replace(/([a-zA-Z0-9!&;=\],\.\:\?\$\%\^\-\+\)])([\u4e00-\u9fa5\u3040-\u30FF])/g, "$1 $2");

    return content;
}

// !! T2: links 内生效, 即 [content] (content) `content`
function linkReplace(content) {
    // 修复 markdown 链接所使用的标点。
    // content = content.replace(/[『\[]([^』\]]+)[』\]][『\[]([^』\]]+)[』\]]/g, "[$1]($2)");
    // content = content.replace(/[『\[]([^』\]]+)[』\]][（(]([^』)]+)[）)]/g, "[$1]($2)");

    return content;
}

// !! T1: 全局生效, 输入为单行, \n等特殊符号替换时可能有问题
function globalReplaceOnLine(content) {
    content = replaceFullChars(content); // 全角英文和标点

    // 非 "-  [ ]" (todo list)
    // 非 "|    |" (table)
    // 则多空格转成一个空格
    // if ((content.search(/^\s*-\s{2}\[(\s|X|x)\]/) == -1) && (content.search(/^\|.*\|$/) == -1)) {
    if (content.search(/^\|.*\|$/) == -1) {
        content = content.replace(/(\S)\s+(\S)/g, '$1 $2'); // 多空格转成一个空格
    }

    // 移除行尾空格
    content = content.replace(/(.*)[\r\n]$/g, "$1").replace(/(\s*$)/g, "");

    // 0.2.12: [ ( -> [(
    content = content.replace(/([\[\({_\^])\s*([\[\({_\^])/g, "$1$2");

    // 0.2.13: ) ] -> )]
    content = content.replace(/([\]\)}_\^])\s*([\]\)}_\^])/g, "$1$2");

    // ! super ugly way to deal with the case of \\\\ - part 1
    // 如果\\后面没有换行符, 则在\\后面加一个空行 (先加一个特殊符号, 然后再替换)
    content = content.replace(/\\\\((?!$))/g, '\\\\¶$1');

    return content
}

// !! T0: 全局生效, 输入为整个文件 (方便处理多行内容, 加换行等)
function globalReplaceOnFile(content) {
    // ! 只有在需要匹配多行或者修改有问题的才需要在这里改, 比如不能插入换行符的

    // 独立的单行公式换成多行公式:  $$ XXXX $$ 的公式内容变成新行显示
    content = content.replace(/\$\$\s*(.*)\s*\$\$/g, `$$$$\n$1\n$$$$`);

    // 多行公式: \begin{aligned} formula \end{aligned} 分行显示
    content = content.replace(/((\$\$)?)\s*(\\begin{aligned.?})(.*)(\\end{aligned.?})\s*((\$\$)?)/g, '$1\n$3\n$4\n$5\n$6');

    // ! super ugly way to deal with the case of \\\\ - part 2
    // 如果\\后面没有换行符, 则在\\后面加一个空行 (先加一个特殊符号, 然后再替换)
    content = content.replace(/\\\\¶/g, '\\\\\n');

    // 多个空行缩成一行
    content = content.replace(/\n\n+/g, '\n\n');

    return content
}

// 替换全角字符
function replaceFullChars(content) {
    // 替换全角数字
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

    // 全角英文
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
    content = content.replaceAll("『", "[");
    content = content.replaceAll("』", "]");
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

// 数学公式符号替换
function replaceMathChars(content) {
    // 简化数学符号, 便于识别
    content = content.replaceAll("\\cdot", "×");
    content = content.replaceAll("\\times", "×");
    content = content.replaceAll("\\|", "||");
    content = content.replaceAll("\\longleftarrow", "←");
    content = content.replaceAll("\\Longleftarrow", "←");
    content = content.replaceAll("\\Leftarrow", "←");
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
    content = content.replaceAll("\\nabla", "▽");
    content = content.replace(/\\top([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "T$1");
    content = content.replace(/\\pm([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "±$1");
    content = content.replace(/\\mid([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "|$1"); // 间隔
    content = content.replace(/\\gets([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "←$1");
    content = content.replace(/\\to([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "→$1");
    content = content.replace(/\\sim([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "∼$1");

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
    content = content.replaceAll("\\rho", "ρ");
    content = content.replaceAll("\\sigma", "σ");
    content = content.replaceAll("\\tau", "τ");
    content = content.replaceAll("\\Phi", "Φ");
    content = content.replaceAll("\\phi", "Φ");
    content = content.replaceAll("\\varphi", "φ");
    content = content.replaceAll("\\psi", "ψ");
    content = content.replaceAll("\\omega", "ω");
    content = content.replaceAll("\\partial", "∂"); // 偏导
    content = content.replace(/\\mu([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "μ$1");
    content = content.replace(/\\xi([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "ξ$1");
    content = content.replace(/\\pi([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "π$1");
    content = content.replace(/\\chi([\s[\^_=<>\+\-\*/\|&%$@#!`~[\]{}\(\)]|$)/g, "χ$1");

    // 替换数学花写字体, 便于识别
    content = content.replaceAll("\\ell", "l");
    content = content.replaceAll("\\imath", "i");
    content = content.replaceAll("\\jmath", "j");
    content = content.replaceAll("\\hbar", "h");
    content = content.replaceAll("^{\\prime}", "'");
    content = content.replaceAll("\\prime", "'");

    // 去掉括号的修饰符
    content = content.replaceAll("\\mathbb{", "{");
    content = content.replaceAll("\\mathrm{", "{");
    content = content.replaceAll("\\mathcal{", "{");
    content = content.replaceAll("\\mathbf{", "{");
    content = content.replaceAll("\\textit{", "{");
    content = content.replaceAll("\\textrm{", "{");
    content = content.replaceAll("\\boldsymbol{", "{");
    content = content.replace(/\\left\s*\\{/g, "{");
    content = content.replace(/\\left\s*\\}/g, "}");
    content = content.replace(/\\right\s*\\}/g, "}");
    content = content.replace(/\\right\s*\\{/g, "{");
    content = content.replace(/\\left\s*\./g, "");
    content = content.replace(/\\right\s*\./g, "");
    content = content.replace(/\\((left)|(right))\s*([[\]{}\(\)|<>])/g, "$4");

    // 去掉 operatorname
    content = content.replace(/\\operatorname\s*{([A-Za-z0-9]+)}/g, "$1");

    // 去掉修饰符 \\:
    content = content.replaceAll(/\\:(\S)\\:/g, "$1"); // =+ 等符号去掉周围的修饰符, 如: `\\:=\\:` -> `=`
    content = content.replaceAll("\\:\\", "\\"); // `\:\cos` -> `\cos`

    // 连加/连乘/max/min规范化
    content = content.replace(/\\Sigma\s*_/g, "\\sum\\limits_");
    content = content.replace(/\\sum\s*_/g, "\\sum\\limits_");
    content = content.replace(/\\prod\s*_/g, "\\prod\\limits_");
    content = content.replace(/\\min\s*_/g, "\\min\\limits_");
    content = content.replace(/\\max\s*_/g, "\\max\\limits_");

    // 如果是独立的括号+word, 则去掉括号, 如: `={ 100 }` -> `=100`
    content = content.replace(/(^|[[{\(\^_=<>\+\-\*/\|&%$@#!`~])\s*{{1,2}(\s*)(\w)(\s*)}{1,2}/g, '$1$3');
    // 如果括号内只有单个字符, 则去掉括号 { X } -> X, 带个空格防止出错
    content = content.replace(/{\s*(\S)\s*}/g, ' $1');

    content = content.replace(/\\text\s*\{\s*([\sa-zA-Z0-9:=<>\+\-\*/\|&%$@#!`~]+)\s*\}/g, '$1'); // 公式中的 \text 删除掉, \text {overall } -> overall
    content = content.replace(/([a-zA-Z0-9:=<>\+\-\*/\|&%$@#!`~])\s*(\}\])/g, '$1$2'); // {overall } -> {overall}

    return content;
}

// !! 替换标题
function headerReplace(content) {
    // 标题后加入一个空格
    if (content.trim().search(/(^#{1,6}\s+)([\r\n]*)/) == -1) {
        // 0.2.16: skip md tags: #XX
        // content = content.trim().replace(/(^#{1,6})(.*)/, "$1 $2");
    } else {
        content = content.trim().replace(/(^#{1,6})\s+(.*)/, "$1 $2");
    }
    // 标题前后加入空行
    content = content.trim().replace(/(^#{1,6}.*)([\r\n]*)/, "\n$1\n");

    return content
}

// 处理标题行
function processHeaders(line) {
    const headerRegex = /(^#{1,6}.*)([\r\n]*)/;
    if (headerRegex.test(line.trim())) {
        return headerReplace(line);
    }
    return line;
}

// 检测当前行是不是链接行
function isLink(content) {
    return /tags:.*/.test(content) ||               // obsidian - tags: XX
        /^\s*\[.*\]\(.*\)\s*$/.test(content) ||     // [XX](XX)
        /^\s*\[.*\]\s*$/.test(content) ||           // [XX]
        /^\s*\(.*\)\s*$/.test(content) ||           // (XX)
        /^\s*{.*}\s*$/.test(content) ||             // {XX}
        /^\s*<.*>\s*$/.test(content) ||             // <XX>
        /^\s*`[^`]+`\s*$/.test(content) ||          // `XX`
        /^\s*"[^"]+"\s*$/.test(content) ||          // "XX"
        /^\s*'[^']+'\s*$/.test(content);            // 'XX'
}

// Assemble the final content while managing newlines
function assembleFormattedContent(lines) {
    let content = "";
    let lastWasEmptyLine = false;

    lines.forEach(line => {
        if (line.trim().length === 0) {
            if (!lastWasEmptyLine) {
                content += "\n";
                lastWasEmptyLine = true;
            }
        } else {
            content += line + "\n";
            lastWasEmptyLine = false;
        }
    });

    return content.trim() + "\n";
}

// Check if a line starts a code block
function isCodeBlockStart(line) {
    return line.trim().startsWith("```") || line.trim().startsWith('{code');
}

function processMdContent(content) {
    let inCodeBlock = false;

    const processLine = (line) => {
        // !! T1: 全局生效, 输入为单行, \n等特殊符号替换时可能有问题
        line = globalReplaceOnLine(line);

        if (isCodeBlockStart(line)) {
            inCodeBlock = !inCodeBlock;
            return inCodeBlock ? "\n" + line : line + "\n";
        }

        if (/^@import /.test(line.trim())) {
            return line;
        }

        // !! T2: links 内生效, 即 [content] (content) `content`
        if (isLink(line)) {
            return linkReplace(line);
        }

        // !! T3: 代码块内生效, 即 ```content``` 内生效
        if (inCodeBlock) {
            return codeBlockReplace(line);
        }

        // !! T4: 生效范围: 常规md范围, 非链接, 非代码部分
        line = regularReplace(line);

        return line;
    };

    let lines = content.split("\n").map(processLine);
    let finalContent = assembleFormattedContent(lines);

    // !! T0: 全局生效, 输入为整个文件 (方便处理换行等)
    finalContent = globalReplaceOnFile(finalContent);

    return finalContent;
}

function processContentWithDelimiters(content) {
    const delimiters = [
        { start: '(', end: ')' },
        { start: '[', end: ']' },
        { start: '{', end: '}' },
        { start: '<', end: '>' },
        { start: '`', end: '`' },
        { start: '"', end: '"' },
        { start: "'", end: "'" },
        { start: "\\$", end: "\\$" }  // Note the escaped $
    ];

    let result_list = [];
    let remaining = content;
    let isFirstElement = true;

    while (remaining.length > 0) {
        let earliestMatch = { index: Infinity, delimiter: null };

        // Find the earliest occurring delimiter
        for (let delimiter of delimiters) {
            let startIndex = remaining.indexOf(delimiter.start);
            if (startIndex !== -1 && startIndex < earliestMatch.index) {
                earliestMatch = { index: startIndex, delimiter: delimiter };
            }
        }

        if (earliestMatch.index === Infinity) {
            // No more delimiters found, process the remaining content
            if (!isFirstElement) {
                result_list.push(" ");
            }
            result_list.push(noDelimiterReplace(remaining));
            break;
        }

        // Process content before the delimiter
        if (earliestMatch.index > 0) {
            if (!isFirstElement) {
                result_list.push(" ");
            }
            result_list.push(noDelimiterReplace(remaining.slice(0, earliestMatch.index)));
            isFirstElement = false;
        }

        // Find the end of the delimited content
        let endIndex = remaining.indexOf(earliestMatch.delimiter.end, earliestMatch.index + 1);
        if (endIndex === -1) {
            // End delimiter not found, treat the rest as normal content
            if (!isFirstElement) {
                result_list.push(" ");
            }
            result_list.push(noDelimiterReplace(remaining.slice(earliestMatch.index)));
            break;
        }

        // Add the delimited content without processing
        if (!isFirstElement) {
            result_list.push(" ");
        }
        let delimitedContent = remaining.slice(earliestMatch.index, endIndex + 1);
        result_list.push(delimitedContent);
        isFirstElement = false;

        // Move to the remaining content
        remaining = remaining.slice(endIndex + 1);
    }

    let result = result_list.join("");

    return result;
}

module.exports = {
    regularReplace,
    codeBlockReplace,
    linkReplace,
    globalReplaceOnLine,
    globalReplaceOnFile,
    headerReplace,
    isLink,
    processMdContent,
    replaceMathChars,
    isCodeBlockStart,
    noDelimiterReplace,
    processContentWithDelimiters
}
