"""Batch fix package.json metadata for all remaining extensions."""
import json
import os

BASE = r"D:\Dropbox\project\0_non-work_stuff\vscode plugin\1. vscodeExtensions"

# Extension configs: (dir_name, package_json_path, new_description, original_info)
FIXES = {
    "gtfish01_bracket-jumper": {
        "pkg": "mod/extension/package.json",
        "desc": "Jump between matching brackets with customized keybindings. Enhanced fork with modified shortcut configurations for efficient bracket navigation in code.",
        "original": "Bracket Jumper",
    },
    "gtfish05_time-range": {
        "pkg": "package.json",
        "desc": "Output time range strings in various formats. Custom utility extension for inserting formatted time range text into the editor.",
        "original": None,  # original unclear
    },
    # gtfish07 has no package.json - skip for now
    "gtfish10_diff-tool": {
        "pkg": "mod/extension/package.json",
        "desc": "Two-file diff comparison via context menu with full absolute path display. Enhanced fork showing complete file paths for clearer diff identification.",
        "original": "Diff Tool",
    },
    "gtfish12_template-generator": {
        "pkg": "mod/extension/package.json",
        "desc": "Generate files and folders from customizable templates with keybinding support. Enhanced fork with additional keyboard shortcuts for template-based file scaffolding.",
        "original": "Template Generator by DengSir",
    },
    "gtfish13_insert-numbers-alphacharts": {
        "pkg": "mod/extension/package.json",
        "desc": "Insert sequential numbers, letters, and custom character sequences at multiple cursors. Enhanced fork with alphabetic character support and extended keybindings.",
        "original": "Insert Sequences by volkerdobler",
    },
    "gtfish14_value-sum-up": {
        "pkg": "mod/extension/package.json",
        "desc": "Calculate and display the sum of selected numeric values in the editor. Enhanced fork with improved number detection and status bar display.",
        "original": "code-sum-up by arturcarvalho",
    },
    "gtfish15_split-join-text": {
        "pkg": "mod/extension/package.json",
        "desc": "Split and join text lines with configurable separators and keybindings. Enhanced fork with custom keyboard shortcuts for text splitting and joining workflows.",
        "original": "Split Join texts by Matsuyanagi",
    },
    "gtfish17_open_file": {
        "pkg": "mod/extension/package.json",
        "desc": "Open files from path strings in the editor with keyboard shortcuts. Enhanced fork with customized keybindings for quick file navigation from path references.",
        "original": "Open file From Path by Jack89ita",
    },
    "gtfish18_instant_md_table": {
        "pkg": "mod/extension/package.json",
        "desc": "Generate Markdown tables instantly from selected text or clipboard data. Enhanced fork with improved table formatting and keybinding support.",
        "original": "Markdown Table Generator by JayFiDev",
    },
    "gtfish19_wrap_selection": {
        "pkg": "mod/extension/package.json",
        "desc": "Wrap selected text with configurable symbol combinations or custom patterns. Enhanced fork with additional wrapping pattern options and keybindings.",
        "original": "wrap by gko",
    },
    "gtfish20_notes": {
        "pkg": "mods/extension/package.json",
        "desc": "Markdown-focused note-taking extension with Notational Velocity-inspired workflow. Enhanced fork with customized keybindings and note management shortcuts.",
        "original": "Notes by dionmunk",
    },
    "gtfish21_labeled_bookmarks": {
        "pkg": "mod/extension/package.json",
        "desc": "Labeled bookmarks with multiple groups and customizable visual indicators. Enhanced fork with modified keybindings for efficient bookmark navigation across files.",
        "original": "Labeled Bookmarks by koalamer",
    },
    "gtfish22_python-string-sql": {
        "pkg": "mod/extension/package.json",
        "desc": "Syntax highlight SQL code embedded in Python strings. Enhanced fork with additional keybindings for toggling SQL highlighting in Python files.",
        "original": "python-string-sql by ptweir",
    },
    "gtfish23_language-injection": {
        "pkg": "mod/extension/package.json",
        "desc": "Inject language syntax highlighting into code blocks across different languages, including markdown codeblocks and Python strings. Custom extension for general-purpose language injection.",
        "original": "es6-string-html",
    },
    "gtfish24_jira_markdown": {
        "pkg": "mod/extension/package.json",
        "desc": "Convert between Markdown and JIRA markup formats with keyboard shortcuts. Enhanced fork with customized keybindings for quick format conversion.",
        "original": "markdown-to-jira by chintans1",
    },
    "gtfish25-sql-formatter": {
        "pkg": "mod/extension/package.json",
        "desc": "Format SQL files with support for multiple SQL dialects including BigQuery, PostgreSQL, MySQL, and more. Enhanced fork with customized formatting defaults and keybindings.",
        "original": "Prettier SQL VSCode",
    },
    "gtfish26-join-selected-string": {
        "pkg": "mod/extension/package.json",
        "desc": "Join selected text lines with a custom separator character. Enhanced fork with modified join behavior and keybinding configuration.",
        "original": "Join Paste by vvlvm",
    },
    "gtfish27-markdown-render-link": {
        "pkg": "mod/extension/package.json",
        "desc": "Render markdown links with backtick-enclosed URLs as clickable links and support pattern-based auto-linking. Custom extension for enhanced markdown link rendering.",
        "original": None,
    },
    "gtfish28-add-header": {
        "pkg": "mod/extension/package.json",
        "desc": "Add customizable headers to source code files with multi-language support and markdown frontmatter generation. Enhanced fork with additional language templates and keybindings.",
        "original": "Add Header by ch3rag",
    },
    "gtfish29-formatted-paste": {
        "pkg": "mod/extension/package.json",
        "desc": "Paste clipboard content with leading and trailing whitespace automatically trimmed. Custom utility extension for clean paste operations.",
        "original": None,
    },
    "gtfish30-render-pattern": {
        "pkg": "mod/extension/package.json",
        "desc": "Recognize custom patterns in text as clickable links and open them with configurable commands, including Windows Explorer file path support. Custom extension for pattern-based link rendering.",
        "original": None,
    },
    "gtfish31-folding": {
        "pkg": "mod/extension/package.json",
        "desc": "Custom code folding with configurable fold markers and keybindings. Enhanced fork with modified folding behavior and keyboard shortcuts.",
        "original": "folding extension",
    },
}

