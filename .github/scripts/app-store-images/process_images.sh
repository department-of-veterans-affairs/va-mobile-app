#!/bin/bash
set -e

# Get the absolute path of the directory where this script is located
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# --- Pre-flight checks ---
if [ ! -d "$SCRIPT_DIR/fastlane/screenshots/en-US" ] || [ -z "$(ls -A "$SCRIPT_DIR/fastlane/screenshots/en-US")" ]; then
  echo "Error: Source screenshot directory '$SCRIPT_DIR/fastlane/screenshots/en-US' is missing or empty."
  exit 1
fi

# --- Generate mapping file ---
echo "Generating image mapping..."
MAP_FILE="$SCRIPT_DIR/image_mapping.txt"

# Use the robust Node.js script to generate the mapping
node "$SCRIPT_DIR/generate_image_mapping.js" > "$MAP_FILE"

# --- Verify mapping file ---
echo "--- Generated image_mapping.txt ---"
cat "$MAP_FILE"
echo "-------------------------------------"

# --- Cleanup and setup ---
echo "Cleaning up old files..."
rm -f "$SCRIPT_DIR/fastlane/screenshots/en-US/"*_framed.png # Clean up previous frameit runs
rm -rf "$SCRIPT_DIR/framed_images"
mkdir -p "$SCRIPT_DIR/framed_images/ios" "$SCRIPT_DIR/framed_images/android" "$SCRIPT_DIR/framed_images/ipad"

# --- Stage 1: Resize screenshots to frameit-compatible dimensions and create device frames ---
echo "Stage 1: Resizing screenshots for frameit compatibility and creating device frames..."

# Create temp directory for frameit processing with properly sized images
TEMP_FRAMEIT_DIR="$SCRIPT_DIR/temp_frameit_resized"
mkdir -p "$TEMP_FRAMEIT_DIR/screenshots/en-US"

echo "Resizing screenshots to frameit-compatible dimensions..."

# Resize images to standard device dimensions that frameit supports
while IFS=$'\t' read -r original_img_name TEST_ID DEVICE_TYPE DESCRIPTION; do
  source_img="$SCRIPT_DIR/fastlane/screenshots/en-US/${DEVICE_TYPE}-${original_img_name}.png"
  
  if [ -f "$source_img" ]; then
    # Set target dimensions based on device type for frameit compatibility
    if [[ "$DEVICE_TYPE" == "ios" ]]; then
      # iPhone 6.7" (iPhone 14 Pro Max) dimensions
      TARGET_WIDTH=1290
      TARGET_HEIGHT=2796
      target_filename="iphone67-${original_img_name}.png"
      target_path="$TEMP_FRAMEIT_DIR/screenshots/en-US/$target_filename"
      
      echo "  Resizing ${DEVICE_TYPE}-${original_img_name}.png to ${TARGET_WIDTH}x${TARGET_HEIGHT} for frameit"
      
      # Resize with aspect ratio preservation and padding to exact dimensions
      magick "$source_img" \
        -resize "${TARGET_WIDTH}x${TARGET_HEIGHT}^" \
        -gravity center \
        -extent "${TARGET_WIDTH}x${TARGET_HEIGHT}" \
        -background white \
        "$target_path"
        
    elif [[ "$DEVICE_TYPE" == "ipad" ]]; then
      # iPad Pro 12.9" dimensions
      TARGET_WIDTH=2048
      TARGET_HEIGHT=2732
      target_filename="ipadPro129-${original_img_name}.png"
      target_path="$TEMP_FRAMEIT_DIR/screenshots/en-US/$target_filename"
      
      echo "  Resizing ${DEVICE_TYPE}-${original_img_name}.png to ${TARGET_WIDTH}x${TARGET_HEIGHT} for frameit"
      
      # Resize with aspect ratio preservation and padding to exact dimensions
      magick "$source_img" \
        -resize "${TARGET_WIDTH}x${TARGET_HEIGHT}^" \
        -gravity center \
        -extent "${TARGET_WIDTH}x${TARGET_HEIGHT}" \
        -background white \
        "$target_path"
        
    elif [[ "$DEVICE_TYPE" == "android" ]]; then
      # Skip Android for frameit - we'll handle it separately with custom frames
      echo "  Skipping ${DEVICE_TYPE}-${original_img_name}.png for frameit (will use custom Android frame)"
    fi
  fi
done < "$MAP_FILE"

