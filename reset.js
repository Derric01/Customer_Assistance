// reset.js - Advanced rebuild script for Next.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Starting complete Next.js rebuild...');

// Kill any running processes that might lock files
try {
  console.log('Killing any Node.js processes...');
  execSync('taskkill /f /im node.exe', { stdio: 'inherit' });
} catch (e) {
  // Ignore errors if no processes to kill
}

// Clean the cache and node_modules
console.log('Cleaning build cache...');
try {
  // Force clean npm cache
  execSync('npm cache clean --force', { stdio: 'inherit' });
} catch (e) {
  console.log('⚠️ Error cleaning npm cache:', e.message);
}

// Delete .next directory
const nextDir = path.join(__dirname, '.next');
if (fs.existsSync(nextDir)) {
  console.log('Removing .next directory...');
  try {
    fs.rmSync(nextDir, { recursive: true, force: true });
  } catch (err) {
    console.log('⚠️ Could not completely remove .next directory');
    
    // Try to remove crucial problematic files
    const problematicFiles = [
      path.join(nextDir, 'server', 'middleware-manifest.json'),
      path.join(nextDir, 'server', 'pages-manifest.json'),
      path.join(nextDir, 'trace')
    ];
    
    problematicFiles.forEach(file => {
      try {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      } catch (e) {}
    });
  }
}

// Create empty .next directory with required structure
console.log('Creating required directory structure...');
try {
  fs.mkdirSync(path.join(nextDir, 'server'), { recursive: true });
  fs.mkdirSync(path.join(nextDir, 'static'), { recursive: true });
  fs.mkdirSync(path.join(nextDir, 'cache'), { recursive: true });
  
  // Create an empty middleware-manifest.json file
  const manifestPath = path.join(nextDir, 'server', 'middleware-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({
    middleware: {},
    version: 1
  }));
  
  // Create an empty pages-manifest.json file
  const pagesManifestPath = path.join(nextDir, 'server', 'pages-manifest.json');
  fs.writeFileSync(pagesManifestPath, JSON.stringify({}));
  
  console.log('✅ Created required Next.js directories and manifest files');
} catch (err) {
  console.log('⚠️ Error creating Next.js structure:', err.message);
}

// Fix package version issues
console.log('Synchronizing package versions...');
const packageJsonPath = path.join(__dirname, 'package.json');
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const nextVersion = packageJson.dependencies.next.replace('^', '');
  
  if (packageJson.devDependencies['eslint-config-next']) {
    packageJson.devDependencies['eslint-config-next'] = nextVersion;
  }
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`✅ Updated eslint-config-next to match Next.js version ${nextVersion}`);
} catch (err) {
  console.log('⚠️ Error updating package.json:', err.message);
}

// Ensure next.config.js is compatible
console.log('Checking Next.js config compatibility...');
const configPath = path.join(__dirname, 'next.config.js');
try {
  let config = fs.readFileSync(configPath, 'utf8');
  
  // Remove swcMinify
  if (config.includes('swcMinify')) {
    config = config.replace(/swcMinify:.*,?\s*\n?/g, '');
  }
  
  // Simplify config to bare minimum
  fs.writeFileSync(configPath, `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Simple config for maximum compatibility
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;`);
  
  console.log('✅ Created clean Next.js config');
} catch (err) {
  console.log('⚠️ Error updating Next.js config:', err.message);
}

// Start Next.js with clean build
console.log('🚀 Starting Next.js with clean build...');
try {
  execSync('npx next dev', { 
    stdio: 'inherit',
    env: { 
      ...process.env, 
      NODE_ENV: 'development',
      NEXT_TELEMETRY_DISABLED: '1' // Disable telemetry for cleaner output
    }
  });
} catch (err) {
  console.log('⚠️ Error starting Next.js:', err.message);
} 