'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vs = require("vscode");
let LEFT = vs.workspace.getConfiguration('bracket-jumper').get('openingBrackets');
let RIGHT = vs.workspace.getConfiguration('bracket-jumper').get('closingBrackets');
let UNI = vs.workspace.getConfiguration('bracket-jumper').get('uniBrackets');

// 获取 pos 位置的字符
function charAtPos(document, pos) {
    let line = document.lineAt(pos).text;
    let ind = pos.character;
    return line.substr(ind, 1);
}

// 返回文档中 pos 左移一步的位置, 到达开头则返回 null
function posLeft(document, pos) {
    let offset = document.offsetAt(pos);
    return offset > 0 ? document.positionAt(offset - 1) : null;
}

// 返回文档中 pos 右移一步的位置, 到达末尾则返回 null
function posRight(document, pos) {
    let offset = document.offsetAt(pos);
    let next = offset < document.getText().length ? document.positionAt(offset + 1) : null;
    // vscode bug: positionAt 可能返回与当前相同的位置, 需要 +2 跳过: https://github.com/Microsoft/vscode/issues/23247
    return next && pos.isEqual(next) ? document.positionAt(offset + 2) : next;
}

// 检测 pos 处的字符是否被反斜杠转义
function isEscaped(doc, pos) {
    let prev = posLeft(doc, pos);
    return prev !== null && charAtPos(doc, prev) === '\\';
}

/**
 * 判断 uni-bracket 在给定位置是 opening 还是 closing
 * 返回 true = opening (光标应跳到符号右边)
 * 返回 false = closing (光标应跳到符号左边)
 *
 * 判断优先级:
 * 1. 行首 / 前面是空白 → opening
 * 2. 行尾 / 后面是空白 → closing
 * 3. 前面是左括号或运算符 → opening
 * 4. 后面是右括号或标点 → closing
 * 5. 前面是字母数字或右括号 → closing
 * 6. 后面是字母数字或左括号 → opening
 * 7. 同行前方同符号计数: 偶数=opening, 奇数=closing
 * 8. 兜底: closing
 */
