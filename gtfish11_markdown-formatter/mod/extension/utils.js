// 额外删除空格
function trimExtraSpace(content) {
    // 各种缩减空格
    content = content.replace(/(\[|\(|{|_|\^|!)\s*(\[|\(|{|_|\^)/g, "$1$2"); // [ ( -> [(
        content = content.replace(/(\]|\)|}|_|\^)\s*(\]|\)|}|_|\^|\[|\(|{)/g, "$1$2"); // ) ] -> )], ) [ -> )[
    
    return content;
}

// !! T5: 生效范围: 常规md范围, 非代码内部, 不含分隔符, 如: (), [], {}, ``, ""
function noDelimiterReplace(content) {
    // ! 一些特殊替换
    // content = content.replaceAll("\\*", " * "); 
    content = content.replaceAll("\\*", "*"); // 还原prettier替换的 *
    content = content.replaceAll("\\_", "_"); // 还原prettier替换的 _
    // content = content.replace(/^_(.*)_$/g, "*$1*"); // 还原prettier替换的 *123* -> _123_

    // "abc ]" -> "abc]", "[ abc" -> "[abc"
    content = content.replace(/(\w+)\s*([\]\)}_\^])/g, "$1$2");
    content = content.replace(/([\[\({_\^])\s*(\w+)/g, "$1$2");

    // 部分字符前增加空格
    content = content.replace(/([^\s{\[\(}\]\)!])([\[\(])/g, '$1 $2'); // `a(` -> `a (`

    // 部分字符后增加空格
    content = content.replace(/([\]\)])([^\s}\]\){\[\(,:])/g, '$1 $2'); // `)a` -> `) a`
    content = content.replace(/(,)([^\d\s}\]\){\[\(,:])/g, '$1 $2'); // 逗号特殊处理, `,a` -> `, a` / `1,000` -> `1,000`

    // 部分字符前/后增加空格
    content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FFa-zA-Z0-9])(\+)([\u4e00-\u9fa5\u3040-\u30FFa-zA-Z0-9])/g, "$1 $2 $3"); // `a+b` -> `a + b`
    content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FFa-zA-Z0-9])\s+(\+|-)\s+([\u4e00-\u9fa5\u3040-\u30FFa-zA-Z0-9])/g, "$1 $2 $3"); // `a  +  b` -> `a + b`, 不 match `a+ b`
    content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FFa-zA-Z])\s*(:)\s*([\u4e00-\u9fa5\u3040-\u30FFa-zA-Z])/g, "$1$2 $3"); // `a    :b` -> `a: b`, 不 match `13:48:38`
    content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FFa-zA-Z0-9])\s*(=|<|>)\s*([\u4e00-\u9fa5\u3040-\u30FFa-zA-Z0-9])/g, "$1 $2 $3"); // `a  =b` -> `a = b`, 防止 <link>和大于/小于的歧义
    // content = content.replace(/(\/)\s*(\S)/g, "\/ $2"); // `a/b` -> `a / b`; 补充要加的空格

    // ! 汉字和英文/符号之间加空格 (part 1); 不修改正反斜杠, 避免路径被改乱 - 可能出现在路径里, 所以放在 noDelimiterReplace 函数中
    content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF])\s*([a-zA-Z0-9]|(@|&|=|\[|\$|\%|\^|\-|\+|\(|`))/g, '$1 $2'); // 汉字+字符/符号要分开
    content = content.replace(/([a-zA-Z0-9]|(!|&|;|=|\]|,|\.|:|\?|\$|%|\^|\-|\+|\)|`))\s*([\u4e00-\u9fa5\u3040-\u30FF])/g, "$1 $3"); // 字符/符号+汉字要分开


    // 移除每个部分的尾部空格
    content = content.replace(/\s+$/g, '');

    return content;
}

