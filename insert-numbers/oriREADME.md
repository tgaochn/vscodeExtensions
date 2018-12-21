An extension to insert increasing numbers.

![default behavior](https://github.com/Inori/vscode-InsertNumbers/raw/master/images/default.gif)

## Usage
* Command: `Insert Numbers`
* Keybindings: `ctrl+alt+n` on Windows and Linux or `cmd+alt+n` on OSX

## Control format
The format of the inserted numbers is controlled by a C-Style format string using in a sprintf function.

There are two ways to change the default format string.
* You can change your `settings.json` file to modify the default value:
![settings](https://github.com/Inori/vscode-InsertNumbers/raw/master/images/settings.png)
* You can input format string in the `InputBox` each time you toggle insert. The format string can be a single string like `%02d`:
![dec format](https://github.com/Inori/vscode-InsertNumbers/raw/master/images/dec.gif)
or with start number and step, like `%08X:0:4`:
![input format](https://github.com/Inori/vscode-InsertNumbers/raw/master/images/hex.gif)
    ### Note
    * Do not input more than one type specifier in a format string. If you want to input more than one number, you can do it another time.
    * Do not input `':'` in format string.