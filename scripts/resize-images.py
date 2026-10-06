"""
One-time helper: generates responsive width variants for every photo in images/.

For each source photo (e.g. images/rooms/4-bed-dorm-1.jpg) this creates:
  images/rooms/4-bed-dorm-1-480w.jpg
  images/rooms/4-bed-dorm-1-900w.jpg
  images/rooms/4-bed-dorm-1-1600w.jpg
(skipping any width larger than the original image, and skipping files that
already have a variant suffix).

Run again any time you add new photos to images/rooms or images/property --
it only (re)generates variants for source files, and is safe to re-run.

Usage:
    python scripts/resize-images.py
"""

from pathlib import Path
from PIL import Image, ImageOps

WIDTHS = [480, 900, 1600]
SOURCE_DIRS = ["images/rooms", "images/property"]
JPEG_QUALITY = 78

ROOT = Path(__file__).resolve().parent.parent


def is_variant(path: Path) -> bool:
    return any(path.stem.endswith(f"-{w}w") for w in WIDTHS)


def make_variants(path: Path) -> None:
    with Image.open(path) as img:
        img = ImageOps.exif_transpose(img)  # respect phone camera rotation
        img = img.convert("RGB")
        original_width = img.width

        for width in WIDTHS:
            if width >= original_width:
                continue
            out_path = path.with_name(f"{path.stem}-{width}w{path.suffix}")
            if out_path.exists():
                continue
            height = round(img.height * (width / original_width))
            resized = img.resize((width, height), Image.LANCZOS)
            resized.save(out_path, "JPEG", quality=JPEG_QUALITY, optimize=True)
            print(f"  + {out_path.relative_to(ROOT)}")


def main() -> None:
    for rel_dir in SOURCE_DIRS:
        directory = ROOT / rel_dir
        if not directory.exists():
            continue
        print(f"Processing {rel_dir}/")
        for path in sorted(directory.glob("*.jpg")):
            if is_variant(path):
                continue
            make_variants(path)


if __name__ == "__main__":
    main()
