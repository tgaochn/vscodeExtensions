# Change Log

All notable changes to this extension (newest on top):

- 0.6.4
  Bugfix: command did not start

- 0.6.2
  Bugfix: step did not work with decimal numbers - fixed

  Update: minor changes in the README file. Especially formatting had
  some wrong documentation.

- 0.6.1

  Bugfix: showHistory command in package.json was wrong - sorry!

- 0.6.0

  New command: insertnums.showPickHistory (default keyboard shortcut: CTRL+ALT+,)
  The command shows the history of previous typed commands (stored in global). With the new option "insertnums.editHistory" (default: false) you can define, if you want to edit the selected command or just run it.

- 0.5.1

  New feature:

  - the output is by default based on the selections order. If you want to include the chars in the order of the editor order (not the click order), new option '\$' is introduced

- 0.5.0

  New features (all changes by Yu [(@codeyu)](https://github.com/codeyu) - thanks a lot):

  - thanks to Yu [(@codingyu)](https://github.com/codingyu) it's now possible to show the history in an extra window. Start the extension with CTRL+ALT+, (comma is the default key command for command extension.insertNums.showPickHistory), the history will be shown and you can pick one of the previous commands.
  - history is also stored via globalState and can be use after closing vscode
  - new config variable insertNums.historyLimit to limit the number of entries in the history (default: 30)
  - to clear history, you still can use "!c" in the normal inputBox (CTRL+ALT+.).

- 0.4.1
  Updated features:

  - it is now not only possible to print the values in hex, but you can also type hex numbers
    as start value and if you mark a hex number as first selection, it automatically recognise it
    and print hex numbers.

- 0.4
  New features:

  - new implementation of a random sequence (documentation see README.md)
  - new implementation of a bash-like history function (documentation see README.md)

- 0.3.1
  Fixes:

  - Quick bugfix: the new feature "frequency" was mantadory, not optional. Sorry!
  - Bugfix: inserting upper case letters fixed

- 0.3
  New features:

  - beside the repeat sequence in previous version, a new frequency option is available with the \*

  Fixes:

  - Bugfix: expression check during runtime

- 0.2
  New features:

  - you can now repeat the sequence with the # option
  - you can use a in expressions to get the starting value (first value)

  Improvements:

  - Eliminate typescript errors and smoothen code
  - Improve and extend documentation

- 0.1.1
  Bugfix: expressions will no longer end in an end-less loop

- 0.1.0
  Added full formatting for integers and strings.
  Added Expression evaluation.
  Added icon and additional information about project to package.json

- 0.0.3
  Fixed bug while default step was 0 - is now 1
  Additionally add first format options - integers and floats can be formated
  now.

* 0.0.2
  Currently, it's a first running version of InsertNums.
  You will find a command (CTRL-SHIFT P in windows) "Insert Numbers"

Current feature list (compared to the original python script - see README file):

- Usage with numbers

  - start and step is supported
  - stopexpr is supported
  - format is _not_ supported at the moment
  - expr is still in _test mode_

- Usage with the alphabet

  - start and step is supported
  - wrap is supported
  - format is _not_ supported at the moment

- Usage with Expressions

  - cast is supported
  - expr is supported
  - stopexpr is supported
  - format is _not_ supported at the moment

- 0.0.1
  Initial upload
