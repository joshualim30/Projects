import fs from 'fs-extra';
import path from 'path';

async function buildElectron() {
  try {
    // Create dist-electron directory
    await fs.ensureDir('dist-electron');
    
    // Copy the built React app
    await fs.copy('dist', 'dist-electron/dist');
    
    // Copy electron files to dist-electron root
    await fs.copy('electron/main.js', 'dist-electron/main.js');
    await fs.copy('electron/preload.js', 'dist-electron/preload.js');
    
    // Copy the app icon to dist-electron
    await fs.copy('public/app-icon.png', 'dist-electron/app-icon.png');
    
    // Create a modified package.json for Electron (without "type": "module")
    const packageJson = await fs.readJson('package.json');
    delete packageJson.type; // Remove ES module type for Electron
    packageJson.main = 'main.js'; // Set correct main entry for dist-electron
    
    // Remove unnecessary scripts and dependencies for the electron build
    delete packageJson.scripts;
    delete packageJson.devDependencies;
    
    // Ensure electron version is fixed for electron-builder
    packageJson.devDependencies = {
      "electron": "33.4.11"
    };
    
    await fs.writeJson('dist-electron/package.json', packageJson, { spaces: 2 });
    

    
    console.log('✅ Electron files copied successfully');
  } catch (error) {
    console.error('❌ Error copying Electron files:', error);
    process.exit(1);
  }
}

buildElectron();
