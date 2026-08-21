const fs = require('fs');
const path = require('path');

const DIRECTORY_TO_SCAN = path.join(__dirname, '../app');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

const replacements = [
    // hex codes replacements
    [/#1f5961/gi, '#ffb800'],
    [/#1a4a51/gi, '#ffa000'],
    [/#163e44/gi, '#ffa000'],
    [/#12363b/gi, '#ffa000'],
    [/#19484e/gi, '#0a1829'],
    
    // class replacements
    [/bg-teal-50\b/g, 'bg-amber-50'],
    [/bg-teal-100\b/g, 'bg-amber-100'],
    [/text-teal-100\b/g, 'text-amber-100'],
    [/text-teal-200\b/g, 'text-amber-200'],
    [/text-teal-600\b/g, 'text-amber-600'],
    [/text-teal-700\b/g, 'text-amber-700'],
    [/text-teal-800\b/g, 'text-amber-800'],
    [/text-teal-900\b/g, 'text-amber-950'],
    [/text-teal-50\b/g, 'text-amber-50'],
    [/bg-teal-500\b/g, 'bg-amber-500'],
    [/text-teal-500\b/g, 'text-amber-500'],
    
    [/border-teal-100\b/g, 'border-amber-100'],
    [/border-teal-200\b/g, 'border-amber-200'],
    [/border-teal-300\b/g, 'border-amber-300'],
    [/border-teal-500\b/g, 'border-amber-500'],
    
    [/bg-\[\#1f5961\]/g, 'bg-[#ffb800]'],
    [/text-\[\#1f5961\]/g, 'text-[#ffb800]'],
    [/border-\[\#1f5961\]/g, 'border-[#ffb800]'],
    
    [/hover:bg-teal-/g, 'hover:bg-amber-'],
    [/hover:text-teal-/g, 'hover:text-amber-'],
    [/focus:ring-teal-/g, 'focus:ring-amber-'],
    [/focus:border-teal-/g, 'focus:border-amber-'],
    
    [/bg-teal-600\b/g, 'bg-[#ffb800]'],
    [/hover:bg-teal-700\b/g, 'hover:bg-[#ffa000]'],
    [/text-teal-400\b/g, 'text-amber-400']
];

console.log('Starting theme color replacement scan...');

let modifiedCount = 0;

walkDir(DIRECTORY_TO_SCAN, (filePath) => {
    const ext = path.extname(filePath);
    if (ext === '.tsx' || ext === '.ts') {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        for (let [regex, replacement] of replacements) {
            content = content.replace(regex, replacement);
        }
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${path.relative(DIRECTORY_TO_SCAN, filePath)}`);
            modifiedCount++;
        }
    }
});

console.log(`Scan complete! Unified theme color updated in ${modifiedCount} files.`);
