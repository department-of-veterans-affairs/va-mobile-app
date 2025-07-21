#!/bin/bash
set -x
set -e
# This Script will generate the app store images so we are able to do them automatically instead of manually creating.

# This is needed for local runs
# cd ../../../VAMobile/

# echo "Gahtering Android screens.."
# yarn jest:clear && yarn detox test -c android --cleanup ./screenshot.e2e.ts

# echo "Gathering iOS screens.."
# yarn jest:clear && yarn detox test -c ios --cleanup ./screenshot.e2e.ts
#
# echo "Gathering iPad screens.."
# yarn jest:clear && yarn detox test -c ipad --cleanup ./screenshot.e2e.ts

echo "Current directory is"
pwd

echo "navigating to script directory.."
cd ../.github/scripts/app-store-images

echo "Moving Images.."
./move_screenshots.sh

echo "Processing Images.."
./process_images.sh

