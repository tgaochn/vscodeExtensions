# README

personal modified version of liushilive.markdownformat-0.0.15

## [0.4.0] - 2024-07-20

1. 重构代码
2. 添加了几个math相关的替换
3. 去掉了没用的config

## [0.3.5] - 2024-07-14

`cont` 前后加空格

## [0.3.3] - 2023-11-11

优化format范围

## [0.3.2] - 2023-04-30

fixed a bug that only replace the first space in file path

## [0.3.1] - 2023-04-30

添加 extension.copyEncodedRelativePathOfCurrentFile 命令, 可以复制当前文件的相对路径

## [0.2.17] - 2023-04-30

还原prettier替换的部分修改

1. \\* -> *
2. > > -> >>

## [0.2.16] - 2023-04-07

### added

skip md tags: #XX

## [0.2.15] - 2023-04-02

### added

tags: 开头不会被修改 - obsidian

## [0.2.14] - 2023-03-14

### added

`XXX` 中间的格式不会修改

## [0.2.13] - 2023-03-14

### added

( XXX -> (XXX
] ) -> ])

## [0.2.12] - 2023-03-10

### added

[ ( -> [(

## [0.2.11] - 2023-03-04

### added

无论是不是代码块都在汉字和英文之间加空格

## [0.2.10] - 2023-02-21

### added

table 的多空格不消除, 即

|         |

## [0.2.9] - 2023-02-19

### added

todo list 的双空格不消除, 即

-  [ ]

## [0.2.8] - 2023-02-10

### md2html added

1. 更多的语言支持
2. align 转化支持

## [0.2.6] - 2023-02-09

### added

括号内内容不分割

"T+he (qui+ck) a+b [br+own] fox+x" -> "T + he (qui+ck) a + b [br+own] fox + x"

## [0.2.5] - 2022-09-12

### Added

1. 去掉部分符号前的空格, "abc ]" -> "abc]"
2. 多空格转成一个空格

## [0.2.4] - 2022-09-12

### Added

1. [], "", '' 中内容认为是连接, 如果包含 +=, 不会添加空格
2. tex 公式识别后包含的空格去掉: "_" -> "_", "^" -> "^"

## [0.2.3] - 2022-09-11

### Added

1. 英文字符间如果有相关符号, 则增加空格
2. tex 公式中 text 标记去掉
3. tex 公式中去掉空格

## [0.2.2] - 2022-08-30

### Added

1. 还原被 format 掉的特殊符号
   1. "_" -> "_"

## [0.2.1] - 2022-08-26

### Added

1. html desc 增加了一些格式代码, 现在可以处理
   1. bold
   2. code block

## [0.2.0] - 2022-08-15

### Added

1. 增加了 2 个命令, extension.reFormat_md2html / extension.reFormat_html2md, 用于切换 desc 格式

## [0.1.0] - 2022-07-03

### Added

1. 增加全角字符替换
2. 增加希腊字母替换
3. 数学公式简化, 部分符号规范化
4. 去掉正反斜杠的修改, 避免路径被改乱