// !! T4: 生效范围: 常规md范围, 非代码内部, 处理带分隔符的内容, 如: (), [], {}, ``, ""
// 一般每行只有一个的标志符在这里处理
function regularReplace(content) {
    // 还原分开的 > >
    content = content.replaceAll("> >", ">>");

    // ! 处理带有分隔符的字符, 即: cont1`cont2`cont3, 调用noDelimiterReplace修改 cont1, cont3; cont2 当做link调用linkReplace处理
    content = processContentWithDelimiters(content);
    content = content.replace(/([a-zA-Z0-9])\s*(<|>)([0-9])/g, "$1 $2 $3"); // `a  >1` -> `a > 1`
    
    // ! cont1, cont2, cont3 之间不应该加空格的情况则删掉空格
    content = content.replace(/([\(\[\{<"'])\s*`/g, '$1`'); // 前空格
    content = content.replace(/`\s*([\)\]\}>"'])/g, '`$1'); // 后空格
    
    // ! 汉字和英文/符号之间加空格 (part 2) - 不会出现在路径里, 所以放在 noDelimiterReplace 函数外面
    content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF])\s*(<|>)([0-9])/g, "$1 $2 $3"); // `数字  >1` -> `数字 > 1`

    // keep markdown todo list tag
    content = content.replace(/-\s+\[\s*\]/g, "- [ ]");
    content = content.replace(/-\s+\[[xX]\]/g, "- [x]");

    content = content.replace(/(\S)\s+(\S)/g, '$1 $2'); // 多空格转成一个空格

    // 部分字符前减少空格
    content = content.replace(/\s+(,|\.)/g, '$1'); // ` ,` -> `,`; ` .` -> `.`
    content = content.replace(/(\(|\[|\"|\'|<)\s+(\(|\[|\"|\'|<)/g, '$1$2'); // `[ (` -> `[(`
    content = content.replace(/(\)|\]|\"|\'|>)\s+(\)|\]|\"|\'|>|:)/g, '$1$2'); // `] )` -> `])`
    content = content.replace(/(\/)\s+(\S)/g, "$1$2"); // `/ b` -> `/b`

    // 部分字符后减少空格
    content = content.replace(/(\S)\s+(\/)/g, "$1$2"); // `a /` -> `a/`

    return content;
}

// !! T3.5: 其他不要改动的markdown结构, 如表格等
function isNotouchMd(line) {
    return isMarkdownTable(line) // 表格
        || isImgCiting(line) // 引用img
        || /^@import /.test(line.trim()) // import
}

// !! T3: links 内生效, 即 [content] (content) `content`
function linkReplace(content) {

    return content;
}

// !! T3: 处理标题行
function headerLineReplace(content) {
    // 标题后加入一个空格
    if (content.trim().search(/(^#{1,6}\s+)([\r\n]*)/) == -1) {
        // skip md tags: #XX
        // content = content.trim().replace(/(^#{1,6})(.*)/, "$1 $2");
    } else {
        content = content.trim().replace(/(^#{1,6})\s+(.*)/, "$1 $2");
    }
    // 标题前后加入空行
    content = content.trim().replace(/(^#{1,6}.*)([\r\n]*)/, "\n$1\n");

    return content
}

// !! T2.5: 数学公式内生效, 即 行间公式 ($$\n content \n$$), 行内公式 ($ content $)
function mathLineReplace(content) {
    content = replaceMathChars(content);

    return content;
}

// !! T2: 代码块内生效, 即 ```content``` 内生效
function codeLineReplace(content) {
    // 代码块内 `content` 不处理, 防止破坏文件地址
    if (content.trim().search(/`[^`]+`/g) != -1) {
        return content;
    }

    // 汉字和英文之间加空格
    content = content.replace(/([\u4e00-\u9fa5\u3040-\u30FF])([a-zA-Z0-9@&=\[\$\%\^\-\+(])/g, '$1 $2'); // 不修改正反斜杠, 避免路径被改乱
    content = content.replace(/([a-zA-Z0-9!&;=\],\.\:\?\$\%\^\-\+\)])([\u4e00-\u9fa5\u3040-\u30FF])/g, "$1 $2");

    return content;
}

// !! T1: 全局生效, 输入为单行, \n等特殊符号替换时可能有问题
function globalReplaceOnLine(content) {
    content = replaceFullChars(content); // 全角英文和标点

    // 非 md table 则多空格转成一个空格
    if (!isMarkdownTable(content)) {
        content = content.replace(/(\S)\s+(\S)/g, '$1 $2');
    }

    // 移除行尾空格
    content = content.replace(/(.*)[\r\n]$/g, "$1").replace(/(\s*$)/g, "");

    return content
}

// !! T0: 全局生效, 输入为整个文件 (方便处理多行内容, 加换行等)
function globalReplaceOnFileAtStart(content) {
    // ! 只有在需要匹配多行或者修改有问题的才需要在这里改, 比如不能插入换行符的

    // ! super ugly way to deal with the case of \\\\ - part 1
    // 如果\\后面没有换行符, 则在\\后面加一个空行 (先加一个特殊符号, 然后再替换)
    content = content.replace(/\\\\((?!$))/g, '\\\\¶$1');

    // 独立的单行公式换成多行公式:  $$ XXXX $$ 的公式内容变成新行显示
    content = content.replace(/\s*\$\$\s*(.*)\s*\$\$\s*/g, `\n$$$$\n$1\n$$$$\n`);

    // 多行公式: \begin{aligned} formula \end{aligned} 分行显示
    content = content.replace(/((\$\$)?)\s*(\\begin{aligned.?})(.*)(\\end{aligned.?})\s*((\$\$)?)/g, '$1\n$3\n$4\n$5\n$6');

    return content
}

// !! T0: 全局生效, 输入为整个文件 (方便处理多行内容, 加换行等)
function globalReplaceOnFileAtEnd(content) {
    // ! 只有在需要匹配多行或者修改有问题的才需要在这里改, 比如不能插入换行符的
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
    content = content.replaceAll("\\in", "∈");
    content = content.replaceAll("\\notin", "∉");
    content = content.replaceAll("\\subset", "⊂");
    content = content.replaceAll("\\supset", "⊃");
    content = content.replaceAll("\\subsetneqq", "⫋");
    content = content.replaceAll("\\supsetneqq", "⫌");
    content = content.replaceAll("\\cap", "∩");
    content = content.replaceAll("\\cup", "∪");
    content = content.replaceAll("\\because", "∵");
    content = content.replaceAll("\\therefore", "∴");
    content = content.replaceAll("\\approx", "≈");
    content = content.replaceAll("\\propto", "∝");
    content = content.replaceAll("\\nabla", "▽");
    content = content.replaceAll("\\emptyset", "∅");
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
    content = content.replace(/([a-zA-Z0-9]|:|=|<|>|\+|-|\*|\/|\||&|%|\$|@|#|!|`|~)\s*(\}|\]|\))/g, '$1$2'); // {overall } -> {overall}
    content = content.replace(/(\{|\[|\()\s*([a-zA-Z0-9]|:|=|<|>|\+|-|\*|\/|\||&|%|\$|@|#|!|`|~)/g, '$1$2'); // { overall} -> {overall}

    return content;
}

// 检测当前行是不是标题行
function isHeaderLine(content) {
    const headerRegex = /(^#{1,6}.*)([\r\n]*)$/;
    return headerRegex.test(content);
}

// 检测当前行是不是链接行
function isLinkLine(content) {
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

// 检测当前行是否是代码块的开头
function isCodeBlockStart(line) {
    return line.trim().startsWith("```") || line.trim().startsWith('{code');
}

// 检测当前行是否是 $$ (数学公式) 的开头
function isMathBlockStart(line) {
    return line.trim().startsWith("$$");
}

// 检测当前行是否是 md table
function isMarkdownTable(line) {
    const separatorRegex = /^\s*\|([-:\s]+\|)+\s*$/;
    return separatorRegex.test(line);
}

// 检测当前行是否是图片引用
function isImgCiting(line) {
    return /^\s*!\[.*\]\(.*\)\s*$/.test(line);
}

function processMdContent(content) {
    let inCodeBlock = false;
    let inMathBlock = false;

    const processLine = (line) => {
        // !! T1: 全局生效, 输入为单行, \n等特殊符号替换时可能有问题
        line = globalReplaceOnLine(line);

        // !! T2: 代码块内生效, 即 ```content``` 内生效
        if (inCodeBlock) {
            return codeLineReplace(line);
        } else if (isCodeBlockStart(line)) {
            inCodeBlock = !inCodeBlock;
            return inCodeBlock ? "\n" + line : line + "\n";
        }

        // !! T2.5: 数学公式内生效, 即 $$content$$
        if (inMathBlock) {
            line = trimExtraSpace(line);
            line = mathLineReplace(line);
            return line;
        } else if (isMathBlockStart(line)) {
            inMathBlock = !inMathBlock;
            return line;
        }

        // !! T3: links 内生效, 即 [content] (content) `content`
        if (isLinkLine(line)) {
            return linkReplace(line);
        }

        // !! T3: 处理标题行
        if (isHeaderLine(line)) {
            line = headerLineReplace(line);
        }

        // !! T3.5: 其他不要改动的markdown结构, 如表格等
        if (isNotouchMd(line)) {
            return line;
        }

        // !! T4: 处理 inline 数学公式
        const inlineMathRegex = /\$[^$]+\$/g;

        line = line.replace(inlineMathRegex, (formula) => {
            return mathLineReplace(formula);
        });

        // !! T4: 生效范围: 常规md范围, 非链接, 非代码部分
        line = regularReplace(line);
        line = trimExtraSpace(line);

        return line;
    };

    // !! T0: 全局生效, 输入为整个文件 (方便处理换行等)
    content = globalReplaceOnFileAtStart(content);

    let lines = content.split("\n").map(processLine);
    let finalContent = assembleFormattedContent(lines);

    // !! T0: 全局生效, 输入为整个文件 (方便处理换行等)
    finalContent = globalReplaceOnFileAtEnd(finalContent);

    return finalContent;
}

function processContentWithDelimiters(content) {
    const delimiters = [
        { start: '(', end: ')' },
        { start: '[', end: ']' },
        { start: '{', end: '}' },
        { start: '<', end: '>' }, // 有时候只是大于/小于号
        { start: '`', end: '`' },
        { start: '"', end: '"' },
        // { start: "'", end: "'" }, // 避免分开 Cristine's Rifle
        { start: "\\$", end: "\\$" }  // 数学公式不处理
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

        // ! 处理分隔符前的内容
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

        // ! 分隔符内的内容当做link处理
        let delimitedContent = remaining.slice(earliestMatch.index, endIndex + 1);
        result_list.push(linkReplace(delimitedContent));
        isFirstElement = false;

        // Move to the remaining content
        remaining = remaining.slice(endIndex + 1);
    }

    let result = result_list.join("");

    return result;
}

module.exports = {
    regularReplace,
    codeLineReplace,
    linkReplace,
    globalReplaceOnLine,
    globalReplaceOnFileAtEnd,
    globalReplaceOnFileAtStart,
    headerLineReplace,
    isLinkLine,
    processMdContent,
    replaceMathChars,
    isCodeBlockStart,
    noDelimiterReplace,
    processContentWithDelimiters
}
