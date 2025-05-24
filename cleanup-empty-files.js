// cleanup-empty-files.js
const fs = require('fs');
const path = require('path');

// Function to check if a file is empty
function isFileEmpty(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size === 0;
  } catch (err) {
    console.error(`Error checking file ${filePath}:`, err);
    return false;
  }
}

// Function to recursively find empty files
function findEmptyFiles(dir, emptyFiles = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // Skip node_modules and .git directories
      if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
        findEmptyFiles(filePath, emptyFiles);
      }
    } else if (stats.isFile() && isFileEmpty(filePath)) {
      emptyFiles.push(filePath);
    }
  }
  
  return emptyFiles;
}

// Function to delete the empty files
function deleteEmptyFiles(files) {
  for (const file of files) {
    try {
      fs.unlinkSync(file);
      console.log(`Deleted empty file: ${file}`);
    } catch (err) {
      console.error(`Error deleting file ${file}:`, err);
    }
  }
}

// Main function
function cleanupEmptyFiles() {
  const projectRoot = __dirname;
  console.log('Searching for empty files...');
  const emptyFiles = findEmptyFiles(projectRoot);
  
  if (emptyFiles.length === 0) {
    console.log('No empty files found.');
    return;
  }
  
  console.log(`Found ${emptyFiles.length} empty files:`);
  emptyFiles.forEach(file => console.log(`- ${file}`));
  
  const shouldDelete = process.argv.includes('--delete');
  if (shouldDelete) {
    console.log('\nDeleting empty files...');
    deleteEmptyFiles(emptyFiles);
    console.log('Done!');
  } else {
    console.log('\nRun with --delete flag to remove these files.');
  }
}

cleanupEmptyFiles();
