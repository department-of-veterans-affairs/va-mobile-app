#!/bin/bash
set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

if [ ! -d "$SCRIPT_DIR/fastlane/screenshots/en-US" ] || [ -z "$(ls -A "$SCRIPT_DIR/fastlane/screenshots/en-US")" ]; then
  echo "Error: Source screenshot directory '$SCRIPT_DIR/fastlane/screenshots/en-US' is missing or empty."
  echo "Make sure move_screenshots.sh has been run first and found screenshots to move."
  echo "Check that either 'artifacts' or '../../../VAMobile/artifacts' contains PNG files."
  exit 1
fi

echo "Reading screenshot data from TypeScript file..."

echo "Cleaning up old files..."
rm -f "$SCRIPT_DIR/fastlane/screenshots/en-US/"*_framed.png
rm -rf "$SCRIPT_DIR/framed_images"
mkdir -p "$SCRIPT_DIR/framed_images/ios" "$SCRIPT_DIR/framed_images/android" "$SCRIPT_DIR/framed_images/ipad"

echo "Stage 1: Resizing screenshots for frameit compatibility and creating device frames..."

TEMP_FRAMEIT_DIR="$SCRIPT_DIR/temp_frameit_resized"
mkdir -p "$TEMP_FRAMEIT_DIR/screenshots/en-US"

echo "Resizing screenshots to frameit-compatible dimensions..."

while IFS=$'\t' read -r original_img_name TEST_ID DEVICE_TYPE DESCRIPTION; do
  source_img="$SCRIPT_DIR/fastlane/screenshots/en-US/${DEVICE_TYPE}-${original_img_name}.png"
  
  if [ -f "$source_img" ]; then
    if [[ "$DEVICE_TYPE" == "ios" ]]; then
      TARGET_WIDTH=1290
      TARGET_HEIGHT=2796
      target_filename="iphone67-${original_img_name}.png"
      target_path="$TEMP_FRAMEIT_DIR/screenshots/en-US/$target_filename"
      
      echo "  Resizing ${DEVICE_TYPE}-${original_img_name}.png to ${TARGET_WIDTH}x${TARGET_HEIGHT} for frameit"
      
      magick "$source_img" \
        -resize "${TARGET_WIDTH}x${TARGET_HEIGHT}^" \
        -gravity center \
        -extent "${TARGET_WIDTH}x${TARGET_HEIGHT}" \
        -background white \
        "$target_path"
        
    elif [[ "$DEVICE_TYPE" == "ipad" ]]; then
      TARGET_WIDTH=2048
      TARGET_HEIGHT=2732
      target_filename="ipadPro129-${original_img_name}.png"
      target_path="$TEMP_FRAMEIT_DIR/screenshots/en-US/$target_filename"
      
      echo "  Resizing ${DEVICE_TYPE}-${original_img_name}.png to ${TARGET_WIDTH}x${TARGET_HEIGHT} for frameit"
      
      magick "$source_img" \
        -resize "${TARGET_WIDTH}x${TARGET_HEIGHT}^" \
        -gravity center \
        -extent "${TARGET_WIDTH}x${TARGET_HEIGHT}" \
        -background white \
        "$target_path"
        
    elif [[ "$DEVICE_TYPE" == "android" ]]; then
      echo "  Skipping ${DEVICE_TYPE}-${original_img_name}.png for frameit (will use custom Android frame)"
    fi
  fi
done < <(node "$SCRIPT_DIR/generate_image_mapping.js")

echo "Running frameit on resized screenshots..."
SCREENSHOTS_DIR="$TEMP_FRAMEIT_DIR/screenshots/en-US"
echo "Processing screenshots in: $SCREENSHOTS_DIR"
echo "Available resized screenshots:"
ls -la "$SCREENSHOTS_DIR"

if command -v frameit >/dev/null 2>&1; then
  echo "Using frameit command directly..."
  frameit "$SCREENSHOTS_DIR" || echo "Frameit command failed"
elif command -v fastlane >/dev/null 2>&1; then
  echo "Using global fastlane frameit..."
  fastlane run frameit path:"$(realpath "$SCREENSHOTS_DIR")" || echo "Global fastlane frameit failed"
elif [ -x "$SCRIPT_DIR/../../../VAMobile/ios/vendor/bundle/ruby/3.3.0/bin/fastlane" ]; then
  echo "Using bundle exec fastlane from VAMobile/ios..."
  (cd "$SCRIPT_DIR/../../../VAMobile/ios" && bundle exec fastlane run frameit path:"$SCREENSHOTS_DIR") || echo "Bundle exec frameit failed"
else
  echo "WARNING: Neither frameit command nor bundle exec fastlane found, skipping frameit processing"
