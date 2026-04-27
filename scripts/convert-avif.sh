#!/usr/bin/env bash
# Convert homepage PNG/JPG/WebP source images to AVIF.
# Originals are kept; outputs sit alongside with .avif extension.
set -euo pipefail

cd "$(dirname "$0")/../public/images"

# Homepage images (HorizontalCards, Hero poster, Services, Work cards/slices, ProcessManifesto bg)
files=(
  card-party.jpg
  card-party-2.png
  card-tennis.png
  card-pools.png
  card-fashion.png
  card-1.jpg
  card-web-1.png
  card-gosage.png
  hero-bg.png
  brand-showcase.png
  websites-laptop.png
  limitless-laptop.png
  morgan-consulting.png
  gotta-slice-1.png
  gotta-slice-2.png
  gotta-slice-3.png
  gotta-slice-4.png
  gotta-slice-5.png
  gotta-stitched.webp
  gotta-preview-bg.webp
  tennis-stitched.webp
  tennis-preview-bg.webp
  tennis-left-graphic.webp
  wander-women.webp
  gosage-lawn.webp
  camprodest-bg.webp
  sleeq-card.webp
  bma-card.webp
)

for f in "${files[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "skip (missing): $f"
    continue
  fi
  out="${f%.*}.avif"
  if [[ -f "$out" && "$out" -nt "$f" ]]; then
    echo "skip (up-to-date): $out"
    continue
  fi
  echo "encode: $f -> $out"
  if ! ffmpeg -y -loglevel error -i "$f" -c:v libaom-av1 -still-picture 1 -crf 32 -b:v 0 -cpu-used 6 "$out"; then
    echo "  !! failed, skipping $f"
    rm -f "$out"
  fi
done

echo "done."
