const fs = require('fs');
const path = require('path');

const STUDENT_DIR = path.join(__dirname, '../app/student');

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
    // Padding fix
    [/className="space-y-8 pb-12 font-sans"/g, 'className="space-y-8 pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)] font-sans"'],
    
    // Banner background and base text colors
    [/bg-\[\#ffb800\] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden/g, 'bg-[#ffb800] p-6 sm:p-10 rounded-3xl text-slate-950 shadow-xl relative overflow-hidden'],
    
    // Badge/Pills colors inside yellow banner
    [/bg-white\/10 text-amber-300/g, 'bg-slate-950/10 text-slate-900'],
    [/border-white\/15/g, 'border-slate-950/10'],
    [/border-white\/20/g, 'border-slate-950/10'],
    [/text-amber-100/g, 'text-slate-900/85'],
    [/text-amber-200/g, 'text-slate-900/85'],
    [/text-white\/80/g, 'text-slate-900/85'],
    [/text-white\/90/g, 'text-slate-900/85'],
    
    // Buttons inside yellow banner
    [/bg-white\/15 hover:bg-white\/25 text-white/g, 'bg-slate-950/10 hover:bg-slate-950/20 text-slate-950'],
    [/bg-white\/10 hover:bg-white\/20 text-white/g, 'bg-slate-950/10 hover:bg-slate-950/20 text-slate-950'],
    [/border-white\/20/g, 'border-slate-950/20'],
    
    // Tab indicator on yellow bg
    [/bg-white\/15 text-white/g, 'bg-slate-950/15 text-slate-950'],
    [/text-white hover:bg-white\/10/g, 'text-slate-950 hover:bg-slate-950/5']
];

console.log('Scanning student portal pages for banner color and padding fixes...');

let modifiedCount = 0;

walkDir(STUDENT_DIR, (filePath) => {
    const ext = path.extname(filePath);
    if (ext === '.tsx') {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        for (let [regex, replacement] of replacements) {
            content = content.replace(regex, replacement);
        }
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed page layout & banner colors in: ${path.relative(STUDENT_DIR, filePath)}`);
            modifiedCount++;
        }
    }
});

console.log(`Fixes successfully completed in ${modifiedCount} files!`);
