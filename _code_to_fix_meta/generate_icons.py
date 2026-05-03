"""Generate unique icons for all gtfish VS Code extensions."""
import os
import colorsys
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = r"D:\Dropbox\project\0_non-work_stuff\vscode plugin\1. vscodeExtensions"

# All extension directories
EXTENSIONS = [
    "gtfish01_bracket-jumper",
    "gtfish02_insert-numbers",
    "gtfish03_matlab-formatter",
    "gtfish04_select-highlight",
    "gtfish05_time-range",
    "gtfish06_auto-markdown-preview",
    "gtfish07_change-case",
    "gtfish08_markdown-viewer",
    "gtfish09_insert-comma",
    "gtfish10_diff-tool",
    "gtfish12_template-generator",
    "gtfish13_insert-numbers-alphacharts",
    "gtfish14_value-sum-up",
    "gtfish15_split-join-text",
    "gtfish16_auto_align",
    "gtfish17_open_file",
    "gtfish18_instant_md_table",
    "gtfish19_wrap_selection",
    "gtfish20_notes",
    "gtfish21_labeled_bookmarks",
    "gtfish22_python-string-sql",
    "gtfish23_language-injection",
    "gtfish24_jira_markdown",
    "gtfish25-sql-formatter",
    "gtfish26-join-selected-string",
    "gtfish27-markdown-render-link",
    "gtfish28-add-header",
    "gtfish29-formatted-paste",
    "gtfish30-render-pattern",
    "gtfish31-folding",
    "gtfish32_markdown-formatter",
]

SIZE = 128

def generate_icon(ext_name, index, total):
    """Generate a unique colored icon with the extension number."""
    # Extract number from name (e.g., "gtfish03_matlab-formatter" -> "03")
    num = ext_name.replace("gtfish", "").split("_")[0].split("-")[0]

    # Generate unique hue evenly spaced around color wheel
    hue = index / total
    # Use high saturation and medium brightness for vivid colors
    r, g, b = colorsys.hsv_to_rgb(hue, 0.65, 0.85)
    bg_color = (int(r * 255), int(g * 255), int(b * 255))

    # Create image with rounded rectangle
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Draw rounded rectangle background
    draw.rounded_rectangle([(4, 4), (SIZE - 4, SIZE - 4)], radius=20, fill=bg_color)

    # Draw "GF" text at top
    try:
        font_small = ImageFont.truetype("arial.ttf", 24)
        font_large = ImageFont.truetype("arial.ttf", 48)
    except (OSError, IOError):
        font_small = ImageFont.load_default()
        font_large = ImageFont.load_default()

    # Draw "GF" label
    draw.text((SIZE // 2, 30), "GF", fill=(255, 255, 255, 200), font=font_small, anchor="mm")

    # Draw number prominently
    draw.text((SIZE // 2, 76), num, fill=(255, 255, 255), font=font_large, anchor="mm")

    # Determine output path - put in images/ subdirectory
    ext_dir = os.path.join(BASE_DIR, ext_name)
    img_dir = os.path.join(ext_dir, "images")
    os.makedirs(img_dir, exist_ok=True)

    output_path = os.path.join(img_dir, "icon.png")
    img.save(output_path, "PNG")
    print(f"  Generated: {ext_name}/images/icon.png")
    return output_path


if __name__ == "__main__":
    print(f"Generating {len(EXTENSIONS)} icons...")
    for i, ext in enumerate(EXTENSIONS):
        generate_icon(ext, i, len(EXTENSIONS))
    print("Done!")
