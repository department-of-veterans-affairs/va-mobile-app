#!/bin/bash
# set -e
# set -x # Uncomment for deep debugging

# --- Pre-flight checks ---
if [ ! -d "fastlane/screenshots/en-US" ] || [ -z "$(ls -A fastlane/screenshots/en-US)" ]; then
  echo "Error: Source screenshot directory 'fastlane/screenshots/en-US' is missing or empty."
  exit 1
fi

# --- Cleanup and setup ---
echo "Cleaning up old files..."
rm -f fastlane/screenshots/en-US/*_framed.png # Clean up previous frameit runs

# --- Stage 1: Add Device Bezels with frameit ---
echo "Stage 1: Adding device frames with fastlane frameit..."

# Create temporary directories for original and framed screenshots
mkdir -p fastlane/screenshots/en-US/ios_original
mkdir -p fastlane/screenshots/en-US/android_original
mkdir -p fastlane/screenshots/en-US/ipad_original
mkdir -p fastlane/screenshots/en-US/ios_framed
mkdir -p fastlane/screenshots/en-US/android_framed
mkdir -p fastlane/screenshots/en-US/ipad_framed
mkdir -p framed_images

# Move screenshots to their respective temporary original directories
for img in fastlane/screenshots/en-US/*.png; do
  BASENAME=$(basename "$img" .png)
  if [[ "$BASENAME" == *_ios ]]; then
    mv "$img" fastlane/screenshots/en-US/ios_original/
  elif [[ "$BASENAME" == *_android ]]; then
    mv "$img" fastlane/screenshots/en-US/android_original/
  elif [[ "$BASENAME" == *_ipad ]]; then
    mv "$img" fastlane/screenshots/en-US/ipad_original/
  fi
done

# Process iOS images
if [ -n "$(ls -A fastlane/screenshots/en-US/ios_original/)" ]; then
  echo "Processing iOS images..."
  # Move iOS images to the main screenshots directory for frameit
  mv fastlane/screenshots/en-US/ios_original/* fastlane/screenshots/en-US/

  # Initial resize for frameit to recognize ios
  for im in fastlane/screenshots/en-US/*_ios.png; do
    magick "$im" -resize 1290x2796! "$im" # Iphone 14 Pro Max
  done
  
  # Create a temporary Framefile.json to suppress warnings
  echo '{"default": {"background": "#00000000"}}' > fastlane/Framefile.json

  # Run frameit for iOS, letting it auto-detect the device from image dimensions
  cd fastlane
  fastlane frameit &> frameit_ios.log
  rm Framefile.json

  # Move framed iOS images to their dedicated framed directory
  if ! ls screenshots/en-US/*_framed.png 1> /dev/null 2>&1; then
    echo "Error: frameit failed to create iOS images. See log below:"
    cat frameit_ios.log
    cd ..
    exit 1
  fi
  mv screenshots/en-US/*_framed.png screenshots/en-US/ios_framed/
  rm screenshots/en-US/*_ios.png
  cd ..
fi

# Process Android images
if [ -n "$(ls -A fastlane/screenshots/en-US/android_original/)" ]; then
  echo "Processing Android images..."
  # Move Android images to the main screenshots directory for framing
  mv fastlane/screenshots/en-US/android_original/* fastlane/screenshots/en-US/

  # Resize all Android images first
  for img in fastlane/screenshots/en-US/*_android.png; do
    magick "$img" -resize "1080x2280!" "$img" # Pixel 6
  done

  # Create a temporary Framefile.json to suppress warnings
  echo '{"default": {"background": "#00000000"}}' > fastlane/Framefile.json

  # Run frameit for Android, letting it auto-detect the device from image dimensions
  echo "Adding Android frames with frameit"
  cd fastlane
  fastlane frameit android &> frameit_android.log
  rm Framefile.json

  # Verify that framed images were created
  if ! ls screenshots/en-US/*_framed.png 1> /dev/null 2>&1; then
    echo "Error: frameit failed to create Android images. See log below:"
    cat frameit_android.log
    cd ..
    exit 1
  fi
  
  # Move framed images to the dedicated directory
  mv screenshots/en-US/*_framed.png screenshots/en-US/android_framed/
  rm screenshots/en-US/*_android.png
  cd ..
fi

# Process iPad images
if [ -n "$(ls -A fastlane/screenshots/en-US/ipad_original/)" ]; then
  echo "Processing iPad images..."
  # Move iPad images to the main screenshots directory for framing
  mv fastlane/screenshots/en-US/ipad_original/* fastlane/screenshots/en-US/

  # Resize all iPad images first for frameit
  for img in fastlane/screenshots/en-US/*_ipad.png; do
    magick "$img" -resize "2048x2732!" "$img" # iPad Pro 12.9-inch
  done

  # Create a temporary Framefile.json to suppress warnings
  echo '{"default": {"background": "#00000000"}}' > fastlane/Framefile.json

  # Run frameit for iPad
  echo "Adding iPad frames with frameit"
  cd fastlane
  fastlane frameit &> frameit_ipad.log
  rm Framefile.json

  # Verify that framed images were created
  if ! ls screenshots/en-US/*_framed.png 1> /dev/null 2>&1; then
    echo "Error: frameit failed to create iPad images. See log below:"
    cat frameit_ipad.log
    cd ..
    exit 1
  fi
  
  # Move framed images to the dedicated directory
  mv screenshots/en-US/*_framed.png screenshots/en-US/ipad_framed/
  rm screenshots/en-US/*_ipad.png
  cd ..
fi

# Consolidate all framed images back into the main fastlane/screenshots/en-US/ directory
if [ -n "$(ls -A fastlane/screenshots/en-US/ios_framed/)" ]; then
  mv fastlane/screenshots/en-US/ios_framed/* fastlane/screenshots/en-US/
fi
if [ -n "$(ls -A fastlane/screenshots/en-US/android_framed/)" ]; then
  mv fastlane/screenshots/en-US/android_framed/* fastlane/screenshots/en-US/
fi
if [ -n "$(ls -A fastlane/screenshots/en-US/ipad_framed/)" ]; then
  mv fastlane/screenshots/en-US/ipad_framed/* fastlane/screenshots/en-US/
fi

# Clean up temporary directories
rm -rf fastlane/screenshots/en-US/ios_original
rm -rf fastlane/screenshots/en-US/android_original
rm -rf fastlane/screenshots/en-US/ipad_original
rm -rf fastlane/screenshots/en-US/ios_framed
rm -rf fastlane/screenshots/en-US/android_framed
rm -rf fastlane/screenshots/en-US/ipad_framed

# --- Resize framed images ---
echo "Resizing framed images..."
# Check if any framed images exist before trying to resize them
if ! ls fastlane/screenshots/en-US/*_framed.png 1> /dev/null 2>&1; then
  echo "Warning: No framed images found to resize. Skipping resize step."
else
  for img in fastlane/screenshots/en-US/*_framed.png; do
    # Determine if it's an iOS or Android image based on the filename
    if [[ "$img" == *_ios_framed.png ]]; then
      # Resize iOS images to a width of 475px, maintaining aspect ratio
      magick "$img" -resize 475 "$img"
    elif [[ "$img" == *_android_framed.png ]]; then
      # Resize Android images to a width of 475px, maintaining aspect ratio
      magick "$img" -resize 475 "$img"
    elif [[ "$img" == *_ipad_framed.png ]]; then
      # Resize iPad images to a width of 475px, maintaining aspect ratio
      magick "$img" -resize 475 "$img"
    fi
  done
fi

# --- Stage 2: Add Background and Titles with ImageMagick ---
echo "Stage 2: Adding background and titles with ImageMagick..."

# Settings
BACKGROUND_IMG="gradient.png"
FONT="source-sans-pro.regular.ttf"
FONT_COLOR="#F1F1F1"
TITLE_FONT_SIZE=49
INTERLINE_SPACING=-5
TEXT_AREA_PADDING=40 # Added padding between text and image
TEXT_VERTICAL_OFFSET=30 # Offset to drop text down from the top (approx 0.25 inches)
TEXT_HORIZONTAL_INSET=20 # Small inset from left/right edges for text

# Set horizontal padding to ~1 inch.
# Set top padding to ~2 inches and bottom padding to ~1 inch.
HORIZONTAL_PADDING=120
TOP_PADDING=240
BOTTOM_PADDING=120 # Reduced from 150 to remove ~0.25 inches

# Check if any framed images exist before trying to process them
if ! ls fastlane/screenshots/en-US/*_framed.png 1> /dev/null 2>&1; then
  echo "Error: No framed images found to process. Exiting."
  exit 1
fi

# Process each of the newly framed images from frameit
for img in fastlane/screenshots/en-US/*_framed.png; do
  # Extract the base name without _framed.png and without _ios or _android suffix
  BASENAME_WITH_DEVICE=$(basename "$img" _framed.png)
  if [[ "$BASENAME_WITH_DEVICE" == *_ios ]]; then
    BASENAME="${BASENAME_WITH_DEVICE%_ios}"
  elif [[ "$BASENAME_WITH_DEVICE" == *_android ]]; then
    BASENAME="${BASENAME_WITH_DEVICE%_android}"
  elif [[ "$BASENAME_WITH_DEVICE" == *_ipad ]]; then
    BASENAME="${BASENAME_WITH_DEVICE%_ipad}"
  else
    BASENAME="$BASENAME_WITH_DEVICE" # Fallback if no device suffix
  fi

  # Extract the title string from screenshot_data.ts
  DESCRIPTION_LINE=$(grep -A 5 "testId: '$BASENAME'" ../../../VAMobile/e2e/screenshots/screenshot_data.ts | grep "description:")

  if [[ "$DESCRIPTION_LINE" == *"["* ]]; then
    # Handle array of strings for multi-line descriptions
    TITLE=$(echo "$DESCRIPTION_LINE" | sed -e "s/.*description: \[//" -e "s/\]//" -e "s/'//g" -e 's/,\s*$/ /' -e "s/, /\n/g")
  else
    # Handle single string description
    TITLE=$(echo "$DESCRIPTION_LINE" | sed -e "s/.*description: '//" -e "s/',.*//")
  fi

  if [ -z "$TITLE" ]; then
    echo "Skipping $img, no title found."
    continue
  fi

  echo "Processing $BASENAME_WITH_DEVICE -> framed_images/${BASENAME_WITH_DEVICE}_final.png"

  # Get framed image dimensions (output from frameit)
  FRAMED_IMG_WIDTH=$(magick identify -format "%w" "$img")
  FRAMED_IMG_HEIGHT=$(magick identify -format "%h" "$img")

  # Calculate final canvas dimensions
  CANVAS_WIDTH=$((FRAMED_IMG_WIDTH + 2 * HORIZONTAL_PADDING))
  CANVAS_HEIGHT=$((FRAMED_IMG_HEIGHT + TOP_PADDING + BOTTOM_PADDING))

  # Define the text box size for word wrapping and positioning
  TEXT_BOX_WIDTH=$((CANVAS_WIDTH - 2 * TEXT_HORIZONTAL_INSET))
  TEXT_BOX_HEIGHT=$((TOP_PADDING - TEXT_AREA_PADDING))

  # Define output path
  OUTPUT_PATH="framed_images/${BASENAME_WITH_DEVICE}_final.png"

  # --- ImageMagick Command ---
  # 1. Create the background canvas.
  # 2. Composite the framed screenshot onto the background, offset from the top.
  # 3. Add the title text, centered within the top padded area and offset from the top.
  magick \
    "$BACKGROUND_IMG" -resize "${CANVAS_WIDTH}x${CANVAS_HEIGHT}!" \
    \( "$img" \) -gravity North -geometry "+0+${TOP_PADDING}" -composite \
    -font "$FONT" -pointsize "$TITLE_FONT_SIZE" -fill "$FONT_COLOR" -interline-spacing "$INTERLINE_SPACING" \
    \( -gravity Center -background none -size "${TEXT_BOX_WIDTH}x${TEXT_BOX_HEIGHT}" caption:"$TITLE" \) \
    -gravity NorthWest -geometry "+${TEXT_HORIZONTAL_INSET}+${TEXT_VERTICAL_OFFSET}" -composite \
    "$OUTPUT_PATH"
