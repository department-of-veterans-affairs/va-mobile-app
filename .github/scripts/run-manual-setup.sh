#!/bin/bash

# This script provides a centralized way to run manual setup steps
# that are normally skipped when using --ignore-scripts.

set -e

PLATFORM=$1

if [ -z "$PLATFORM" ]; then
  echo "Usage: $0 <platform>"
  echo "Platform must be 'ios' or 'android'."
  exit 1
fi

# Navigate to the root of the repository
cd "$(dirname "$0")/../../"

echo "--- Running common setup steps ---"
echo "Setting up husky..."
(cd VAMobile && yarn prepare)

if [ "$PLATFORM" == "android" ]; then
  echo "--- Running Android specific setup ---"
  echo "Applying patches..."
  (cd VAMobile && yarn patch-package)
elif [ "$PLATFORM" == "ios" ]; then
  echo "--- Running iOS specific setup ---"
  echo "Installing pods..."
  (cd VAMobile/ios && pod install)
else
  echo "Invalid platform: $PLATFORM"
  exit 1
fi

echo "--- Setup complete for $PLATFORM ---"
