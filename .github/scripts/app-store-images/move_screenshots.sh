#!/bin/bash

# This script moves screenshots from the VAMobile/artifacts directory
# into the fastlane/screenshots/en-US/ directory for processing.

set -e

# Define the source and destination directories
ARTIFACTS_DIR="../../../VAMobile/artifacts"
DEST_DIR="fastlane/screenshots/en-US"
CONFIG_FILE="image_config.tsv"

# Create the destination directory if it doesn't exist
echo "Creating destination directory: $DEST_DIR"
mkdir -p "$DEST_DIR"

# Clear out the destination directory to start fresh
rm -f "$DEST_DIR"/*

# Read the image names from the config file
# and move them from the artifacts directory.
while IFS=$'\t' read -r image_name test_id device_type description; do
  # Find the image in any of the artifact subdirectories
  found_image=$(find "$ARTIFACTS_DIR" -name "${image_name}.png" -print -quit)

  if [ -n "$found_image" ]; then
    echo "Moving $image_name for $device_type"
    mv -v "$found_image" "$DEST_DIR/${device_type}-${image_name}.png"
  else
    # The LettersDownload images are not in the artifacts directory, so we need to copy them from the root directory
    if [[ "$image_name" == "LettersDownload_ios" || "$image_name" == "LettersDownload_android" || "$image_name" == "LettersDownload_ipad" ]]; then
      echo "Copying $image_name for $device_type"
      cp "${image_name}.png" "$DEST_DIR/"
    else
      echo "Warning: Could not find image ${image_name}.png in $ARTIFACTS_DIR"
    fi
  fi
done < "$CONFIG_FILE"

echo "Script Complete."