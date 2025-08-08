#!/bin/bash

# Test script to verify Android frame fitting
cd "$(dirname "$0")"

echo "Testing Android frame fitting..."

# Settings
BACKGROUND_IMG="gradient.png"
FONT="source-sans-pro.regular.ttf"
ANDROID_FRAME="fastlane/google-pixel-6-pro-medium.png"
INPUT_IMG="fastlane/screenshots/en-US/android-2_en-US.png"

# Final dimensions
FINAL_WIDTH=1280
FINAL_HEIGHT=2276

# Text settings
TEXT_AREA_PADDING=60
INPUT_Y=$((FINAL_HEIGHT * 24 / 100))  # Position device lower
TEXT_CENTER_Y=$((TEXT_AREA_PADDING + (INPUT_Y - TEXT_AREA_PADDING) / 2))

# Frame calculations
FRAME_WIDTH=$(magick identify -format "%w" "$ANDROID_FRAME")
FRAME_HEIGHT=$(magick identify -format "%h" "$ANDROID_FRAME")
TARGET_FRAME_WIDTH=$((FINAL_WIDTH * 60 / 100))
FRAME_SCALE=$(( (TARGET_FRAME_WIDTH * 1000) / FRAME_WIDTH ))
SCALED_FRAME_WIDTH=$(( (FRAME_WIDTH * FRAME_SCALE) / 1000 ))
SCALED_FRAME_HEIGHT=$(( (FRAME_HEIGHT * FRAME_SCALE) / 1000 ))

# Frame positioning
FRAME_X=$(( (FINAL_WIDTH - SCALED_FRAME_WIDTH) / 2 ))
FRAME_Y=$INPUT_Y

# Screen area (more conservative sizing)
SCREEN_AREA_WIDTH=$((SCALED_FRAME_WIDTH * 82 / 100))
SCREEN_AREA_HEIGHT=$((SCALED_FRAME_HEIGHT * 78 / 100))
SCREEN_X=$(( FRAME_X + (SCALED_FRAME_WIDTH - SCREEN_AREA_WIDTH) / 2 ))
SCREEN_Y=$(( FRAME_Y + SCALED_FRAME_HEIGHT * 12 / 100 ))

echo "Frame: ${FRAME_WIDTH}x${FRAME_HEIGHT} -> ${SCALED_FRAME_WIDTH}x${SCALED_FRAME_HEIGHT} at ${FRAME_X},${FRAME_Y}"
echo "Screen: ${SCREEN_AREA_WIDTH}x${SCREEN_AREA_HEIGHT} at ${SCREEN_X},${SCREEN_Y}"

# Create test image
magick "$BACKGROUND_IMG" -resize "${FINAL_WIDTH}x${FINAL_HEIGHT}!" \
  \( "$INPUT_IMG" -resize "${SCREEN_AREA_WIDTH}x${SCREEN_AREA_HEIGHT}!" \) \
  -geometry "+${SCREEN_X}+${SCREEN_Y}" -composite \
  \( "$ANDROID_FRAME" -resize "${SCALED_FRAME_WIDTH}x${SCALED_FRAME_HEIGHT}!" \) \
  -geometry "+${FRAME_X}+${FRAME_Y}" -composite \
  -font "$FONT" -pointsize 75 -fill white -interline-spacing -5 \
  -gravity center -annotate "+0+$((TEXT_CENTER_Y - FINAL_HEIGHT/2))" "Access health care tools" \
  "test_frame_fit.png"

echo "Test image created: test_frame_fit.png"
open test_frame_fit.png