# Run frameit on the properly sized images
echo "Running frameit on resized screenshots..."
SCREENSHOTS_DIR="$TEMP_FRAMEIT_DIR/screenshots/en-US"
echo "Processing screenshots in: $SCREENSHOTS_DIR"
echo "Available resized screenshots:"
ls -la "$SCREENSHOTS_DIR"

# Check if frameit is available in PATH
if command -v frameit >/dev/null 2>&1; then
  echo "Using frameit command directly..."
  frameit "$SCREENSHOTS_DIR" || echo "Frameit command failed"
elif [ -x "$SCRIPT_DIR/../../../VAMobile/ios/vendor/bundle/ruby/3.3.0/bin/fastlane" ]; then
  echo "Using bundle exec fastlane from VAMobile/ios..."
  (cd "$SCRIPT_DIR/../../../VAMobile/ios" && bundle exec fastlane run frameit path:"$SCREENSHOTS_DIR") || echo "Bundle exec frameit failed"
else
  echo "WARNING: Neither frameit command nor bundle exec fastlane found, skipping frameit processing"
fi

# Check what frameit produced
echo "Checking frameit results:"
echo "  Looking for *_framed.png files:"
framed_count=$(ls -1 "$SCREENSHOTS_DIR"/*_framed.png 2>/dev/null | wc -l)
if [ $framed_count -gt 0 ]; then
  echo "  ✓ Successfully created $framed_count framed images"
  ls -la "$SCREENSHOTS_DIR"/*_framed.png
  
  # Copy framed images back to working directory with original naming (iOS and iPad only)
  while IFS=$'\t' read -r original_img_name TEST_ID DEVICE_TYPE DESCRIPTION; do
    if [[ "$DEVICE_TYPE" == "ios" ]]; then
      framed_file="$SCREENSHOTS_DIR/iphone67-${original_img_name}_framed.png"
      if [ -f "$framed_file" ]; then
        cp "$framed_file" "$SCRIPT_DIR/fastlane/screenshots/en-US/${DEVICE_TYPE}-${original_img_name}_framed.png"
        echo "  Copied framed image for ${DEVICE_TYPE}-${original_img_name}"
      fi
    elif [[ "$DEVICE_TYPE" == "ipad" ]]; then
      framed_file="$SCREENSHOTS_DIR/ipadPro129-${original_img_name}_framed.png"
      if [ -f "$framed_file" ]; then
        cp "$framed_file" "$SCRIPT_DIR/fastlane/screenshots/en-US/${DEVICE_TYPE}-${original_img_name}_framed.png"
        echo "  Copied framed image for ${DEVICE_TYPE}-${original_img_name}"
      fi
    # Skip Android - no frameit processing
    fi
  done < "$MAP_FILE"
else
  echo "  WARNING: No framed images were created by frameit!"
fi

# Clean up temp directory
rm -rf "$TEMP_FRAMEIT_DIR"

# --- Stage 2: Add Background and Titles with ImageMagick ---
echo "Stage 2: Adding background and titles with ImageMagick..."

# Settings
BACKGROUND_IMG="$SCRIPT_DIR/gradient.png"
FONT="$SCRIPT_DIR/source-sans-pro.regular.ttf"
FONT_COLOR="white"
TITLE_FONT_SIZE=80  # Increased from 70 to 80 (about 15% bigger)
INTERLINE_SPACING=-5
TEXT_AREA_PADDING=60
TEXT_HORIZONTAL_INSET=40
HORIZONTAL_PADDING=0
TOP_PADDING=150
BOTTOM_PADDING=0

while IFS=$'\t' read -r original_img_name TEST_ID DEVICE_TYPE DESCRIPTION; do
  # Check for frameit output first
  framed_img="$SCRIPT_DIR/fastlane/screenshots/en-US/${DEVICE_TYPE}-${original_img_name}_framed.png"
  source_img="$SCRIPT_DIR/fastlane/screenshots/en-US/${DEVICE_TYPE}-${original_img_name}.png"
  
  echo "Processing ${DEVICE_TYPE}-${original_img_name}:"
  echo "  Framed image: $framed_img $([ -f "$framed_img" ] && echo "(EXISTS)" || echo "(NOT FOUND)")"
  echo "  Source image: $source_img $([ -f "$source_img" ] && echo "(EXISTS)" || echo "(NOT FOUND)")"
  
  # Determine which image to use - prefer frameit output for iOS/iPad, use source for Android
  if [ -f "$framed_img" ]; then
    input_img="$framed_img"
    needs_custom_android_frame=false
    echo "  ✓ Using frameit image: $input_img"
  elif [ -f "$source_img" ]; then
    input_img="$source_img"
    if [[ "$DEVICE_TYPE" == "android" ]]; then
      needs_custom_android_frame=true
      echo "  ✓ Using source image with custom Android frame: $input_img"
    else
      needs_custom_android_frame=false
      echo "  ⚠ Using source image (no frameit frame available): $input_img"
    fi
  else
    echo "❌ Warning: Could not find any image for ${DEVICE_TYPE}-${original_img_name}. Skipping."
    continue
  fi

  # Remove quotes from the description and replace _NEWLINE_ with actual newlines
  TITLE=$(echo "$DESCRIPTION" | tr -d '"' | sed 's/_NEWLINE_/\n/g')

  # Get input image dimensions
  INPUT_WIDTH=$(magick identify -format "%w" "$input_img")
  INPUT_HEIGHT=$(magick identify -format "%h" "$input_img")

  # Set final output dimensions and font sizes based on device type
  if [[ "$DEVICE_TYPE" == "ios" ]]; then
    FINAL_WIDTH=1242
    FINAL_HEIGHT=2208
    ADJUSTED_TITLE_FONT_SIZE=$TITLE_FONT_SIZE  # 80px
  elif [[ "$DEVICE_TYPE" == "ipad" ]]; then
    FINAL_WIDTH=2048
    FINAL_HEIGHT=2732
    ADJUSTED_TITLE_FONT_SIZE=127  # Increased from 110 to 127 (about 15% bigger)
  elif [[ "$DEVICE_TYPE" == "android" ]]; then
    FINAL_WIDTH=1280
    FINAL_HEIGHT=2276
    ADJUSTED_TITLE_FONT_SIZE=90   # Increased to 90px for more noticeable size increase
  fi

  # Calculate scaling to fit input image in final dimensions with space for text
  # Leave space at top for text by scaling down input image
  MAX_INPUT_HEIGHT=$((FINAL_HEIGHT * 70 / 100))  # Use 70% of height for input image
  
  # Calculate scale factors using integer math (multiply by 1000 for precision)
  SCALE_X=$(( (FINAL_WIDTH * 1000) / INPUT_WIDTH ))
  SCALE_Y=$(( (MAX_INPUT_HEIGHT * 1000) / INPUT_HEIGHT ))
  
  # Use the smaller scale to maintain aspect ratio
  if [ $SCALE_X -lt $SCALE_Y ]; then
    SCALE=$SCALE_X
  else
    SCALE=$SCALE_Y
  fi
  
  # Calculate new input image dimensions
  NEW_INPUT_WIDTH=$(( (INPUT_WIDTH * SCALE) / 1000 ))
  NEW_INPUT_HEIGHT=$(( (INPUT_HEIGHT * SCALE) / 1000 ))
  
  # Position input image higher to create more blue gradient space at bottom
  INPUT_X=$(( (FINAL_WIDTH - NEW_INPUT_WIDTH) / 2 ))
  INPUT_Y=$(( (FINAL_HEIGHT - NEW_INPUT_HEIGHT) * 73 / 100 ))  # Move up 7% to add more blue at bottom
  
  # Calculate text positioning in top space
  TEXT_AREA_HEIGHT=$((INPUT_Y - TEXT_AREA_PADDING))
  TEXT_CENTER_Y=$((TEXT_AREA_PADDING + TEXT_AREA_HEIGHT / 2))

  # Define output path
  OUTPUT_PATH="$SCRIPT_DIR/framed_images/${DEVICE_TYPE}/${original_img_name}.png"

  echo "  Creating ${FINAL_WIDTH}x${FINAL_HEIGHT} image with background and title text"
  
  if [ "$needs_custom_android_frame" = true ]; then
    # Use provided Android frame
    ANDROID_FRAME="$SCRIPT_DIR/fastlane/google-pixel-6-pro-medium.png"
    
    echo "    Using provided Android device frame: $(basename "$ANDROID_FRAME")"
    
    # Get frame dimensions
    FRAME_WIDTH=$(magick identify -format "%w" "$ANDROID_FRAME")
    FRAME_HEIGHT=$(magick identify -format "%h" "$ANDROID_FRAME")
    
    # Scale the frame to fit properly in the final image dimensions
    # Target frame should be about 60% of the final image width
    TARGET_FRAME_WIDTH=$((FINAL_WIDTH * 60 / 100))
    FRAME_SCALE=$(( (TARGET_FRAME_WIDTH * 1000) / FRAME_WIDTH ))
    SCALED_FRAME_WIDTH=$(( (FRAME_WIDTH * FRAME_SCALE) / 1000 ))
    SCALED_FRAME_HEIGHT=$(( (FRAME_HEIGHT * FRAME_SCALE) / 1000 ))
    
    # Position the scaled frame
    FRAME_X=$(( (FINAL_WIDTH - SCALED_FRAME_WIDTH) / 2 ))
    FRAME_Y=$(( INPUT_Y ))
    
    # The screenshot needs to be positioned to fit within the frame's screen area
    # Size to fill the entire device frame screen area
    SCREEN_AREA_WIDTH=$((SCALED_FRAME_WIDTH * 95 / 100))
    SCREEN_AREA_HEIGHT=$((SCALED_FRAME_HEIGHT * 96 / 100))
    
    # Position screenshot to fill the frame screen area
    SCREEN_X=$(( FRAME_X + (SCALED_FRAME_WIDTH - SCREEN_AREA_WIDTH) / 2 ))
    SCREEN_Y=$(( FRAME_Y + SCALED_FRAME_HEIGHT * 20 / 1000 ))
    
    # Create Android device with provided frame
    magick "$BACKGROUND_IMG" -resize "${FINAL_WIDTH}x${FINAL_HEIGHT}!" \
      \( "$input_img" -resize "${SCREEN_AREA_WIDTH}x${SCREEN_AREA_HEIGHT}!" \) \
      -geometry "+${SCREEN_X}+${SCREEN_Y}" -composite \
      \( "$ANDROID_FRAME" -resize "${SCALED_FRAME_WIDTH}x${SCALED_FRAME_HEIGHT}!" \) \
      -geometry "+${FRAME_X}+${FRAME_Y}" -composite \
      -font "$FONT" -pointsize "$ADJUSTED_TITLE_FONT_SIZE" -fill "$FONT_COLOR" -interline-spacing "$INTERLINE_SPACING" \
      -gravity center -annotate "+0+$((TEXT_CENTER_Y - FINAL_HEIGHT/2))" "$TITLE" \
      "$OUTPUT_PATH"
  else
    # Use frameit frame or simple composition for iOS/iPad
    magick "$BACKGROUND_IMG" -resize "${FINAL_WIDTH}x${FINAL_HEIGHT}!" \
      \( "$input_img" -resize "${NEW_INPUT_WIDTH}x${NEW_INPUT_HEIGHT}!" \) \
      -geometry "+${INPUT_X}+${INPUT_Y}" -composite \
      -font "$FONT" -pointsize "$ADJUSTED_TITLE_FONT_SIZE" -fill "$FONT_COLOR" -interline-spacing "$INTERLINE_SPACING" \
      -gravity center -annotate "+0+$((TEXT_CENTER_Y - FINAL_HEIGHT/2))" "$TITLE" \
      "$OUTPUT_PATH"
  fi
done < "$MAP_FILE"

echo "--- Image processing complete! ---"
echo "Final images are in the '$SCRIPT_DIR/framed_images' directory."

# --- Final Moving (no resizing needed as we're already at final dimensions) ---
echo "Moving final images to fastlane directories"

# iOS
mkdir -p "$SCRIPT_DIR/../../../VAMobile/ios/fastlane/screenshots/en-US"
for f in "$SCRIPT_DIR/framed_images/ios/"*.png; do
  if [ ! -f "$f" ]; then continue; fi
  echo "Moving iOS image: $(basename "$f")"
  cp "$f" "$SCRIPT_DIR/../../../VAMobile/ios/fastlane/screenshots/en-US/"
done

# Android
mkdir -p "$SCRIPT_DIR/../../../VAMobile/android/fastlane/metadata/android/en-US/images/phoneScreenshots"
for f in "$SCRIPT_DIR/framed_images/android/"*.png; do
  if [ ! -f "$f" ]; then continue; fi
  echo "Moving Android image: $(basename "$f")"
  cp "$f" "$SCRIPT_DIR/../../../VAMobile/android/fastlane/metadata/android/en-US/images/phoneScreenshots/"
done

# iPad
mkdir -p "$SCRIPT_DIR/../../../VAMobile/ios/fastlane/screenshots_ipad/en-US"
for f in "$SCRIPT_DIR/framed_images/ipad/"*.png; do
  if [ ! -f "$f" ]; then continue; fi
  echo "Moving iPad image: $(basename "$f")"
  cp "$f" "$SCRIPT_DIR/../../../VAMobile/ios/fastlane/screenshots_ipad/en-US/"
done

echo "All images processed."