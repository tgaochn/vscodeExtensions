"""Repackage all extensions with mod/ directories into .vsix files."""
import os
import json
import zipfile

BASE = r"D:\Dropbox\project\0_non-work_stuff\vscode plugin\1. vscodeExtensions"


def find_mod_dir(ext_dir):
    """Find the mod directory (mod/ or mods/)."""
    for subdir in ["mod", "mods"]:
        path = os.path.join(ext_dir, subdir)
        if os.path.isdir(path):
            return path
    return None


def get_version_info(mod_dir):
    """Get name and version from package.json."""
    pkg_path = os.path.join(mod_dir, "extension", "package.json")
    if os.path.exists(pkg_path):
        with open(pkg_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data.get("name", "unknown"), data.get("version", "0.0.0")
    return "unknown", "0.0.0"


def repackage(ext_name, mod_dir):
    """Create a .vsix file from the mod directory."""
    name, version = get_version_info(mod_dir)
    vsix_name = f"{name}-{version}.vsix"
    vsix_path = os.path.join(BASE, ext_name, vsix_name)

    with zipfile.ZipFile(vsix_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(mod_dir):
            # Skip node_modules in walk but include them
            for filename in files:
                filepath = os.path.join(root, filename)
                arcname = os.path.relpath(filepath, mod_dir)
                # Normalize path separators to forward slashes
                arcname = arcname.replace("\\", "/")
                zf.write(filepath, arcname)

    size_kb = os.path.getsize(vsix_path) / 1024
    print(f"  Created: {vsix_name} ({size_kb:.0f} KB)")
    return vsix_path


if __name__ == "__main__":
    count = 0
    for entry in sorted(os.listdir(BASE)):
        ext_dir = os.path.join(BASE, entry)
        if not os.path.isdir(ext_dir) or not entry.startswith("gtfish"):
            continue

        mod_dir = find_mod_dir(ext_dir)
        if not mod_dir:
            continue

        # Check if vsixmanifest exists (required for valid vsix)
        manifest = os.path.join(mod_dir, "extension.vsixmanifest")
        if not os.path.exists(manifest):
            print(f"\n=== {entry} === SKIP (no vsixmanifest)")
            continue

        print(f"\n=== {entry} ===")
        repackage(entry, mod_dir)
        count += 1

    print(f"\n\nRepackaged {count} extensions!")
