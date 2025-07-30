#!/bin/bash
set -e
# set -x # Uncomment for deep debugging

# --- Pre-flight checks ---
if [ ! -d "fastlane/screenshots/en-US" ] || [ -z "$(ls -A fastlane/screenshots/en-US)" ]; then
  echo "Error: Source screenshot directory 'fastlane/screenshots/en-US' is missing or empty."
  exit 1
fi

# --- Generate mapping file ---
echo "Generating image mapping..."
MAP_FILE="image_mapping.txt"

# Use the robust Node.js script to generate the mapping
node generate_mapping.js > "$MAP_FILE"

# --- Verify mapping file ---
echo "--- Generated image_mapping.txt ---"
cat "$MAP_FILE"
echo "-------------------------------------"

# --- Cleanup and setup ---
echo "Cleaning up old files..."
rm -f fastlane/screenshots/en-US/*_framed.png # Clean up previous frameit runs
rm -rf framed_images
mkdir -p framed_images/ios framed_images/android framed_images/ipad

# --- Pre-resize all screenshots to standard sizes ---
echo "Pre-resizing images for frameit compatibility..."
while IFS=$'\t' read -r original_img_name TEST_ID DEVICE_TYPE DESCRIPTION; do
  SRC_IMG="fastlane/screenshots/en-US/${original_img_name}.png"
  if [ -f "$SRC_IMG" ]; then
    if [[ "$DEVICE_TYPE" == "ios" ]]; then
      magick "$SRC_IMG" -resize 1290x2796! "$SRC_IMG"
    elif [[ "$DEVICE_TYPE" == "ipad" ]]; then
      magick "$SRC_IMG" -resize 2048x2732! "$SRC_IMG"
    elif [[ "$DEVICE_TYPE" == "android" ]]; then
      magick "$SRC_IMG" -resize 1080x2280! "$SRC_IMG"
    fi
  fi
done < "$MAP_FILE"

# --- Frame images with fastlane ---
cd fastlane
echo "Framing images with fastlane..."
fastlane frameit &> frameit.log
cd ..

# --- Stage 2: Add Background and Titles with ImageMagick ---
echo "Stage 2: Adding background and titles with ImageMagick..."

# Settings
BACKGROUND_IMG="gradient.png"
FONT="source-sans-pro.regular.ttf"
FONT_COLOR="#F1F1F1"
TITLE_FONT_SIZE=49
INTERLINE_SPACING=-5
TEXT_AREA_PADDING=40
TEXT_VERTICAL_OFFSET=30
TEXT_HORIZONTAL_INSET=20
HORIZONTAL_PADDING=120
TOP_PADDING=240
BOTTOM_PADDING=120

while IFS=$'\t' read -r original_img_name TEST_ID DEVICE_TYPE DESCRIPTION; do
  source_img="fastlane/screenshots/en-US/${original_img_name}_framed.png"

  if [ ! -f "$source_img" ]; then
    echo "Skipping $original_img_name, framed image not found at '$source_img'."
    continue
  }

  # Remove quotes from the description
  TITLE=$(echo "$DESCRIPTION" | tr -d '"')

  echo "Processing $original_img_name -> framed_images/${DEVICE_TYPE}/${original_img_name}.png"

  # Get image dimensions
  IMG_WIDTH=$(magick identify -format "%w" "$source_img")
  IMG_HEIGHT=$(magick identify -format "%h" "$source_img")

  # Calculate final canvas dimensions
  CANVAS_WIDTH=$((IMG_WIDTH + 2 * HORIZONTAL_PADDING))
  CANVAS_HEIGHT=$((IMG_HEIGHT + TOP_PADDING + BOTTOM_PADDING))

  # Define the text box size
  TEXT_BOX_WIDTH=$((CANVAS_WIDTH - 2 * TEXT_HORIZONTAL_INSET))
  TEXT_BOX_HEIGHT=$((TOP_PADDING - TEXT_AREA_PADDING))

  # Define output path
  OUTPUT_PATH="framed_images/${DEVICE_TYPE}/${original_img_name}.png"

  if [[ "$DEVICE_TYPE" == "ipad" ]]; then
    ADJUSTED_TITLE_FONT_SIZE=35
  else
    ADJUSTED_TITLE_FONT_SIZE=$TITLE_FONT_SIZE
  fi

  # ImageMagick Command
  echo -e "$TITLE" | magick \
    "$BACKGROUND_IMG" -resize "${CANVAS_WIDTH}x${CANVAS_HEIGHT}!" \
    \( "$source_img" \) -gravity North -geometry "+0+${TOP_PADDING}" -composite \
    -font "$FONT" -pointsize "$ADJUSTED_TITLE_FONT_SIZE" -fill "$FONT_COLOR" -interline-spacing "$INTERLINE_SPACING" \
    \( -gravity Center -background none -size "${TEXT_BOX_WIDTH}x${TEXT_BOX_HEIGHT}" caption:@- \) \
    -gravity NorthWest -geometry "+${TEXT_HORIZONTAL_INSET}+${TEXT_VERTICAL_OFFSET}" -composite \
    "$OUTPUT_PATH"
done < "$MAP_FILE"

echo "--- Image processing complete! ---"
echo "Final images are in the 'framed_images' directory."

# --- Final Resizing and Moving ---
echo "Final resizing and moving of images"

# iOS
for f in framed_images/ios/*.png; do
  [ -f "$f" ] || continue
  magick "$f" -resize 1242x2208! "$f"
  cp "$f" ../../../VAMobile/ios/fastlane/screenshots/en-US/
done

# Android
for f in framed_images/android/*.png; do
  [ -f "$f" ] || continue
  magick "$f" -resize 1280x2276! "$f"
  cp "$f" ../../../VAMobile/android/fastlane/metadata/android/en-US/images/phoneScreenshots/
done

# iPad
mkdir -p ../../../VAMobile/ios/fastlane/screenshots_ipad/en-US
for f in framed_images/ipad/*.png; do
  [ -f "$f" ] || continue
  magick "$f" -resize 2048x2732! "$f"
  cp "$f" ../../../VAMobile/ios/fastlane/screenshots_ipad/en-US/
done

echo "All images processed."
