// cleanup.js - Script to safely clean Next.js cache on Windows
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting Next.js cleanup script...');

// Kill Node processes to release file locks
try {
  console.log('Attempting to kill Node.js processes...');
  try {
    execSync('taskkill /f /im node.exe', { stdio: 'inherit' });
    console.log('Successfully terminated Node.js processes');
  } catch (err) {
    console.log('No active Node.js processes found or unable to terminate');
  }
} catch (err) {
  console.log('Error during process termination:', err.message);
}

// Wait briefly for processes to fully terminate
console.log('Waiting for processes to terminate...');
setTimeout(() => {
  // Paths to clean
  const nextDir = path.join(__dirname, '.next');
  const cacheDir = path.join(__dirname, 'node_modules', '.cache');
  const nextCacheDir = path.join(__dirname, '.next', 'cache');

  // Function to safely delete directory with retries
  function safeDeleteDir(dir) {
    console.log(`Attempting to delete ${dir}...`);
    
    if (!fs.existsSync(dir)) {
      console.log(`Directory ${dir} does not exist. Skipping.`);
      return;
    }
    
    try {
      // Use rimraf-like approach but with native fs
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`Successfully deleted ${dir}`);
    } catch (err) {
      console.log(`Error deleting ${dir}: ${err.message}`);
      console.log('Trying alternative approach...');
      
      try {
        // Windows-specific approach using cmd
        execSync(`rd /s /q "${dir}"`, { stdio: 'inherit' });
        console.log(`Successfully deleted ${dir} using cmd`);
      } catch (cmdErr) {
        console.log(`Failed to delete using cmd: ${cmdErr.message}`);
        console.log('Attempting to delete critical files individually...');
        
        // Try to delete specific problematic files
        const criticalFiles = [
          path.join(dir, 'trace'),
          path.join(dir, 'server', 'middleware-manifest.json'),
          path.join(dir, 'server', 'middleware-build-manifest.js'),
          path.join(dir, 'server', 'pages-manifest.json')
        ];
        
        criticalFiles.forEach(file => {
          try {
            if (fs.existsSync(file)) {
              fs.unlinkSync(file);
              console.log(`Deleted ${file}`);
            }
          } catch (e) {
            console.log(`Could not delete ${file}: ${e.message}`);
          }
        });
      }
    }
  }

  // Delete directories
  safeDeleteDir(nextCacheDir); // Try to delete cache first
  safeDeleteDir(nextDir);
  safeDeleteDir(cacheDir);

  console.log('Creating empty .next directory...');
  try {
    fs.mkdirSync(nextDir, { recursive: true });
    console.log('Successfully created empty .next directory');
  } catch (err) {
    console.log(`Error creating .next directory: ${err.message}`);
  }

  console.log('Cleanup complete. You can now start the development server.');
}, 2000); // Wait 2 seconds 