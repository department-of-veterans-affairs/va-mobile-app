const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const WORKFLOWS_DIR = path.resolve(__dirname, '../../../.github/workflows');
const OUTPUT_PATH = path.resolve(__dirname, '../static/data/workflows.json');

function extractDescription(content) {
  const lines = content.split('\n');
  let description = '';
  let inDescription = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('# DESCRIPTION:')) {
      description = trimmedLine.replace('# DESCRIPTION:', '').trim();
      inDescription = true;
    } else if (inDescription && trimmedLine.startsWith('#')) {
      description += ' ' + trimmedLine.replace('#', '').trim();
    } else if (inDescription && !trimmedLine.startsWith('#')) {
      break;
    }
  }

  return description || null;
}

function parseWorkflow(fileName) {
  const filePath = path.join(WORKFLOWS_DIR, fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const description = extractDescription(content);
  let data;
  
  try {
    data = yaml.load(content);
  } catch (e) {
    console.error(`Error parsing YAML in ${fileName}:`, e.message);
    return null;
  }

  if (!data) return null;

  const on = data.on || {};
  if (on) {
    Object.keys(on).forEach(trigger => {
      if (on[trigger] && typeof on[trigger] === 'object') {
        delete on[trigger].secrets;
        delete on[trigger].outputs;
      }
    });
  }

  return {
    fileName,
    name: data.name || fileName,
    description,
    on,
    jobs: data.jobs ? Object.keys(data.jobs) : [],
  };
}

function main() {
  console.log(`Reading workflows from: ${WORKFLOWS_DIR}`);
  
  if (!fs.existsSync(WORKFLOWS_DIR)) {
    console.error(`Error: Workflows directory not found at ${WORKFLOWS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(WORKFLOWS_DIR).filter(file => file.endsWith('.yml') || file.endsWith('.yaml'));
  const workflows = files
    .map(parseWorkflow)
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(workflows, null, 2));
  
  console.log(`✅ Workflow data written to ${OUTPUT_PATH}`);
  console.log(`Extracted metadata for ${workflows.length} workflows.`);
}

main();
