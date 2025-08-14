#!/bin/bash

set -e

# The workflow calls this script from VAMobile/ directory, so adjust paths accordingly
# Check multiple possible locations for artifacts
POSSIBLE_PATHS=(
  "artifacts"                    # When run from VAMobile/ (CI)
  "../VAMobile/artifacts"        # When run from .github/scripts/app-store-images/ (local)
  "../../../VAMobile/artifacts"  # Alternative local path
)

ARTIFACTS_DIR=""
for path in "${POSSIBLE_PATHS[@]}"; do
  if [ -d "$path" ] && [ "$(find "$path" -name "*.png" 2>/dev/null | wc -l)" -gt 0 ]; then
    ARTIFACTS_DIR="$path"
    echo "Using artifacts directory: $ARTIFACTS_DIR"
    break
  fi
done

if [ -z "$ARTIFACTS_DIR" ]; then
  echo "Error: No artifacts directory with screenshots found."
  echo "Checked paths:"
  for path in "${POSSIBLE_PATHS[@]}"; do
    echo "  - $path $([ -d "$path" ] && echo "(exists)" || echo "(not found)")"
  done
  exit 1
fi

DEST_DIR="fastlane/screenshots/en-US"
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo "Debug info:"
echo "  Current working directory: $(pwd)"
echo "  Script directory: $SCRIPT_DIR"
echo "  Artifacts directory: $ARTIFACTS_DIR"
echo "  Destination directory: $DEST_DIR"

echo "Creating destination directory: $DEST_DIR"
mkdir -p "$DEST_DIR"

rm -f "$DEST_DIR"/*

echo "Found screenshots in $ARTIFACTS_DIR:"
find "$ARTIFACTS_DIR" -name "*.png" -exec ls -la {} \; 2>/dev/null || echo "No PNG files found"

echo "Processing screenshots from TypeScript data..."

while IFS=$'\t' read -r image_name test_id device_type description; do
  found_image=$(find "$ARTIFACTS_DIR" -name "${image_name}.png" -print -quit)

  if [ -n "$found_image" ]; then
    echo "Moving $image_name for $device_type"
    mv -v "$found_image" "$DEST_DIR/${device_type}-${image_name}.png"
  else
    if [[ "$image_name" == "LettersDownload_ios" || "$image_name" == "LettersDownload_android" || "$image_name" == "LettersDownload_ipad" ]]; then
      echo "Copying $image_name for $device_type"
      cp "${image_name}.png" "$DEST_DIR/${device_type}-${image_name}.png"
    else
      echo "Warning: Could not find image ${image_name}.png in $ARTIFACTS_DIR"
    fi
  fi
done < <(node "$SCRIPT_DIR/generate_image_mapping.js")

echo "Move complete."
