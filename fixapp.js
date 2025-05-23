// fixapp.js - Advanced Next.js repair script
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Starting deep Next.js repair...');

// Kill all Node processes
try {
  console.log('Terminating Node processes...');
  execSync('taskkill /f /im node.exe', { stdio: 'inherit' });
} catch (e) {
  // Ignore errors if no processes found
}

// Wait for processes to fully terminate
console.log('Waiting for processes to terminate...');
setTimeout(() => {
  // Prepare essential directories
  const nextDir = path.join(__dirname, '.next');
  const nodeModulesDir = path.join(__dirname, 'node_modules');
  
  // Delete .next folder entirely
  console.log('Removing .next directory...');
  try {
    if (fs.existsSync(nextDir)) {
      fs.rmSync(nextDir, { recursive: true, force: true });
    }
  } catch (err) {
    console.log('⚠️ Could not completely remove .next directory, will continue');
  }
  
  // Create simple next.config.js
  console.log('Creating compatible next.config.js...');
  const configPath = path.join(__dirname, 'next.config.js');
  try {
    fs.writeFileSync(configPath, `
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
};
`);
  } catch (e) {
    console.log('⚠️ Could not update next.config.js');
  }
  
  // Create simple package.json with clean dependencies
  console.log('Creating compatible package.json...');
  const packagePath = path.join(__dirname, 'package.json');
  try {
    const packageJson = {
      name: "ai-support-portal",
      version: "0.1.0",
      private: true,
      scripts: {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint"
      },
      dependencies: {
        "@google/generative-ai": "^0.1.3",
        "next": "13.5.6",
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
      },
      devDependencies: {
        "autoprefixer": "^10.4.16",
        "eslint": "^8.50.0",
        "eslint-config-next": "13.5.6",
        "postcss": "^8.4.31",
        "tailwindcss": "^3.3.3",
        "typescript": "^5.2.2"
      }
    };
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  } catch (e) {
    console.log('⚠️ Could not update package.json');
  }
  
  // Completely rebuild the project
  console.log('🧹 Cleaning npm cache...');
  try {
    execSync('npm cache clean --force', { stdio: 'inherit' });
  } catch (e) {
    console.log('⚠️ Error cleaning npm cache');
  }
  
  console.log('📦 Reinstalling packages...');
  try {
    if (fs.existsSync(nodeModulesDir)) {
      fs.rmSync(nodeModulesDir, { recursive: true, force: true });
    }
  } catch (e) {
    console.log('⚠️ Could not remove node_modules completely');
  }
  
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies reinstalled successfully');
  } catch (e) {
    console.log('⚠️ Error reinstalling dependencies');
  }
  
  console.log('🚀 Starting Next.js with clean build...');
  try {
    execSync('npx next dev', {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'development'
      }
    });
  } catch (e) {
    console.log('⚠️ Error starting Next.js dev server');
  }
}, 2000); 