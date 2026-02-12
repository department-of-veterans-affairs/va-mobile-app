#!/bin/bash

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

POSSIBLE_PATHS=(
  "$SCRIPT_DIR/../../../VAMobile/artifacts"
  "artifacts"
  "../VAMobile/artifacts"
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
  exit 1
fi

DEST_DIR="fastlane/screenshots/en-US"

echo "Creating destination directory: $DEST_DIR"
mkdir -p "$DEST_DIR"

rm -f "$DEST_DIR"/*

echo "Processing screenshots from TypeScript data..."

while IFS=$'\t' read -r image_name test_id device_type description; do
  found_image=$(find "$ARTIFACTS_DIR" -name "${image_name}.png" -print -quit)

  if [ -n "$found_image" ]; then
    mv -v "$found_image" "$DEST_DIR/${device_type}-${image_name}.png"
  else
    if [[ "$test_id" == "LettersDownload" ]]; then
      # Use the static LettersDownload images but rename them to match expected output
      if [[ "$device_type" == "ios" ]]; then
        cp "LettersDownload_ios.png" "$DEST_DIR/${device_type}-${image_name}.png"
      elif [[ "$device_type" == "android" ]]; then
        cp "LettersDownload_android.png" "$DEST_DIR/${device_type}-${image_name}.png"
      elif [[ "$device_type" == "ipad" ]]; then
        cp "LettersDownload_ipad.png" "$DEST_DIR/${device_type}-${image_name}.png"
      fi
    else
      echo "Warning: Could not find image ${image_name}.png in $ARTIFACTS_DIR"
    fi
  fi
done < <(node "$SCRIPT_DIR/generate_image_mapping.js")

echo "Move complete."
