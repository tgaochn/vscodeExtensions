# Changelog

## [1.2.0] - 2026-05-22

- 修复 URL 中的 `=` `<` `>` 等符号被错误加空格的问题 (如 `?disco=AAA` 不再被改成 `?disco = AAA`). 通过在 `noDelimiterReplace` 中用占位符保护 `http(s)://`, `ftp://`, `file://` 开头的 URL 实现.

## [1.1.0] - 2026-05-21

- 新增配置项 `gf32MdFormat.bareCodeBlockLanguages`, 用于自定义 LLM 输出中需要被自动包成代码块的裸语言列表 (如 `PLAINTEXT`, `MERMAID`, `PYTHON` 等). 

## [1.0.0] - 2026-05-21

initial release
