"""Update extension.vsixmanifest files for all extensions with mod/ directories."""
import os
import re
import json

BASE = r"D:\Dropbox\project\0_non-work_stuff\vscode plugin\1. vscodeExtensions"

def find_manifest(ext_dir):
    """Find vsixmanifest file."""
    for subdir in ["mod", "mods"]:
        path = os.path.join(ext_dir, subdir, "extension.vsixmanifest")
        if os.path.exists(path):
            return path
    return None

def find_package_json(ext_dir):
    """Find package.json to get description."""
    for subdir in ["mod/extension", "mods/extension", ""]:
        path = os.path.join(ext_dir, subdir, "package.json") if subdir else os.path.join(ext_dir, "package.json")
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except:
                pass
    return None

def update_manifest(manifest_path, ext_name, pkg_data):
    """Update the vsixmanifest file."""
    with open(manifest_path, "r", encoding="utf-8") as f:
        content = f.read()

    original = content

    # Update Description
    if pkg_data and pkg_data.get("description"):
        desc = pkg_data["description"]
        content = re.sub(
            r'<Description[^>]*>.*?</Description>',
            f'<Description xml:space="preserve">{desc}</Description>',
            content,
            flags=re.DOTALL
        )

    # Update Icon reference to use new icon
    content = re.sub(
        r'<Icon>[^<]*</Icon>',
        '<Icon>extension/images/icon.png</Icon>',
        content
    )

    # Update/add icon asset
    if 'Microsoft.VisualStudio.Services.Icons.Default' in content:
        content = re.sub(
            r'<Asset Type="Microsoft.VisualStudio.Services.Icons.Default"[^/]*/>\s*',
            '<Asset Type="Microsoft.VisualStudio.Services.Icons.Default" Path="extension/images/icon.png" Addressable="true" />\n',
            content
        )
    else:
        # Add icon asset before closing </Assets>
        content = content.replace(
            '</Assets>',
            '<Asset Type="Microsoft.VisualStudio.Services.Icons.Default" Path="extension/images/icon.png" Addressable="true" />\n  </Assets>'
        )

    # Remove/replace original author's repository links
    repo_url = f"https://github.com/tgaochn/vscodeExtensions/tree/master/{ext_name}"

    # Update Source link
    if 'Microsoft.VisualStudio.Services.Links.Source' in content:
        content = re.sub(
            r'<Property Id="Microsoft.VisualStudio.Services.Links.Source" Value="[^"]*"',
            f'<Property Id="Microsoft.VisualStudio.Services.Links.Source" Value="{repo_url}"',
            content
        )
    else:
        # Add source link property
        content = content.replace(
            '</Properties>',
            f'      <Property Id="Microsoft.VisualStudio.Services.Links.Source" Value="{repo_url}" />\n    </Properties>'
        )

    # Update GitHub link
    if 'Microsoft.VisualStudio.Services.Links.GitHub' in content:
        content = re.sub(
            r'<Property Id="Microsoft.VisualStudio.Services.Links.GitHub" Value="[^"]*"',
            f'<Property Id="Microsoft.VisualStudio.Services.Links.GitHub" Value="{repo_url}"',
            content
        )

    if content != original:
        with open(manifest_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  Updated: {manifest_path}")
    else:
        print(f"  No changes needed: {manifest_path}")


if __name__ == "__main__":
    for entry in sorted(os.listdir(BASE)):
        ext_dir = os.path.join(BASE, entry)
        if not os.path.isdir(ext_dir) or not entry.startswith("gtfish"):
            continue

        manifest = find_manifest(ext_dir)
        if not manifest:
            continue

        print(f"\n=== {entry} ===")
        pkg_data = find_package_json(ext_dir)
        update_manifest(manifest, entry, pkg_data)

    print("\n\nAll vsixmanifest files updated!")
