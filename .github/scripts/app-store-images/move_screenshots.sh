#!/bin/bash

set -e

# Try both local artifacts (for testing) and VAMobile artifacts (for production)
if [ -d "artifacts" ] && [ "$(find artifacts -name "*.png" 2>/dev/null | wc -l)" -gt 0 ]; then
  ARTIFACTS_DIR="artifacts"
  echo "Using local artifacts directory"
elif [ -d "../../../VAMobile/artifacts" ] && [ "$(find ../../../VAMobile/artifacts -name "*.png" 2>/dev/null | wc -l)" -gt 0 ]; then
  ARTIFACTS_DIR="../../../VAMobile/artifacts"
  echo "Using VAMobile artifacts directory"
else
  echo "Error: No artifacts directory with screenshots found."
  echo "Checked: ./artifacts and ../../../VAMobile/artifacts"
  exit 1
fi

DEST_DIR="fastlane/screenshots/en-US"
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo "Creating destination directory: $DEST_DIR"
mkdir -p "$DEST_DIR"

rm -f "$DEST_DIR"/*

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
