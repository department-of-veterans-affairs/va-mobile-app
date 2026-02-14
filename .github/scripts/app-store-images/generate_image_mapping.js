const fs = require('fs');
const path = require('path');

// Try to require TypeScript from VAMobile node_modules first, then fallback to local
let ts;
try {
  ts = require(path.join(__dirname, '../../../VAMobile/node_modules/typescript'));
} catch (error) {
  try {
    ts = require('typescript');
  } catch (fallbackError) {
    console.error('TypeScript is required but not found. Make sure to run "yarn install" in VAMobile directory first.');
    console.error('Tried paths:');
    console.error('  1.', path.join(__dirname, '../../../VAMobile/node_modules/typescript'));
    console.error('  2. typescript (global)');
    process.exit(1);
  }
}

const screenshotDataPath = path.join(__dirname, '../../../VAMobile/e2e/screenshots/screenshot_data.ts');

const fileContents = fs.readFileSync(screenshotDataPath, 'utf8');
const sourceFile = ts.createSourceFile('screenshot_data.ts', fileContents, ts.ScriptTarget.Latest, true);

let screenshotData;

ts.forEachChild(sourceFile, node => {
  if (ts.isVariableStatement(node)) {
    node.declarationList.declarations.forEach(declaration => {
      if (declaration.name.getText(sourceFile) === 'screenshotData') {
        const initializer = declaration.initializer;
        if (initializer) {
          screenshotData = eval(`(${initializer.getText(sourceFile)})`);
        }
      }
    });
  }
});

if (!screenshotData) {
  console.error('Could not extract screenshotData from screenshot_data.ts');
  process.exit(1);
}

screenshotData.forEach(item => {
  // Skip items without setupFunction, except for LettersDownload which uses static images
  if (!item.setupFunction && item.testId !== 'LettersDownload') {
    return;
  }
  
  item.deviceType.forEach(device => {
    let imageName;
    if (typeof item.imageName === 'string') {
      imageName = item.imageName;
    } else {
      imageName = item.imageName[device];
    }
    
    if (imageName) {
      const description = Array.isArray(item.description) 
        ? item.description.join('_NEWLINE_') 
        : item.description;
      console.log(`${imageName}	${item.testId}	${device}	"${description}"`);
    }
  });
});