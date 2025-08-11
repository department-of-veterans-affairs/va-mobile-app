#!/bin/bash

set -e

ARTIFACTS_DIR="../../../VAMobile/artifacts"
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