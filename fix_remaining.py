"""Fix remaining metadata issues: bugs, homepage, __metadata, and vsixmanifest links."""
import json
import os
import re

BASE = r"D:\Dropbox\project\0_non-work_stuff\vscode plugin\1. vscodeExtensions"


def fix_package_json_fields():
    """Remove bugs/homepage pointing to original authors, and __metadata fields."""
    print("=" * 60)
    print("FIXING package.json bugs/homepage/__metadata")
    print("=" * 60)

    for entry in sorted(os.listdir(BASE)):
        ext_dir = os.path.join(BASE, entry)
        if not os.path.isdir(ext_dir) or not entry.startswith("gtfish"):
            continue

        for subdir in ["mod/extension", "mods/extension", ""]:
            pkg_path = os.path.join(ext_dir, subdir, "package.json") if subdir else os.path.join(ext_dir, "package.json")
            if not os.path.exists(pkg_path):
                continue

            try:
                with open(pkg_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
            except:
                continue

            changed = False

            # Remove bugs if pointing to non-tgaochn
            bugs = data.get("bugs", {})
            if isinstance(bugs, dict):
                if bugs.get("url", "") and "tgaochn" not in bugs.get("url", ""):
                    del data["bugs"]
                    changed = True
                    print(f"  {entry}: Removed bugs field (was: {bugs})")
            elif isinstance(bugs, str) and bugs and "tgaochn" not in bugs:
                del data["bugs"]
                changed = True
                print(f"  {entry}: Removed bugs field (was: {bugs})")

            # Remove homepage if pointing to non-tgaochn
            homepage = data.get("homepage", "")
            if homepage and "tgaochn" not in homepage:
                del data["homepage"]
                changed = True
                print(f"  {entry}: Removed homepage (was: {homepage})")

            # Remove __metadata
            if "__metadata" in data:
                del data["__metadata"]
                changed = True
                print(f"  {entry}: Removed __metadata")

            if changed:
                with open(pkg_path, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent="\t", ensure_ascii=False)
                    f.write("\n")

            break


def fix_vsixmanifest_links():
    """Remove/replace original author links in vsixmanifest files."""
    print("\n" + "=" * 60)
    print("FIXING vsixmanifest Getstarted/Support/Learn links")
    print("=" * 60)

    for entry in sorted(os.listdir(BASE)):
        ext_dir = os.path.join(BASE, entry)
        if not os.path.isdir(ext_dir) or not entry.startswith("gtfish"):
            continue

        for subdir in ["mod", "mods"]:
            manifest_path = os.path.join(ext_dir, subdir, "extension.vsixmanifest")
            if not os.path.exists(manifest_path):
                continue

            with open(manifest_path, "r", encoding="utf-8") as f:
                content = f.read()

            original = content
            repo_url = f"https://github.com/tgaochn/vscodeExtensions/tree/master/{entry}"

            # Replace Getstarted link
            content = re.sub(
                r'<Property Id="Microsoft\.VisualStudio\.Services\.Links\.Getstarted" Value="[^"]*"',
                f'<Property Id="Microsoft.VisualStudio.Services.Links.Getstarted" Value="{repo_url}"',
                content
            )

            # Replace Support link
            content = re.sub(
                r'<Property Id="Microsoft\.VisualStudio\.Services\.Links\.Support" Value="[^"]*"',
                f'<Property Id="Microsoft.VisualStudio.Services.Links.Support" Value="{repo_url}/issues"',
                content
            )

            # Replace Learn link
            content = re.sub(
                r'<Property Id="Microsoft\.VisualStudio\.Services\.Links\.Learn" Value="[^"]*"',
                f'<Property Id="Microsoft.VisualStudio.Services.Links.Learn" Value="{repo_url}#readme"',
                content
            )

            if content != original:
                with open(manifest_path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"  {entry}: Updated vsixmanifest links")

            break


if __name__ == "__main__":
    fix_package_json_fields()
    fix_vsixmanifest_links()
    print("\nDone!")
