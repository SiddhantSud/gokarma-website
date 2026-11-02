"""
Removes GPS location data from every photo in images/.

Phone cameras save the exact spot a photo was taken (GPS
coordinates) inside the image file. GitHub Pages serves every file
in this repo, including the full-size originals, so anyone could
download one and read where it was taken. This script deletes that
GPS block and nothing else: the picture itself isn't re-encoded, so
there is no quality loss, and the rotation tag is kept so photos
still display the right way up.

The resized -480w/-900w/-1600w copies made by resize-images.py
never carry GPS data, but this checks them too.

Run it after adding new photos (resize-images.py also runs it
automatically). Safe to re-run: photos without GPS data are left
untouched.

Usage:
    python scripts/strip-photo-location.py

Needs piexif:
    pip install piexif
"""

from pathlib import Path

import piexif

ROOT = Path(__file__).resolve().parent.parent
IMAGES_DIR = ROOT / "images"


def strip_gps(path: Path) -> bool:
    """Deletes the GPS block from one JPEG. Returns True if anything was removed."""
    exif = piexif.load(str(path))
    if not exif.get("GPS"):
        return False

    exif["GPS"] = {}
    # A pointer to the (now empty) GPS block would be left dangling.
    exif["0th"].pop(piexif.ImageIFD.GPSTag, None)
    # Some phones store a thumbnail piexif can't write back; drop it.
    exif["thumbnail"] = None
    exif["1st"] = {}

    piexif.insert(piexif.dump(exif), str(path))
    return True


def main() -> None:
    photos = sorted(
        p for p in IMAGES_DIR.rglob("*") if p.suffix.lower() in (".jpg", ".jpeg")
    )
    cleaned = 0
    for path in photos:
        if strip_gps(path):
            cleaned += 1
            print(f"  - removed GPS from {path.relative_to(ROOT)}")
    print(f"Checked {len(photos)} photos, removed GPS data from {cleaned}.")


if __name__ == "__main__":
    main()
