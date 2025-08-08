#!/bin/bash
# Test script to process a single image without running the full screenshot pipeline

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo "Testing image processing improvements..."

# Create test directories
mkdir -p "$SCRIPT_DIR/test_output/ios"
mkdir -p "$SCRIPT_DIR/test_output/android" 
mkdir -p "$SCRIPT_DIR/test_output/ipad"

# Settings (same as in process_images.sh)
BACKGROUND_IMG="$SCRIPT_DIR/gradient.png"
FONT="$SCRIPT_DIR/source-sans-pro.regular.ttf"
FONT_COLOR="white"
TITLE_FONT_SIZE=85
TEXT_AREA_PADDING=50
TEXT_VERTICAL_OFFSET=40
TEXT_HORIZONTAL_INSET=30
HORIZONTAL_PADDING=120
TOP_PADDING=280
BOTTOM_PADDING=120

# Test with a sample image if available
if [ -d "$SCRIPT_DIR/fastlane/screenshots/en-US" ]; then
  TEST_IMAGE=$(find "$SCRIPT_DIR/fastlane/screenshots/en-US" -name "*.png" | head -1)
  if [ -n "$TEST_IMAGE" ]; then
    echo "Testing with image: $TEST_IMAGE"
    
    # Extract info from filename
    BASENAME=$(basename "$TEST_IMAGE" .png)
    
    # Test iOS processing
    if [[ "$BASENAME" == *"ios-"* ]]; then
      DEVICE_TYPE="ios"
      ADJUSTED_TITLE_FONT_SIZE=$TITLE_FONT_SIZE
    elif [[ "$BASENAME" == *"android-"* ]]; then
      DEVICE_TYPE="android" 
      ADJUSTED_TITLE_FONT_SIZE=75
    elif [[ "$BASENAME" == *"ipad-"* ]]; then
      DEVICE_TYPE="ipad"
      ADJUSTED_TITLE_FONT_SIZE=120
    else
      DEVICE_TYPE="ios"
      ADJUSTED_TITLE_FONT_SIZE=$TITLE_FONT_SIZE
    fi
    
    # Get image dimensions
    IMG_WIDTH=$(magick identify -format "%w" "$TEST_IMAGE")
    IMG_HEIGHT=$(magick identify -format "%h" "$TEST_IMAGE")
    
    # Calculate canvas dimensions
    CANVAS_WIDTH=$((IMG_WIDTH + 2 * HORIZONTAL_PADDING))
    CANVAS_HEIGHT=$((IMG_HEIGHT + TOP_PADDING + BOTTOM_PADDING))
    
    TEXT_BOX_WIDTH=$((CANVAS_WIDTH - 2 * TEXT_HORIZONTAL_INSET))
    TEXT_BOX_HEIGHT=$((TOP_PADDING - TEXT_AREA_PADDING))
    
    # Test title
    TITLE="Test VA Mobile App Screenshot"
    
    OUTPUT_PATH="$SCRIPT_DIR/test_output/${DEVICE_TYPE}/test_${BASENAME}.png"
    
    echo "Processing test image..."
    echo "  Device: $DEVICE_TYPE"
    echo "  Canvas: ${CANVAS_WIDTH}x${CANVAS_HEIGHT}"
    echo "  Font size: $ADJUSTED_TITLE_FONT_SIZE"
    
    # Process the image
    magick "$BACKGROUND_IMG" -resize "${CANVAS_WIDTH}x${CANVAS_HEIGHT}!" \
      "$TEST_IMAGE" -gravity North -geometry "+0+${TOP_PADDING}" -composite \
      -font "$FONT" -pointsize "$ADJUSTED_TITLE_FONT_SIZE" -fill "$FONT_COLOR" \
      -size "${TEXT_BOX_WIDTH}x${TEXT_BOX_HEIGHT}" caption:"$TITLE" \
      -gravity North -geometry "+0+${TEXT_VERTICAL_OFFSET}" -composite \
      "$OUTPUT_PATH"
      
    echo "Test image created: $OUTPUT_PATH"
    echo "Open the test_output directory to review the results"
  else
    echo "No test images found in fastlane/screenshots/en-US"
    echo "Run the screenshot generation first, or place test images in that directory"
  fi
else
  echo "Screenshots directory not found. Run the full generate_images.sh script first."
fi

echo "Test processing complete!"
