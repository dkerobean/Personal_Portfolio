const fs = require('fs-extra');
const path = require('path');

// Ensure the dist directory exists
fs.ensureDirSync('dist');

// Copy all files from src to dist
fs.copySync('src', 'dist', {
  filter: (src) => {
    // Don't copy .DS_Store files
    return !src.includes('.DS_Store');
  }
});

console.log('Build completed successfully!');