fi

echo "Checking frameit results:"
echo "  Looking for *_framed.png files:"
framed_count=$(ls -1 "$SCREENSHOTS_DIR"/*_framed.png 2>/dev/null | wc -l)
if [ $framed_count -gt 0 ]; then
  echo "  ✓ Successfully created $framed_count framed images"
  ls -la "$SCREENSHOTS_DIR"/*_framed.png
  
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
  done < <(node "$SCRIPT_DIR/generate_image_mapping.js")
else
  echo "  WARNING: No framed images were created by frameit!"
fi

rm -rf "$TEMP_FRAMEIT_DIR"

echo "Stage 2: Adding background and titles with ImageMagick..."

BACKGROUND_IMG="$SCRIPT_DIR/gradient.png"
FONT="$SCRIPT_DIR/source-sans-pro.regular.ttf"
FONT_COLOR="white"
TITLE_FONT_SIZE=80
INTERLINE_SPACING=-5
TEXT_AREA_PADDING=60
TEXT_HORIZONTAL_INSET=40
HORIZONTAL_PADDING=0
TOP_PADDING=150
BOTTOM_PADDING=0

while IFS=$'\t' read -r original_img_name TEST_ID DEVICE_TYPE DESCRIPTION; do
  framed_img="$SCRIPT_DIR/fastlane/screenshots/en-US/${DEVICE_TYPE}-${original_img_name}_framed.png"
  source_img="$SCRIPT_DIR/fastlane/screenshots/en-US/${DEVICE_TYPE}-${original_img_name}.png"
  
  echo "Processing ${DEVICE_TYPE}-${original_img_name}:"
  echo "  Framed image: $framed_img $([ -f "$framed_img" ] && echo "(EXISTS)" || echo "(NOT FOUND)")"
  echo "  Source image: $source_img $([ -f "$source_img" ] && echo "(EXISTS)" || echo "(NOT FOUND)")"
  
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

  TITLE=$(echo "$DESCRIPTION" | tr -d '"' | sed 's/_NEWLINE_/\n/g')

  INPUT_WIDTH=$(magick identify -format "%w" "$input_img")
  INPUT_HEIGHT=$(magick identify -format "%h" "$input_img")

  if [[ "$DEVICE_TYPE" == "ios" ]]; then
    FINAL_WIDTH=1242
    FINAL_HEIGHT=2208
    ADJUSTED_TITLE_FONT_SIZE=$TITLE_FONT_SIZE
  elif [[ "$DEVICE_TYPE" == "ipad" ]]; then
    FINAL_WIDTH=2048
    FINAL_HEIGHT=2732
    ADJUSTED_TITLE_FONT_SIZE=105
  elif [[ "$DEVICE_TYPE" == "android" ]]; then
    FINAL_WIDTH=1280
    FINAL_HEIGHT=2276
    ADJUSTED_TITLE_FONT_SIZE=90
  fi

  
  MAX_INPUT_HEIGHT=$((FINAL_HEIGHT * 70 / 100))
  
  SCALE_X=$(( (FINAL_WIDTH * 1000) / INPUT_WIDTH ))
  SCALE_Y=$(( (MAX_INPUT_HEIGHT * 1000) / INPUT_HEIGHT ))
  
  if [ $SCALE_X -lt $SCALE_Y ]; then
    SCALE=$SCALE_X
  else
    SCALE=$SCALE_Y
  fi
  
  NEW_INPUT_WIDTH=$(( (INPUT_WIDTH * SCALE) / 1000 ))
  NEW_INPUT_HEIGHT=$(( (INPUT_HEIGHT * SCALE) / 1000 ))
  
  INPUT_X=$(( (FINAL_WIDTH - NEW_INPUT_WIDTH) / 2 ))
  INPUT_Y=$(( (FINAL_HEIGHT - NEW_INPUT_HEIGHT) * 73 / 100 ))
  
  TEXT_AREA_HEIGHT=$((INPUT_Y - TEXT_AREA_PADDING))
  TEXT_CENTER_Y=$((TEXT_AREA_PADDING + TEXT_AREA_HEIGHT / 2))

  OUTPUT_PATH="$SCRIPT_DIR/framed_images/${DEVICE_TYPE}/${original_img_name}.png"  echo "  Creating ${FINAL_WIDTH}x${FINAL_HEIGHT} image with background and title text"
  
  if [ "$needs_custom_android_frame" = true ]; then
    ANDROID_FRAME="$SCRIPT_DIR/fastlane/google-pixel-6-pro-medium.png"
    
    echo "    Using provided Android device frame: $(basename "$ANDROID_FRAME")"
    
    FRAME_WIDTH=$(magick identify -format "%w" "$ANDROID_FRAME")
    FRAME_HEIGHT=$(magick identify -format "%h" "$ANDROID_FRAME")
    
    TARGET_FRAME_WIDTH=$((FINAL_WIDTH * 60 / 100))
    FRAME_SCALE=$(( (TARGET_FRAME_WIDTH * 1000) / FRAME_WIDTH ))
    SCALED_FRAME_WIDTH=$(( (FRAME_WIDTH * FRAME_SCALE) / 1000 ))
    SCALED_FRAME_HEIGHT=$(( (FRAME_HEIGHT * FRAME_SCALE) / 1000 ))
    
    FRAME_X=$(( (FINAL_WIDTH - SCALED_FRAME_WIDTH) / 2 ))
    FRAME_Y=$(( INPUT_Y ))
    
    SCREEN_AREA_WIDTH=$((SCALED_FRAME_WIDTH * 95 / 100))
    SCREEN_AREA_HEIGHT=$((SCALED_FRAME_HEIGHT * 96 / 100))
    
    SCREEN_X=$(( FRAME_X + (SCALED_FRAME_WIDTH - SCREEN_AREA_WIDTH) / 2 ))
    SCREEN_Y=$(( FRAME_Y + SCALED_FRAME_HEIGHT * 20 / 1000 ))
    
    magick "$BACKGROUND_IMG" -resize "${FINAL_WIDTH}x${FINAL_HEIGHT}!" \
      \( "$input_img" -resize "${SCREEN_AREA_WIDTH}x${SCREEN_AREA_HEIGHT}!" \) \
      -geometry "+${SCREEN_X}+${SCREEN_Y}" -composite \
      \( "$ANDROID_FRAME" -resize "${SCALED_FRAME_WIDTH}x${SCALED_FRAME_HEIGHT}!" \) \
      -geometry "+${FRAME_X}+${FRAME_Y}" -composite \
      -font "$FONT" -pointsize "$ADJUSTED_TITLE_FONT_SIZE" -fill "$FONT_COLOR" -interline-spacing "$INTERLINE_SPACING" \
      -gravity center -annotate "+0+$((TEXT_CENTER_Y - FINAL_HEIGHT/2))" "$TITLE" \
      "$OUTPUT_PATH"
  else
    magick "$BACKGROUND_IMG" -resize "${FINAL_WIDTH}x${FINAL_HEIGHT}!" \
      \( "$input_img" -resize "${NEW_INPUT_WIDTH}x${NEW_INPUT_HEIGHT}!" \) \
      -geometry "+${INPUT_X}+${INPUT_Y}" -composite \
      -font "$FONT" -pointsize "$ADJUSTED_TITLE_FONT_SIZE" -fill "$FONT_COLOR" -interline-spacing "$INTERLINE_SPACING" \
      -gravity center -annotate "+0+$((TEXT_CENTER_Y - FINAL_HEIGHT/2))" "$TITLE" \
      "$OUTPUT_PATH"
  fi
done < <(node "$SCRIPT_DIR/generate_image_mapping.js")

echo "--- Image processing complete! ---"
echo "Final images are in the '$SCRIPT_DIR/framed_images' directory."

echo "Moving final images to fastlane directories"

mkdir -p "$SCRIPT_DIR/../../../VAMobile/ios/fastlane/screenshots/en-US"
for f in "$SCRIPT_DIR/framed_images/ios/"*.png; do
  if [ ! -f "$f" ]; then continue; fi
  echo "Moving iOS image: $(basename "$f")"
  cp "$f" "$SCRIPT_DIR/../../../VAMobile/ios/fastlane/screenshots/en-US/"
done

mkdir -p "$SCRIPT_DIR/../../../VAMobile/android/fastlane/metadata/android/en-US/images/phoneScreenshots"
for f in "$SCRIPT_DIR/framed_images/android/"*.png; do
  if [ ! -f "$f" ]; then continue; fi
  echo "Moving Android image: $(basename "$f")"
  cp "$f" "$SCRIPT_DIR/../../../VAMobile/android/fastlane/metadata/android/en-US/images/phoneScreenshots/"
done

mkdir -p "$SCRIPT_DIR/../../../VAMobile/ios/fastlane/screenshots_ipad/en-US"
for f in "$SCRIPT_DIR/framed_images/ipad/"*.png; do
  if [ ! -f "$f" ]; then continue; fi
  echo "Moving iPad image: $(basename "$f")"
  cp "$f" "$SCRIPT_DIR/../../../VAMobile/ios/fastlane/screenshots_ipad/en-US/"
done

echo "All images processed."
