#!/bin/bash

# This script moves screenshots from the VAMobile/artifacts directory
# into the fastlane/screenshots/en-US/ directory for processing.

# Exit immediately if a command exits with a non-zero status.
# set -e

# Define the source and destination directories
ARTIFACTS_DIR="../../../VAMobile/artifacts"
DEST_DIR="fastlane/screenshots/en-US"

# Create the destination directory if it doesn't exist
echo "Creating destination directory: $DEST_DIR"
mkdir -p "$DEST_DIR"

# Flag to check if we processed any directories
PROCESSED=false

# Use nullglob to prevent errors if no matches are found
shopt -s nullglob

# Find and process directories starting with 'ios' or 'android' in the artifacts folder
for SOURCE_DIR in "$ARTIFACTS_DIR"/ios* "$ARTIFACTS_DIR"/android*; do
    if [ -d "$SOURCE_DIR" ]; then
        PROCESSED=true
        echo "Processing directory: $SOURCE_DIR"

        # Determine device type from source directory name
        DEVICE_TYPE=""
        DIR_BASENAME=$(basename "$SOURCE_DIR")
        if [[ "$DIR_BASENAME" == ios* ]]; then
            DEVICE_TYPE="_ios"
        elif [[ "$DIR_BASENAME" == android* ]]; then
            DEVICE_TYPE="_android"
        fi

        echo "Moving .png files from $SOURCE_DIR to $DEST_DIR..."
        # Use find to get all .png files, excluding those with "done" in their name
        # and move them, appending the device type suffix.
        find "$SOURCE_DIR" -type f -name "*.png" -not -iname "*done*" -print0 | while IFS= read -r -d $'\000' file; do
            BASENAME=$(basename "$file" .png)
            mv -v "$file" "$DEST_DIR/${BASENAME}${DEVICE_TYPE}.png"
        done

        # Delete the source directory after moving files.
        echo "Deleting source directory: $SOURCE_DIR"
        rm -rf "$SOURCE_DIR"
    fi
done

# Unset nullglob
shopt -u nullglob

if [ "$PROCESSED" = false ]; then
    echo "No directories matching 'ios*' or 'android*' found in '$ARTIFACTS_DIR' to process."
fi

echo "Copying Letters Images.."
cp LettersDownload* fastlane/screenshots/en-US/

echo "Script Complete."
