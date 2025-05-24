// Manual cleanup for temp-new folder
// This script will move any needed files from temp-new to the main project
// and then prepare the temp-new folder for manual deletion

const fs = require('fs');
const path = require('path');

// Function to check if a file exists in the main project and is not empty
function existsAndNotEmpty(filePath) {
  try {
    if (!fs.existsSync(filePath)) return false;
    const stats = fs.statSync(filePath);
    return stats.size > 0;
  } catch (err) {
    return false;
  }
}

// Copy important files from temp-new if they don't exist in the main project
function copyImportantFiles() {
  const tempNewPath = path.join(__dirname, 'temp-new');
  const filesToCheck = [
    'src/app/ai/route.ts',
    'components/ChatInput.tsx',
    'components/MessageBubble.tsx',
    'components/PostButton.tsx',
    'components/SourceTag.tsx',
    'data/docs.ts',
    'data/faq.ts',
    'data/rulebook.ts',
    'lib/getAIResponse.ts',
  ];
  
  console.log('Checking for important files to preserve from temp-new...');
  
  filesToCheck.forEach(filePath => {
    const tempFilePath = path.join(tempNewPath, filePath);
    const mainFilePath = path.join(__dirname, filePath.replace(/^src\//, ''));
    
    // Check if file exists in temp-new
    if (fs.existsSync(tempFilePath)) {
      try {
        const tempFileStats = fs.statSync(tempFilePath);
        
        // Only copy if the file has content and doesn't exist or is empty in main project
        if (tempFileStats.size > 0 && !existsAndNotEmpty(mainFilePath)) {
          // Ensure directory exists
          const dir = path.dirname(mainFilePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          // Copy the file
          fs.copyFileSync(tempFilePath, mainFilePath);
          console.log(`Copied ${filePath} to main project`);
        }
      } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
      }
    }
  });
}

// Prepare temp-new for manual deletion
function prepareForManualDeletion() {
  const tempNewPath = path.join(__dirname, 'temp-new');
  
  // Clear node_modules symlinks if they exist (these often cause problems)
  const nodeModulesPath = path.join(tempNewPath, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    console.log('Found node_modules in temp-new. Creating deletion instructions...');
    
    // Create a batch file to help with manual deletion
    const batchContent = `@echo off
echo Stopping any running Node.js processes...
taskkill /F /IM node.exe
timeout /t 2 /nobreak
echo Deleting temp-new folder...
rmdir /s /q "${tempNewPath.replace(/\\/g, '\\\\')}"
echo Done!
pause`;
    
    fs.writeFileSync(path.join(__dirname, 'delete-temp-new.bat'), batchContent);
    console.log('Created delete-temp-new.bat - Run this file to remove the temp-new directory');
  }
}

// Main function
function main() {
  try {
    copyImportantFiles();
    prepareForManualDeletion();
    console.log('\nManual cleanup preparation completed.');
    console.log('Please run delete-temp-new.bat to complete the cleanup.');
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
}

main();
