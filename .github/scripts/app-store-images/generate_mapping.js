const fs = require("fs");

// This script reads screenshot_data.ts and generates a clean, tab-separated data file.

const content = fs.readFileSync(
  "../../../VAMobile/e2e/screenshots/screenshot_data.ts",
  "utf8",
);

// A simple but effective state machine to parse the data structure
let inObject = false;
let currentTestId = null;
let currentImages = {};
let currentDescription = "";

const lines = content.split("\n");

for (const line of lines) {
  if (line.trim().startsWith("{")) {
    inObject = true;
    currentTestId = null;
    currentImages = {};
    currentDescription = "";
  }

  if (inObject) {
    const testIdMatch = line.match(/testId:\s*'([^']*)'/);
    if (testIdMatch) {
      currentTestId = testIdMatch[1];
    }

    const imageMatch = line.match(/(ios|android|ipad):\s*'([^']*)'/);
    if (imageMatch) {
      const [, device, imageName] = imageMatch;
      currentImages[device] = imageName;
    }

    const descMatch = line.match(/description:\s*(.*)/);
    if (descMatch) {
      let desc = descMatch[1];
      // Handle multi-line array
      if (desc.includes("[")) {
        currentDescription = desc
          .replace(/[[\]\',]/g, " ")
          .trim()
          .replace(/\s+/g, "\n");
      } else {
        // Handle single-line string
        currentDescription = desc.replace(/['\',]/g, "").trim();
      }
    }
  }

  if (line.trim().startsWith("},")) {
    if (currentTestId) {
      for (const device in currentImages) {
        // Output: imageName, testId, device, description
        // Use tabs as separators for robustness
        console.log(
          `${currentImages[device]}\t${currentTestId}\t${device}\t"${currentDescription}"`,
        );
      }
    }
    inObject = false;
  }
}

