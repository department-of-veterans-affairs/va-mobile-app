#!/bin/bash
# set -x

# This script cleans up the artifacts directory to a clean state.


# Move any images from subdirectories back to the main en-US directory.
# Use find to get all png files in subdirectories and move them up.
find fastlane/screenshots/en-US/ -mindepth 2 -type f -name "*.png" -exec mv {} fastlane/screenshots/en-US/ \;

# Remove the (now empty) subdirectories.
rm -rf fastlane/screenshots/en-US/android_original fastlane/screenshots/en-US/ios_original fastlane/screenshots/en-US/android_framed fastlane/screenshots/en-US/ios_framed framed_images

# Remove any leftover images from the main directory
rm -rf fastlane/screenshots/en-US/*
rm -rf framed_images/

echo "Listing Fastlane Dir.."
ls -al fastlane/screenshots/en-US
