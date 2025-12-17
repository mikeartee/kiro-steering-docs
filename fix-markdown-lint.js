const fs = require('fs');
const path = require('path');

async function fixMarkdownFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let fixed = false;

  // Fix MD012: Multiple consecutive blank lines
  const beforeMD012 = content;
  content = content.replace(/(\r?\n){3,}/g, '\n\n');
  if (content !== beforeMD012) {
    console.log(`  Fixed MD012 (multiple blank lines) in ${filePath}`);
    fixed = true;
  }

  // Fix MD047: Files should end with a single newline
  if (!content.endsWith('\n')) {
    content = content + '\n';
    console.log(`  Fixed MD047 (missing final newline) in ${filePath}`);
    fixed = true;
  } else if (content.endsWith('\n\n')) {
    content = content.replace(/\n+$/, '\n');
    console.log(`  Fixed MD047 (extra final newlines) in ${filePath}`);
    fixed = true;
  }

  // Fix MD040: Fenced code blocks should have a language
  const codeBlockMatches = content.match(/```\r?\n/g);
  if (codeBlockMatches) {
    console.log(`  Warning: Found ${codeBlockMatches.length} code blocks without language in ${filePath}`);
    console.log(`    Manual fix needed for MD040`);
  }

  // Fix MD022: Headings should be surrounded by blank lines
  const beforeMD022 = content;
  content = content.replace(/([^\n])\n(#{1,6} .+)\n([^\n])/g, '$1\n\n$2\n\n$3');
  if (content !== beforeMD022) {
    console.log(`  Fixed MD022 (heading spacing) in ${filePath}`);
    fixed = true;
  }

  // Fix MD032: Lists should be surrounded by blank lines
  const beforeMD032 = content;
  content = content.replace(/([^\n])\n([-*+] .+)/g, '$1\n\n$2');
  content = content.replace(/([^\n])\n(\d+\. .+)/g, '$1\n\n$2');
  if (content !== beforeMD032) {
    console.log(`  Fixed MD032 (list spacing) in ${filePath}`);
    fixed = true;
  }

  // Fix MD031: Fenced code blocks should be surrounded by blank lines
  const beforeMD031 = content;
  content = content.replace(/([^\n])\n(```)/g, '$1\n\n$2');
  content = content.replace(/(```)\n([^\n])/g, '$1\n\n$2');
  if (content !== beforeMD031) {
    console.log(`  Fixed MD031 (code block spacing) in ${filePath}`);
    fixed = true;
  }

  // Fix MD018: No space after hash on atx style heading
  const beforeMD018 = content;
  content = content.replace(/^(#{1,6})([^ #\n])/gm, '$1 $2');
  if (content !== beforeMD018) {
    console.log(`  Fixed MD018 (space after hash) in ${filePath}`);
    fixed = true;
  }

  // Clean up any triple+ newlines created by fixes
  content = content.replace(/(\r?\n){3,}/g, '\n\n');

  // Ensure single final newline
  content = content.replace(/\n+$/, '\n');

  if (fixed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed ${filePath}`);
    return true;
  }

  return false;
}

function getAllMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', 'out'].includes(file)) {
        getAllMarkdownFiles(filePath, fileList);
      }
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

async function main() {
  console.log('Finding markdown files...\n');
  
  const files = getAllMarkdownFiles('.');

  console.log(`Found ${files.length} markdown files\n`);

  let fixedCount = 0;
  for (const file of files) {
    const wasFixed = await fixMarkdownFile(file);
    if (wasFixed) fixedCount++;
  }

  console.log(`\n✓ Fixed ${fixedCount} files`);
  console.log('\nRun "npm run lint:md" to check remaining issues');
}

main().catch(console.error);