done

echo "--- Image processing complete! ---"
echo "Final images are in the 'framed_images' directory."

# Create directories for android and ios images
mkdir -p framed_images/android
mkdir -p framed_images/ios
mkdir -p framed_images/ipad

# Move android images
if ls framed_images/*_android_final.png 1> /dev/null 2>&1; then
  mv framed_images/*_android_final.png framed_images/android/
fi

# Move ios images
if ls framed_images/*_ios_final.png 1> /dev/null 2>&1; then
  mv framed_images/*_ios_final.png framed_images/ios/
fi

# Move ipad images
if ls framed_images/*_ipad_final.png 1> /dev/null 2>&1; then
  mv framed_images/*_ipad_final.png framed_images/ipad/
fi

echo "Final resizing of images"
for f in framed_images/ios/*_final.png; do
  magick "$f" -resize 1242x2208! "$f"
done

for f in framed_images/android/*_final.png; do
  magick "$f" -resize 1280x2276! "$f"
done

for f in framed_images/ipad/*_final.png; do
  magick "$f" -resize 2048x2732! "$f"
done


echo "Moving ios images to final location"
for i in framed_images/ios/*_final.png; do
  cp $i ../../../VAMobile/ios/fastlane/screenshots/en-US/
done

echo "Moving android images to final location"
for i in framed_images/android/*_final.png; do
  cp $i ../../../VAMobile/android/fastlane/metadata/android/en-US/images/phoneScreenshots/
done

echo "Moving ipad images to final location"
mkdir -p ../../../VAMobile/ios/fastlane/screenshots_ipad/en-US
for i in framed_images/ipad/*_final.png; do
  cp $i ../../../VAMobile/ios/fastlane/screenshots_ipad/en-US/
done

echo "All images processed."