def fix_package_json(ext_name, config):
    pkg_path = os.path.join(BASE, ext_name, config["pkg"])
    if not os.path.exists(pkg_path):
        print(f"  SKIP: {pkg_path} not found")
        return

    with open(pkg_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Update description
    data["description"] = config["desc"]

    # Update/add repository
    data["repository"] = {
        "type": "git",
        "url": f"https://github.com/tgaochn/vscodeExtensions/tree/master/{ext_name}"
    }

    # Update/add icon
    data["icon"] = "images/icon.png"

    with open(pkg_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent="\t", ensure_ascii=False)
        f.write("\n")

    print(f"  Fixed: {pkg_path}")


def copy_icon(ext_name, config):
    """Copy generated icon into the mod/extension directory."""
    src = os.path.join(BASE, ext_name, "images", "icon.png")
    pkg_dir = os.path.dirname(os.path.join(BASE, ext_name, config["pkg"]))
    dst_dir = os.path.join(pkg_dir, "images")
    os.makedirs(dst_dir, exist_ok=True)
    dst = os.path.join(dst_dir, "icon.png")

    if os.path.exists(src):
        if os.path.abspath(src) == os.path.abspath(dst):
            print(f"  Icon already in place: {dst}")
        else:
            import shutil
            shutil.copy2(src, dst)
            print(f"  Icon copied to: {dst}")
    else:
        print(f"  WARNING: Source icon not found: {src}")


def write_readme(ext_name, config):
    """Write a distinct README.md for the extension."""
    pkg_dir = os.path.dirname(os.path.join(BASE, ext_name, config["pkg"]))
    readme_path = os.path.join(pkg_dir, "README.md")

    original = config.get("original")
    if original:
        attribution = f"\n## Attribution\n\nBased on {original}. Independently modified and maintained.\n"
    else:
        attribution = "\n## Attribution\n\nOriginal extension by gtfish1988. Independently developed and maintained.\n"

    content = f"""# {ext_name}

## Description

{config['desc']}

## Installation

Install from the VS Code Marketplace or manually via .vsix file.
{attribution}"""

    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  README written: {readme_path}")


if __name__ == "__main__":
    for ext_name, config in FIXES.items():
        print(f"\n=== {ext_name} ===")
        fix_package_json(ext_name, config)
        copy_icon(ext_name, config)
        write_readme(ext_name, config)

    print("\n\nAll fixes applied!")
