#!/bin/bash
set -x
set -e
# This Script will generate the app store images so we are able to do them automatically instead of manually creating.

# echo "current working dir is"
# pwd
# cd ../../../VAMobile/
# pwd
echo "Installing Packages.."
yarn install

echo "Bundling ios.."
yarn bundle:ios

echo "Building apps.."
detox build -c android
detox build -c ios

echo "Gahtering Android screens.."
yarn jest:clear && detox test -c android --cleanup ./screenshot.e2e.ts

echo "Gathering iOS screens.."
yarn jest:clear && detox test -c ios --cleanup ./screenshot.e2e.ts

echo "Gathering iPad screens.."
yarn jest:clear && detox test -c ipad --cleanup ./screenshot.e2e.ts

# echo "Current dir is"
# pwd
echo "navigating to script directory.."
cd ../.github/scripts/app-store-images


echo "Moving Images.."
./move_screenshots.sh

echo "Processing Images.."
./process_images.sh

