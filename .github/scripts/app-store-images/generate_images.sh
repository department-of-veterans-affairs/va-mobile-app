#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# cd "$SCRIPT_DIR/../../../VAMobile/"

# echo "Gathering iOS screens..."
# yarn jest:clear && yarn detox test -c ios --cleanup ./screenshot.e2e.ts
#
# echo "Gathering iPad screens..."
# yarn jest:clear && yarn detox test -c ipad --cleanup ./screenshot.e2e.ts
#
# echo "Gathering Android screens..."
# yarn jest:clear && yarn detox test -c android --cleanup ./screenshot.e2e.ts

cd "$SCRIPT_DIR"

echo "Moving images..."
./move_screenshots.sh

echo "Processing images..."
./process_images.sh
