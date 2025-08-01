#!/bin/bash
set -e

# --- Pre-flight checks ---
if [ ! -d "fastlane/screenshots/en-US" ] || [ -z "$(ls -A fastlane/screenshots/en-US)" ]; then
  echo "Error: Source screenshot directory 'fastlane/screenshots/en-US' is missing or empty."
  exit 1
fi

# --- Define the mapping file ---
MAP_FILE="image_config.tsv"

# --- Pre-resize images for frameit compatibility ---
echo "Pre-resizing images for frameit compatibility..."
while IFS=$'\t' read -r original_img_name TEST_ID DEVICE_TYPE DESCRIPTION; do
  if [[ "$original_img_name" == "LettersDownload_ios" || "$original_img_name" == "LettersDownload_android" || "$original_img_name" == "LettersDownload_ipad" ]]; then
    SRC_IMG="fastlane/screenshots/en-US/${original_img_name}.png"
  else
    SRC_IMG="fastlane/screenshots/en-US/${DEVICE_TYPE}-${original_img_name}.png"
  fi

  if [ ! -f "$SRC_IMG" ]; then
      echo "Warning: Could not find image ${SRC_IMG} to resize."
      continue
  fi

  if [[ "$DEVICE_TYPE" == "ios" ]]; then
    convert "$SRC_IMG" -resize 1284x2778 -background transparent -gravity center -extent 1284x2778 "$SRC_IMG"
  elif [[ "$DEVICE_TYPE" == "ipad" ]]; then
    convert "$SRC_IMG" -resize 2048x2732 -background transparent -gravity center -extent 2048x2732 "$SRC_IMG"
  elif [[ "$DEVICE_TYPE" == "android" ]]; then
    convert "$SRC_IMG" -resize 1080x2340 -background transparent -gravity center -extent 1080x2340 "$SRC_IMG"
  fi
done < "$MAP_FILE"

# --- Frame images ---
echo "Framing images..."
fastlane frameit

# --- Stage 2: Add Background and Titles with ImageMagick ---
echo "Stage 2: Adding background and titles with ImageMagick..."

# Create output directories
mkdir -p framed_images/{ios,android,ipad}

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
TOP_PADDING=500
BOTTOM_PADDING=200

while IFS=$'\t' read -r original_img_name TEST_ID DEVICE_TYPE DESCRIPTION; do
  if [[ "$original_img_name" == "LettersDownload_ios" || "$original_img_name" == "LettersDownload_android" || "$original_img_name" == "LettersDownload_ipad" ]]; then
    source_img="fastlane/screenshots/en-US/${original_img_name}_framed.png"
  else
    source_img="fastlane/screenshots/en-US/${DEVICE_TYPE}-${original_img_name}_framed.png"
  fi

  if [ ! -f "$source_img" ]; then
    echo "Skipping $original_img_name, source image not found at '$source_img'."
    continue
  fi

  # Remove the surrounding quotes from the description and replace placeholder with newline
  TITLE=$(echo "$DESCRIPTION" | tr -d '"' | sed 's/_NEWLINE_/\n/g')

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
    ADJUSTED_TITLE_FONT_SIZE=80
  else
    ADJUSTED_TITLE_FONT_SIZE=60
  fi

  # ImageMagick Command
  echo -e "$TITLE" | magick \
    "$BACKGROUND_IMG" -resize "${CANVAS_WIDTH}x${CANVAS_HEIGHT}" \
    \( "$source_img" \) -gravity North -geometry "+0+${TOP_PADDING}" -composite \
    -font "$FONT" -pointsize "$ADJUSTED_TITLE_FONT_SIZE" -fill "$FONT_COLOR" -interline-spacing "$INTERLINE_SPACING" \
    \( -gravity Center -background none -size "${TEXT_BOX_WIDTH}x${TEXT_BOX_HEIGHT}" caption:@- \)\
    -gravity North -geometry "+0+${TEXT_VERTICAL_OFFSET}" -composite \
    "$OUTPUT_PATH"
done < "$MAP_FILE"

echo "--- Image processing complete! ---"
echo "Final images are in the 'framed_images' directory."

# --- Final Resizing and Moving ---
echo "Final resizing and moving of images"

# iOS
for f in framed_images/ios/*.png; do
  [ -f "$f" ] || continue
  magick "$f" -resize 1242x "$f"
  cp "$f" ../../../VAMobile/ios/fastlane/screenshots/en-US/
done

# Android
for f in framed_images/android/*.png; do
  [ -f "$f" ] || continue
  magick "$f" -resize 1280x "$f"
  cp "$f" ../../../VAMobile/android/fastlane/metadata/android/en-US/images/phoneScreenshots/
done

# iPad
mkdir -p ../../../VAMobile/ios/fastlane/screenshots_ipad/en-US
for f in framed_images/ipad/*.png; do
  [ -f "$f" ] || continue
  magick "$f" -resize 2048x "$f"
  cp "$f" ../../../VAMobile/ios/fastlane/screenshots_ipad/en-US/
done

echo "All images processed."