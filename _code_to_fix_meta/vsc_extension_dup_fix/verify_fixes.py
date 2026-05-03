"""Verify all extensions have been properly fixed."""
import os
import json

BASE = r"D:\Dropbox\project\0_non-work_stuff\vscode plugin\1. vscodeExtensions"

ISSUES = []
PASS = []


def find_package_json(ext_dir):
    for subdir in ["mod/extension", "mods/extension", ""]:
        path = os.path.join(ext_dir, subdir, "package.json") if subdir else os.path.join(ext_dir, "package.json")
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f), path
            except:
                pass
    return None, None


def find_readme(ext_dir):
    for subdir in ["mod/extension", "mods/extension", ""]:
        path = os.path.join(ext_dir, subdir, "README.md") if subdir else os.path.join(ext_dir, "README.md")
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return f.read(), path
    return None, None


def find_icon(ext_dir):
    for subdir in ["mod/extension/images", "mods/extension/images", "images"]:
        path = os.path.join(ext_dir, subdir, "icon.png")
        if os.path.exists(path):
            return path
    return None


def check_extension(ext_name):
    ext_dir = os.path.join(BASE, ext_name)
    issues = []

    # Check package.json
    pkg, pkg_path = find_package_json(ext_dir)
    if not pkg:
        issues.append("NO package.json found")
    else:
        desc = pkg.get("description", "")
        if len(desc) < 30:
            issues.append(f"Description too short ({len(desc)} chars): '{desc}'")

        # Check description is not just the extension name
        simple_names = [ext_name.split("_")[-1], ext_name.split("-")[-1]]
        if desc.lower().strip() in [n.lower() for n in simple_names]:
            issues.append(f"Description matches original name: '{desc}'")

        repo = pkg.get("repository", {})
        if isinstance(repo, dict):
            url = repo.get("url", "")
        else:
            url = str(repo)

        if not url:
            issues.append("No repository URL")
        elif "tgaochn/vscodeExtensions" not in url:
            issues.append(f"Repository URL not updated: {url}")
        elif "%20" in url:
            issues.append(f"Repository URL contains %20: {url}")

        icon = pkg.get("icon", "")
        if not icon:
            issues.append("No icon field in package.json")

    # Check README
    readme, readme_path = find_readme(ext_dir)
    if not readme:
        issues.append("No README.md found")
    elif len(readme.strip().split("\n")) < 5:
        issues.append(f"README too short ({len(readme.strip().split(chr(10)))} lines)")

    # Check icon file
    icon_path = find_icon(ext_dir)
    if not icon_path:
        issues.append("No icon.png file found")

    if issues:
        ISSUES.append((ext_name, issues))
    else:
        PASS.append(ext_name)


if __name__ == "__main__":
    for entry in sorted(os.listdir(BASE)):
        ext_dir = os.path.join(BASE, entry)
        if not os.path.isdir(ext_dir) or not entry.startswith("gtfish"):
            continue
        check_extension(entry)

    print("=" * 60)
    print(f"PASSED: {len(PASS)} extensions")
    print("=" * 60)
    for name in PASS:
        print(f"  OK: {name}")

    if ISSUES:
        print(f"\n{'=' * 60}")
        print(f"ISSUES: {len(ISSUES)} extensions")
        print("=" * 60)
        for name, issues in ISSUES:
            print(f"\n  {name}:")
            for issue in issues:
                print(f"    - {issue}")
    else:
        print("\nAll extensions passed verification!")
