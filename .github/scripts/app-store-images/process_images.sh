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
mkdir -p fastlane/screenshots/en-US/ios_framed
mkdir -p fastlane/screenshots/en-US/android_framed
mkdir -p framed_images

# Move screenshots to their respective temporary original directories
for img in fastlane/screenshots/en-US/*.png; do
  BASENAME=$(basename "$img" .png)
  if [[ "$BASENAME" == *_ios ]]; then
    mv "$img" fastlane/screenshots/en-US/ios_original/
  elif [[ "$BASENAME" == *_android ]]; then
    mv "$img" fastlane/screenshots/en-US/android_original/
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
  fastlane frameit
  rm fastlane/Framefile.json

  # Move framed iOS images to their dedicated framed directory
  if ! ls fastlane/screenshots/en-US/*_framed.png 1> /dev/null 2>&1; then
    echo "Error: frameit failed to create iOS images. Check frameit_ios.log for details."
    exit 1
  fi
  mv fastlane/screenshots/en-US/*_framed.png fastlane/screenshots/en-US/ios_framed/
  rm fastlane/screenshots/en-US/*_ios.png
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

  # Run frameit once for all Android images
  echo "Adding Android frames with frameit"
  fastlane frameit android
  rm fastlane/Framefile.json

  # Verify that framed images were created
  if ! ls fastlane/screenshots/en-US/*_framed.png 1> /dev/null 2>&1; then
    echo "Error: frameit failed to create Android images."
    exit 1
  fi
  
  # Move framed images to the dedicated directory
  mv fastlane/screenshots/en-US/*_framed.png fastlane/screenshots/en-US/android_framed/
  rm fastlane/screenshots/en-US/*_android.png
fi

# Consolidate all framed images back into the main fastlane/screenshots/en-US/ directory
if [ -n "$(ls -A fastlane/screenshots/en-US/ios_framed/)" ]; then
  mv fastlane/screenshots/en-US/ios_framed/* fastlane/screenshots/en-US/
fi
if [ -n "$(ls -A fastlane/screenshots/en-US/android_framed/)" ]; then
  mv fastlane/screenshots/en-US/android_framed/* fastlane/screenshots/en-US/
fi

# Clean up temporary directories
rm -rf fastlane/screenshots/en-US/ios_original
rm -rf fastlane/screenshots/en-US/android_original
rm -rf fastlane/screenshots/en-US/ios_framed
rm -rf fastlane/screenshots/en-US/android_framed

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
    fi
  done
fi

# --- Stage 2: Add Background and Titles with ImageMagick ---
echo "Stage 2: Adding background and titles with ImageMagick..."

# Settings
BACKGROUND_IMG="gradient.png"
FONT="source-sans-pro.regular.ttf"
FONT_COLOR="#F1F1F1"
# Font sizes for normal and long titles
TITLE_FONT_SIZE=70
LONG_TITLE_FONT_SIZE=50 # Reduced from 55
SMALLER_SPECIFIC_FONT_SIZE=60 # New font size for specific images
LONG_TITLE_THRESHOLD=25 # Characters
INTERLINE_SPACING=10
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
  else
    BASENAME="$BASENAME_WITH_DEVICE" # Fallback if no device suffix
  fi

  # Extract the title string from screenshot_data.ts
  TITLE=$(grep -A 3 "testId: '$BASENAME'" ../../../VAMobile/e2e/screenshots/screenshot_data.ts | grep "description:" | sed "s/.*description: '//;s/',.*//")

  if [ -z "$TITLE" ]; then
    echo "Skipping $img, no title found."
    continue
  fi

  echo "Processing $BASENAME_WITH_DEVICE -> framed_images/${BASENAME_WITH_DEVICE}_final.png"

  # Determine which font size to use based on title length
  if [ ${#TITLE} -gt $LONG_TITLE_THRESHOLD ]; then
    CURRENT_FONT_SIZE=$LONG_TITLE_FONT_SIZE
  else
    CURRENT_FONT_SIZE=$TITLE_FONT_SIZE
  fi

  # Apply specific font size for BenefitsScreen and HealthScreen
  if [[ "$BASENAME" == "BenefitsScreen" || "$BASENAME" == "HealthScreen" ]]; then
    CURRENT_FONT_SIZE=$SMALLER_SPECIFIC_FONT_SIZE
  fi

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
    -font "$FONT" -pointsize "$CURRENT_FONT_SIZE" -fill "$FONT_COLOR" -interline-spacing "$INTERLINE_SPACING" \
    \( -gravity Center -background none -size "${TEXT_BOX_WIDTH}x${TEXT_BOX_HEIGHT}" caption:"$TITLE" \) \
    -gravity NorthWest -geometry "+${TEXT_HORIZONTAL_INSET}+${TEXT_VERTICAL_OFFSET}" -composite \
    "$OUTPUT_PATH"
done

# --- Final Cleanup ---
rm -f Gemfile Gemfile.lock # Clean up any lingering fastlane files

echo "--- Image processing complete! ---"
echo "Final images are in the 'framed_images' directory."

ls -l framed_images/
