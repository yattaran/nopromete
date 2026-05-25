#!/usr/bin/env python3
"""Remove baked-in transparency checkerboard from PNGs (edge flood-fill)."""

from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

from PIL import Image
import numpy as np


def color_distance(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.linalg.norm(a.astype(np.int16) - b.astype(np.int16)))


def sample_background_colors(data: np.ndarray, tolerance: float = 35) -> list[np.ndarray]:
    h, w = data.shape[:2]
    samples = [
        data[0, 0, :3],
        data[0, w - 1, :3],
        data[h - 1, 0, :3],
        data[h - 1, w - 1, :3],
        data[0, w // 2, :3],
        data[h - 1, w // 2, :3],
        data[h // 2, 0, :3],
        data[h // 2, w - 1, :3],
    ]
    colors: list[np.ndarray] = []
    for sample in samples:
        if any(color_distance(sample, known) <= tolerance for known in colors):
            continue
        colors.append(sample)
    return colors


def matches_background(rgb: np.ndarray, bg_colors: list[np.ndarray], tolerance: float) -> bool:
    return any(color_distance(rgb, bg) <= tolerance for bg in bg_colors)


def strip_checkerboard(path: Path, tolerance: float = 35) -> None:
    img = Image.open(path).convert("RGBA")
    data = np.array(img)
    h, w = data.shape[:2]
    bg_colors = sample_background_colors(data, tolerance)

    if not bg_colors:
        print(f"  skip {path.name}: no background colors detected")
        return

    removable = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()
    visited: set[tuple[int, int]] = set()

    for x in range(w):
        for y in (0, h - 1):
            if matches_background(data[y, x, :3], bg_colors, tolerance):
                queue.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if matches_background(data[y, x, :3], bg_colors, tolerance):
                queue.append((x, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        if x < 0 or x >= w or y < 0 or y >= h:
            continue
        if not matches_background(data[y, x, :3], bg_colors, tolerance):
            continue

        visited.add((x, y))
        removable[y, x] = True
        queue.extend([(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)])

    data[removable, 3] = 0
    Image.fromarray(data).save(path, optimize=True)
    removed = int(removable.sum())
    print(f"  {path.name}: cleared {removed} px ({removed * 100 // (h * w)}%)")


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    targets = list((root / "public" / "don-zopi").glob("*.png"))
    comenta = root / "public" / "brand" / "don-zopi-comenta.png"
    if comenta.exists():
        targets.append(comenta)

    if not targets:
        print("No PNG targets found.")
        sys.exit(1)

    print(f"Processing {len(targets)} image(s)...")
    for path in sorted(targets):
        strip_checkerboard(path)


if __name__ == "__main__":
    main()
