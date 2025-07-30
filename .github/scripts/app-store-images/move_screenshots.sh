#!/bin/bash

# This script moves screenshots from the VAMobile/artifacts directory
# into the fastlane/screenshots/en-US/ directory for processing.

set -e

# Define the source and destination directories
ARTIFACTS_DIR="../../../VAMobile/artifacts"
DEST_DIR="fastlane/screenshots/en-US"
INPUT_FILE="screenshot_data.ts"

# Create the destination directory if it doesn't exist
echo "Creating destination directory: $DEST_DIR"
mkdir -p "$DEST_DIR"

# Clear out the destination directory to start fresh
rm -f "$DEST_DIR"/*

# Read the image names from the screenshot_data.ts file
# and move them from the artifacts directory.
while IFS= read -r line; do
  regex="(ios|android|ipad):[[:space:]]*'([^']*)'"
  if [[ "$line" =~ $regex ]]; then
    device_type="${BASH_REMATCH[1]}"
    image_name="${BASH_REMATCH[2]}"

    # Find the image in any of the artifact subdirectories
    found_image=$(find "$ARTIFACTS_DIR" -name "${image_name}.png" -print -quit)

    if [ -n "$found_image" ]; then
      echo "Moving $image_name for $device_type"
      mv -v "$found_image" "$DEST_DIR/"
    else
      echo "Warning: Could not find image ${image_name}.png in $ARTIFACTS_DIR"
    fi
  fi
done < "$INPUT_FILE"


echo "Copying Letters Images.."
cp LettersDownload* fastlane/screenshots/en-US/

echo "Script Complete."

