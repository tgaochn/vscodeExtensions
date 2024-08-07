const {
    regularReplace,
    codeLineReplace,
    linkReplace,
    globalReplaceOnLine,
    globalReplaceOnFileAtEnd,
    globalReplaceOnFileAtStart,
    processMdContent,
    headerReplace,
    replaceMathChars,
    isLink,
    noDelimiterReplace
} = require('./mod/extension/utils');

const fs = require('fs');
const path = require('path');

// !! 不应该改动的部分
describe('整个文件检测', () => {
    test('整个文件检测', () => {
        const input = normalizeLineEndings(readFile('./input.md').trim());
        const expectedOutput = normalizeLineEndings(readFile('./expect_output.md').trim());
    
        expect(processMdContent(input).trim()).toEqual(expectedOutput.trim());
    });

});

function normalizeLineEndings(str) {
    return str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function readFile(filePath) {
    return fs.readFileSync(path.join(__dirname, filePath), 'utf8');
}

// !! T0: 全局生效, 输入为整个文件 (方便处理多行内容, 加换行等)
describe('T0: 全局生效, 输入为整个文件', () => {
    test('多个空行缩成一行', () => {
        expect(globalReplaceOnFileAtEnd(
            `123


123`
        )).toBe(
            `123

123`
        );
    });

    test('多行公式分行显示', () => {
        expect(globalReplaceOnFileAtStart("$$\\begin{aligned}my_formula\\end{aligned}$$")).toBe(
            `
$$
\\begin{aligned}
my_formula
\\end{aligned}
$$
`
        );
    });


    test('独立的单行公式换成多行公式', () => {
        expect(globalReplaceOnFileAtStart("123$$my_formula$$123")).toBe(
            `123
$$
my_formula
$$
123`
        );
    });
});

// !! T1: 全局生效, 输入为单行, \n等特殊符号替换时可能有问题
describe('T1: 全局生效, 输入为单行', () => {
    test('全角英文和标点', () => {
        expect(globalReplaceOnLine('０')).toBe('0');
        expect(globalReplaceOnLine('『1』（2）')).toBe('[1](2)');
    });

    test('移除行尾空格', () => {
        expect(globalReplaceOnLine('123  ')).toBe('123');
    });
});

// !! T2: links 内生效, 即 [content] (content) `content`
describe('T2: links 内生效', () => {

});

// !! T3: 代码块内生效, 即 ```content``` 内生效
describe('T3: 代码块内生效', () => {
    test('汉字和英文之间加空格', () => {
        expect(codeLineReplace('a你a')).toBe('a 你 a');
        expect(codeLineReplace(':你[1]')).toBe(': 你 [1]');
    });

});

// !! T4: 生效范围: 常规md范围, 非链接, 非代码部分
describe('T4: 生效范围: 常规md范围, 非链接, 非代码部分', () => {
    test('有些特殊规则不应该变化', () => {
        expect(regularReplace('1,000').trim()).toBe('1,000');
    });
    
    test('`content` 与其他内容之间增加空格', () => {
        expect(regularReplace('a`content`a')).toBe('a `content` a');
        expect(regularReplace('(`content`)a')).toBe('(`content`) a');
    });

    test('多空格合并成一个空格', () => {
        expect(regularReplace('aaa    aaa')).toBe('aaa aaa');
    });

    test('去掉不必要的空格', () => {
        expect(regularReplace('abc ]')).toBe('abc]');
        expect(regularReplace('[ abc')).toBe('[abc');
    });

    test('md todo list formatting', () => {
        expect(regularReplace('-  []')).toBe('- [ ]');
        expect(regularReplace('- []')).toBe('- [ ]');
        expect(regularReplace('- [X]')).toBe('- [x]');
    });

    test('部分字符前后增加空格', () => {
        // 字符前后增加空格

        // 字符后增加空格
        expect(regularReplace('a)a')).toBe('a) a');
        expect(regularReplace('a    :b')).toBe('a: b');

        // 字符前减少空格
        expect(regularReplace('a ,a')).toBe('a, a');

        // 复杂字符
        // expect(regularReplace("T+he (qui+ck) a+b [br+own] fox+x")).toBe("T + he (qui+ck) a + b [br+own] fox + x");
    });

    test('部分字符后增加空格', () => {
    });

    test('部分字符前减少空格', () => {
    });
});

// !! T5: 生效范围: 常规md范围, 非代码内部, 不含分隔符, 如: (), [], {}, ``, ""
describe('T5: 生效范围: 常规md范围, 非代码内部, 不含分隔符', () => {
    test('部分字符前/后增加空格', () => {
        expect(regularReplace('a+b')).toBe('a + b');
        expect(regularReplace('a    +  b')).toBe('a + b');
        expect(regularReplace('a+  b')).toBe('a+ b');
        expect(regularReplace('a=  b')).toBe('a = b');
        expect(regularReplace('a:  b')).toBe('a: b');
    });
});


describe('数学公式测试', () => {
    test('Math 字符替换', () => {
        expect(replaceMathChars('\\cdot \\alpha \\ell')).toBe('× α l');
    });

    test('Math 去掉括号的修饰符', () => {
        expect(replaceMathChars('\\mathbb{')).toBe('{');
        expect(replaceMathChars('\\:=\\:')).toBe('=');
    });

    test('Math 去掉单字的括号', () => {
        expect(replaceMathChars('{ X }')).toBe('X');
    });

    test('Math 去掉空格', () => {
        expect(replaceMathChars('{ overlap }')).toBe('{overlap}');
    });

});