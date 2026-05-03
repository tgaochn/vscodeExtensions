# gtfish07_change-case

Change text case with reordered command list for frequently used transformations.

## Description

This extension provides commands to quickly change the case of selected text or the current word. It supports camelCase, CONSTANT_CASE, dot.case, kebab-case, lower case, PascalCase, path/case, Sentence case, snake_case, SWAP CASE, Title Case, UPPER CASE, and more.

## Key Modifications

This is a custom fork of [`wmaurer.change-case`](https://marketplace.visualstudio.com/items?itemName=wmaurer.change-case) (v1.0.0) with the following changes:

- **Reordered command list**: Reorganized the order of case conversion commands in the command palette to prioritize frequently used transformations (camelCase, snake_case, PascalCase) for faster access

## Usage

1. Select text or place cursor on a word
2. Open Command Palette (`Ctrl+Shift+P`)
3. Type "Change Case" and select the desired transformation

## Supported Case Types

| Command | Example |
|---------|---------|
| camelCase | `myVariableName` |
| CONSTANT_CASE | `MY_VARIABLE_NAME` |
| dot.case | `my.variable.name` |
| kebab-case | `my-variable-name` |
| lower case | `my variable name` |
| PascalCase | `MyVariableName` |
| path/case | `my/variable/name` |
| Sentence case | `My variable name` |
| snake_case | `my_variable_name` |
| SWAP CASE | toggle upper/lower |
| Title Case | `My Variable Name` |
| UPPER CASE | `MY VARIABLE NAME` |

## Attribution

Based on [change-case](https://marketplace.visualstudio.com/items?itemName=wmaurer.change-case) by wmaurer (v1.0.0). Independently modified and maintained.
