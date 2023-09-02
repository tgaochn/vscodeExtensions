personally forked version from jayfidev.tablegenerator-1.0.4

# [0.0.1] - 2023-09-02

1. fixed default symbols cmd

Use the following setting:

```json
"wrapSelection.patterns": {
    // default pattern triggered by cmd "Wrap selected text using custom pattern"
    "default": "try",

    // all the enabled patterns
    "try": "try:\n    ${text}\n    except Exception as e:\n        print(e)\n        # raise e",
    "log": "console.log(`${text}`, ${text})",
    "promise": "new Promise((yeah, nah) => yeah(${text}))",
    "=>": "() => ${text}",
},
```