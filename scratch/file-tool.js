const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '../../master-moves-os');
const action = process.argv[2];
const fileRelPath = process.argv[3];

if (action === 'read') {
  const fullPath = path.join(targetDir, fileRelPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`File does not exist: ${fullPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  console.log(content);
} else if (action === 'write') {
  const fullPath = path.join(targetDir, fileRelPath);
  const content = process.argv[4] || ''; 
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Successfully wrote to ${fullPath}`);
} else if (action === 'search') {
  const query = process.argv[3];
  const results = [];
  function searchDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
          searchDir(fullPath);
        }
      } else {
        if (file.endsWith('.json') || dir.includes('test-results')) {
          continue;
        }
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.toLowerCase().includes(query.toLowerCase())) {
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            if (line.toLowerCase().includes(query.toLowerCase())) {
              results.push({
                file: path.relative(targetDir, fullPath),
                line: idx + 1,
                content: line.trim()
              });
            }
          });
        }
      }
    }
  }
  searchDir(targetDir);
  console.log(JSON.stringify(results.slice(0, 100), null, 2));
} else {
  console.log('Usage: node file-tool.js <read|write|search> <path|query> [content]');
}