function isUniBracketOpening(doc, pos, char) {
    let line = doc.lineAt(pos).text;
    let ind = pos.character;
    let charBefore = ind > 0 ? line[ind - 1] : null;
    let charAfter = ind < line.length - 1 ? line[ind + 1] : null;
    if (charBefore === null || /\s/.test(charBefore)) {
        return true;
    }
    if (charAfter === null || /\s/.test(charAfter)) {
        return false;
    }
    if (/[(\[{=:,+\-*\/%!<>?&|;^~@#]/.test(charBefore)) {
        return true;
    }
    if (/[)\]},;:]/.test(charAfter)) {
        return false;
    }
    if (/[\w)\]}]/.test(charBefore)) {
        return false;
    }
    if (/[\w(\[{]/.test(charAfter)) {
        return true;
    }

    // 同行前方同符号计数: 偶数=opening, 奇数=closing
    let countBefore = 0;
    for (let i = 0; i < ind; i++) {
        if (line[i] === char)
            countBefore++;
    }
    if (countBefore % 2 === 0) {
        return true;
    }
    return false;
}

/**
 * 找到最近的未匹配括号 (用于 ascend 命令, 跳到当前作用域的边界)
 * dir="left" 时找 opening bracket, dir="right" 时找 closing bracket
 */
function unmatchedBracketInDir(doc, pos, dir) {
    let [des, pair] = dir == "left" ? [LEFT, RIGHT] : [RIGHT, LEFT]; // des: 目标括号集 (要找的), pair: 配对括号集 (途中需要跳过的)
    let posFun = dir == "left" ? posLeft : posRight;

    // edge case: 向右跳时, 当前字符就是 closing bracket, 直接跳过
    if (dir == "right") {
        let curChar = charAtPos(doc, pos);
        if (RIGHT.indexOf(curChar) != -1) {
            return new vs.Position(pos.line, pos.character + 1);
        }
        if (UNI.indexOf(curChar) != -1 && !isEscaped(doc, pos) && !isUniBracketOpening(doc, pos, curChar)) {
            return new vs.Position(pos.line, pos.character + 1);
        }
    }
    if (posLeft(doc, pos) == null) {
        return null;
    }

    // edge case: 向左跳时, 前一个字符就是 opening bracket, 不处理会被跳过
    if (dir == "left") {
        let prevPos = posLeft(doc, pos);
        let prevChar = charAtPos(doc, prevPos);
        if (LEFT.indexOf(prevChar) != -1) {
            return prevPos;
        }
        if (UNI.indexOf(prevChar) != -1 && !isEscaped(doc, prevPos) && isUniBracketOpening(doc, prevPos, prevChar)) {
            return prevPos;
        }
    }

    // 向左时跳过当前字符 (否则会卡住)
    let pAdj = dir == "left" ? posLeft(doc, pos) : pos;
    let paired = Array(LEFT.length).fill(0); // paired: 标准括号的配对计数; uniPaired: uni-bracket 的配对计数
    let uniPaired = {};
    for (let i = 0; i < UNI.length; i++) {
        uniPaired[UNI[i]] = 0;
    }
    while ((pAdj = posFun(doc, pAdj))) {
        let char = charAtPos(doc, pAdj);

        // 遇到配对方向的括号, 计数+1 (需要跳过的内部配对)
        let pairInd = pair.indexOf(char);
        if (pairInd != -1) {
            paired[pairInd]++;
            continue;
        }

        // 遇到目标方向的括号
        let desInd = des.indexOf(char);
        if (desInd != -1) {
            if (paired[desInd] > 0) {
                paired[desInd]--;
            }
            else {
                return dir == "left" ? pAdj : new vs.Position(pAdj.line, pAdj.character + 1);
            }
            continue;
        }

        // uni-bracket: 根据 opening/closing 判断做配对计数
        if (UNI.indexOf(char) != -1 && !isEscaped(doc, pAdj)) {
            let isOpening = isUniBracketOpening(doc, pAdj, char);
            if (dir == "left") {
                if (!isOpening) {
                    uniPaired[char] = (uniPaired[char] || 0) + 1;
                }
                else {
                    if (uniPaired[char] > 0) {
                        uniPaired[char]--;
                    }
                    else {
                        return pAdj;
                    }
                }
            }
            else {
                if (isOpening) {
                    uniPaired[char] = (uniPaired[char] || 0) + 1;
                }
                else {
                    if (uniPaired[char] > 0) {
                        uniPaired[char]--;
                    }
                    else {
                        return new vs.Position(pAdj.line, pAdj.character + 1);
                    }
                }
            }
        }
    }
    return null;
}

/**
 * 找到给定方向上最近的括号 (用于 jump 命令)
 * opening bracket → 光标跳到符号右边 (character + 1)
 * closing bracket → 光标跳到符号左边 (character)
 */
function bracketInDir(doc, pos, dir) {
    let posFun = dir == "left" ? posLeft : posRight;

    // edge case: 向右跳时, 当前字符就是 closing bracket, 直接跳过
    if (dir == "right") {
        let curChar = charAtPos(doc, pos);
        if (RIGHT.indexOf(curChar) != -1) {
            return new vs.Position(pos.line, pos.character + 1);
        }
        if (UNI.indexOf(curChar) != -1 && !isEscaped(doc, pos) && !isUniBracketOpening(doc, pos, curChar)) {
            return new vs.Position(pos.line, pos.character + 1);
        }
    }
    if (posLeft(doc, pos) == null) {
        return null;
    }

    // edge case: 向左跳时, 前一个字符就是 opening bracket, 不处理会被跳过
    if (dir == "left") {
        let prevPos = posLeft(doc, pos);
        let prevChar = charAtPos(doc, prevPos);
        if (LEFT.indexOf(prevChar) != -1) {
            return prevPos;
        }
        if (UNI.indexOf(prevChar) != -1 && !isEscaped(doc, prevPos) && isUniBracketOpening(doc, prevPos, prevChar)) {
            return prevPos;
        }
    }

    // 向左时跳过当前字符 (否则会卡住)
    let pAdj = dir == "left" ? posLeft(doc, pos) : pos;
    while ((pAdj = posFun(doc, pAdj))) {
        let char = charAtPos(doc, pAdj);
        if (LEFT.indexOf(char) != -1) {
            return new vs.Position(pAdj.line, pAdj.character + 1); // opening → 符号右边
        }
        else if (RIGHT.indexOf(char) != -1) {
            return new vs.Position(pAdj.line, pAdj.character); // closing → 符号左边
        }
        else if (UNI.indexOf(char) != -1 && !isEscaped(doc, pAdj)) {
            if (isUniBracketOpening(doc, pAdj, char)) {
                return new vs.Position(pAdj.line, pAdj.character + 1); // opening → 符号右边
            }
            else {
                return new vs.Position(pAdj.line, pAdj.character); // closing → 符号左边
            }
        }
    }
    return null;
}

// 配置变更时刷新括号集
function updateLeftRight() {
    const config = vs.workspace.getConfiguration('bracket-jumper');
    LEFT = config.get('openingBrackets');
    RIGHT = config.get('closingBrackets');
    UNI = config.get('uniBrackets');
}

exports.unmatchedBracketInDir = unmatchedBracketInDir;
exports.bracketInDir = bracketInDir;
exports.updateLeftRight = updateLeftRight;