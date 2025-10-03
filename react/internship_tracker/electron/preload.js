const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppName: () => ipcRenderer.invoke('get-app-name'),
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  
  // Menu events
  onMenuNewInternship: (callback) => {
    ipcRenderer.on('menu-new-internship', callback);
  },
  onMenuAbout: (callback) => {
    ipcRenderer.on('menu-about', callback);
  },
  onMenuImportData: (callback) => {
    ipcRenderer.on('menu-import-data', callback);
  },
  onMenuExportData: (callback) => {
    ipcRenderer.on('menu-export-data', callback);
  },
  onMenuPreferences: (callback) => {
    ipcRenderer.on('menu-preferences', callback);
  },
  onMenuToggleView: (callback) => {
    ipcRenderer.on('menu-toggle-view', callback);
  },
  onMenuShortcuts: (callback) => {
    ipcRenderer.on('menu-shortcuts', callback);
  },
  onMenuCheckUpdates: (callback) => {
    ipcRenderer.on('menu-check-updates', callback);
  },
  onMenuFocusSearch: (callback) => {
    ipcRenderer.on('menu-focus-search', callback);
  },
  onMenuClearFilters: (callback) => {
    ipcRenderer.on('menu-clear-filters', callback);
  },
  
  // Native dialogs
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// Handle window controls for custom titlebar (if needed)
contextBridge.exposeInMainWorld('windowControls', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  onMaximizeChange: (callback) => {
    ipcRenderer.on('window-maximize-change', callback);
  }
});
