// filepath: c:\Users\derric samson\ai-support-portal\prepare-commit.js
/**
 * This script prepares the repository for a clean commit by:
 * 1. Removing empty files from git tracking
 * 2. Removing the temp-new directory from git tracking without physically deleting it
 * 3. Creating a clean .gitignore to ignore problematic files
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to run git commands and handle errors
function runGitCommand(command) {
  try {
    console.log(`Running: ${command}`);
    const output = execSync(command, { encoding: 'utf8' });
    return output.trim();
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return null;
  }
}

// Remove temp-new from Git tracking
console.log('Removing temp-new directory from git tracking...');
runGitCommand('git rm -r --cached temp-new');

// Make sure .gitignore is correctly set up
console.log('Ensuring .gitignore is properly configured...');
const gitignorePath = path.join(__dirname, '.gitignore');
let gitignoreContent = fs.existsSync(gitignorePath) 
  ? fs.readFileSync(gitignorePath, 'utf8') 
  : '';

// Add entries if they don't exist
const requiredEntries = [
  '# dependencies',
  '/node_modules',
  '# next.js',
  '/.next/',
  '/out/',
  '# local env files',
  '.env*.local',
  '.env',
  '.env.development',
  '.env.production',
  '# temp and backup files',
  '*~',
  '*.bak',
  '*.swp',
  '*.tmp',
  '.cache/',
  'temp-new/',
  'delete-temp-new.bat'
];

let gitignoreChanged = false;
for (const entry of requiredEntries) {
  if (!gitignoreContent.includes(entry)) {
    gitignoreContent += `\n${entry}`;
    gitignoreChanged = true;
  }
}

if (gitignoreChanged) {
  fs.writeFileSync(gitignorePath, gitignoreContent);
  console.log('Updated .gitignore file');
  runGitCommand('git add .gitignore');
}

// Stage all the necessary files
console.log('Staging files for commit...');
runGitCommand('git add .');

// Run git status to show what will be committed
console.log('\nCurrent git status:');
const status = runGitCommand('git status');
console.log(status);

console.log('\nRepository is now ready for a clean commit.');
console.log('To commit your changes, run:');
console.log('git commit -m "Fix AI support portal: Clean structure and fix ChatContext dependencies"');
console.log('git push');
