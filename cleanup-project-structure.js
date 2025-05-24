// cleanup-project-structure.js
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

// Function to check if temp-new folder exists and clean it up
function cleanupTempNewFolder() {
  const tempNewPath = path.join(__dirname, 'temp-new');
  
  if (fs.existsSync(tempNewPath)) {
    console.log('Found temp-new folder. Removing it...');
    
    try {
      // Use rimraf for cross-platform directory removal
      // Note: You may need to install rimraf: npm install rimraf --save-dev
      rimraf.sync(tempNewPath);
      console.log('Successfully removed temp-new folder.');
    } catch (err) {
      console.error('Error removing temp-new folder:', err);
      console.log('\nManual removal instructions:');
      console.log('1. Stop the development server');
      console.log('2. Run: rmdir /s /q "temp-new"');
    }
  } else {
    console.log('temp-new folder not found. Nothing to clean up.');
  }
}

// Function to clean up duplicate config files
function cleanupDuplicateConfigFiles() {
  const duplicateConfigs = [
    'postcss.config.mjs',  // Keep .js version
    'eslint.config.mjs',   // Only if eslint.config.js exists
  ];
  
  for (const configFile of duplicateConfigs) {
    const filePath = path.join(__dirname, configFile);
    
    if (fs.existsSync(filePath)) {
      // Check if there's a .js version
      const jsVersion = filePath.replace('.mjs', '.js');
      
      if (fs.existsSync(jsVersion)) {
        console.log(`Found duplicate config: ${configFile}. Removing...`);
        try {
          fs.unlinkSync(filePath);
          console.log(`Successfully removed ${configFile}.`);
        } catch (err) {
          console.error(`Error removing ${configFile}:`, err);
        }
      }
    }
  }
}

// Main function
function cleanupProjectStructure() {
  console.log('Starting project structure cleanup...');
  
  cleanupTempNewFolder();
  cleanupDuplicateConfigFiles();
  
  console.log('\nProject structure cleanup completed.');
  console.log('\nNote: You might need to install rimraf if it\'s not already installed:');
  console.log('npm install rimraf --save-dev');
}

cleanupProjectStructure();
