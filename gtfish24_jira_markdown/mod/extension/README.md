forked version from chintans98.markdown-jira-1.1.0.

# changelog

## [0.0.6] - 2024-09-13

bug fix

## [0.0.5] - 2024-09-11

修改 `content` 的转化颜色

## [0.0.4] - 2024-08-14

1. 转化选中的md文本而不是整个文件, 避免md文件太长时速度太慢
2. 转化后的内容写入一个侧边栏的临时tab而不是生成新的文件, 避免产生太多垃圾文件

## [0.0.3] - 2024-07-24

1. `text` -> {color:#DE350B}text{color}
2. (`link`) -> (link)

## [0.0.2] - 2024-07-12

1. fixed readme

## [0.0.1] - 2024-07-12

1. upgrade jira2md module to 3.0.0
2. modified some buggy regex in jira2md
3. include jira2md functions directly in extension.js to reduce files