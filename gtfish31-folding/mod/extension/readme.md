# gtfish31-folding

Enhanced code folding for VS Code with smarter bracket handling, folded text previews, Zen Folds, and region support. Provides a custom FoldingRangeProvider that includes closing brackets in folds, shows line counts, displays function parameters, and previews object properties in collapsed text.

## Features

- **Closing bracket inclusion**: Folds include the closing bracket line (`}`, `]`, `</tag>`) so collapsed code shows `{...}` instead of leaving a dangling bracket
- **Folded line count**: Displays the number of hidden lines in the fold label (e.g., `function example() { ... 3 lines ... }`)
- **Function parameter preview**: Shows function parameters in collapsed text for multi-line signatures (e.g., `function example(firstParam, secondParam) {...}`)
- **Object property preview**: Shows the first property of object literals in collapsed text (e.g., `{ id:'123',... }`)
- **Chained folding**: When folding a range, automatically folds ranges that start on the same line where the original range ends
- **Region description display**: Shows only the description text for `#region` markers, hiding the marker syntax
- **Zen Folds**: Fold everything in the document except the current selection, letting you focus on a specific section
- **Language exclusion**: Skip folding enhancements for specified languages

## Commands

| Command | Description |
| ------- | ----------- |
| `Better Folding: Create Zen Folds Around Selection` | Fold all code except the current selection |
| `Better Folding: Clear Zen Folds` | Remove all Zen Folds and restore normal folding |

## Configuration

**Note:** Configuration keys use the `betterFolding.*` prefix and the settings title is `"Better Folding"` (inherited from the original extension).

| Setting | Type | Default | Description |
| ------- | ---- | ------- | ----------- |
| `betterFolding.foldClosingBrackets` | boolean | `true` | Include closing brackets in folding range |
| `betterFolding.foldClosingTags` | boolean | `true` | Include closing HTML/JSX tags in folding range |
| `betterFolding.showFoldedBodyLinesCount` | boolean | `true` | Show number of folded lines |
| `betterFolding.showFoldedBrackets` | boolean | `true` | Show brackets in collapsed text |
| `betterFolding.showFunctionParameters` | boolean | `true` | Show function parameters in collapsed text |
| `betterFolding.chainFoldingRanges` | boolean | `true` | Chain-fold ranges starting on the same end line |
| `betterFolding.showOnlyRegionsDescriptions` | boolean | `false` | Show only region description, hiding `#region` marker |
| `betterFolding.showObjectPreviews` | boolean | `true` | Show first object property in collapsed text |
| `betterFolding.excludedLanguages` | array | `[]` | Languages to exclude from enhanced folding |

## Key Modifications from Original

- Repackaged with custom keybindings and configuration defaults
- Maintained as an independent fork with the same core folding engine

## Attribution

Based on [Better Folding](https://marketplace.visualstudio.com/items?itemName=MohammadBaqer.better-folding) by Bryan Piatkowski (MohammadBaqer). This fork has been independently modified and is maintained separately.