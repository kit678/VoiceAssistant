const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const config = require('./config/app-config');
const hotkeyManager = require('./src/utils/hotkeys');
const logger = require('./src/utils/logger');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  logger.info('Creating main application window');
  
  // Get window settings from config
  const windowWidth = config.get('ui.windowWidth');
  const windowHeight = config.get('ui.windowHeight');
  const alwaysOnTop = config.get('ui.alwaysOnTop');
  
  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: alwaysOnTop,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Load the index.html
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  
  // Hide window initially (will be shown on hotkey press)
  mainWindow.on('ready-to-show', () => {
    logger.debug('Main window ready to show, registering hotkey');
    mainWindow.show();
    mainWindow.focus();
    
    // Register global hotkey using our utility
    hotkeyManager.registerActivationHotkey(() => {
      toggleWindow();
    });
  });

  // Hide when focus is lost
  mainWindow.on('blur', () => {
    logger.debug('Window lost focus, hiding');
    mainWindow.hide();
  });
}

function toggleWindow() {
  if (mainWindow.isVisible()) {
    logger.debug('Hiding window');
    mainWindow.hide();
  } else {
    logger.debug('Showing window and starting voice recording');
    mainWindow.show();
    mainWindow.focus();
    // Signal to the renderer to start recording
    mainWindow.webContents.send('start-listening');
  }
}

// Create window when Electron is ready
app.whenReady().then(() => {
  logger.info('Application ready, starting initialization');
  
  // Reset to defaults to ensure fresh config for hotkey testing
  logger.info('Resetting configuration to defaults to pick up latest hotkey.');
  config.resetToDefaults();
  
  // Set app name from config
  app.setName(config.get('app.name'));
  
  createWindow();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  logger.info('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  logger.debug('App activated');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Unregister shortcuts when app is quitting
app.on('will-quit', () => {
  logger.info('Application quitting, cleaning up');
  hotkeyManager.unregisterAll();
});

// IPC Events

// Start recording
ipcMain.on('start-recording', () => {
  logger.info('Starting voice recording');
  // This will be implemented with the audio capture module
});

// Stop recording
ipcMain.on('stop-recording', () => {
  logger.info('Stopping voice recording');
  // This will be implemented with the audio capture module
});

// Temporarily simulate voice processing for our MVP setup
ipcMain.on('simulate-voice-processing', (event, text) => {
  logger.info(`Simulating voice processing with input: "${text || 'default input'}"`);
  
  // Simulate STT result
  setTimeout(() => {
    const recognizedText = text || 'Create a new task to review the project tomorrow';
    logger.debug(`Simulated STT result: "${recognizedText}"`);
    mainWindow.webContents.send('speech-result', recognizedText);
    
    // Simulate validation result
    setTimeout(() => {
      const correctedText = recognizedText + '.';
      logger.debug(`Simulated validation result: "${correctedText}"`);
      mainWindow.webContents.send('validation-result', correctedText);
      
      // Simulate response
      setTimeout(() => {
        const responseText = 'I\'ve created a task to review the project for tomorrow.';
        logger.debug(`Simulated assistant response: "${responseText}"`);
        mainWindow.webContents.send('response-ready', responseText);
        
        // Auto-hide if configured
        if (config.get('ui.autoHideAfterResponse')) {
          const hideDelay = config.get('ui.autoHideDelayMs');
          setTimeout(() => {
            if (mainWindow && mainWindow.isVisible()) {
              logger.debug(`Auto-hiding window after ${hideDelay}ms`);
              mainWindow.hide();
            }
          }, hideDelay);
        }
      }, 1000);
    }, 1000);
  }, 1000);
}); 