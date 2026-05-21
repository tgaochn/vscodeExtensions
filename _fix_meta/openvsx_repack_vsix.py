"""Repack mod/ into a clean .vsix without NTFS extra fields (0x000a).

Open-vsx rejects zip entries with extra fields. Windows zip tools (PowerShell
Compress-Archive, 7-Zip default, Explorer "Send to compressed") inject NTFS
timestamp extra fields. Python's zipfile does not, so we use it directly.
"""
import os
import zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "mod")
OUT = os.path.join(ROOT, "gtfish32_markdown-formatter_fixed.vsix")


def main():
    if os.path.exists(OUT):
        os.remove(OUT)

    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for dirpath, _, filenames in os.walk(SRC):
            for fn in filenames:
                full = os.path.join(dirpath, fn)
                arc = os.path.relpath(full, SRC).replace(os.sep, "/")
                zf.write(full, arc)

    print(f"Wrote {OUT}")
    with zipfile.ZipFile(OUT) as zf:
        for info in zf.infolist():
            print(f"  {info.filename}  ({info.file_size} bytes)")


if __name__ == "__main__":
    main()
