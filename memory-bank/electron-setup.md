# Electron Project Setup for Voice Assistant MVP

## Project Structure

```
voice-assistant/
├── package.json          # Project dependencies and scripts
├── main.js               # Main Electron process 
├── preload.js            # Preload script for secure renderer access
├── renderer/             # Renderer process (UI)
│   ├── index.html        # Main application window
│   ├── styles.css        # UI styling
│   └── renderer.js       # Renderer process logic
├── src/                  # Application source code
│   ├── audio/            # Audio capture and processing
│   │   ├── recorder.js   # Microphone recording functionality
│   │   └── processor.js  # Audio stream processing
│   ├── speech/           # Google Cloud speech integration
│   │   ├── stt.js        # Speech-to-Text client
│   │   └── tts.js        # Text-to-Speech client
│   ├── validation/       # Input validation components
│   │   ├── grammar.js    # Grammar and syntax correction
│   │   └── clarifier.js  # Ambiguity detection and clarification
│   ├── llm/              # LLM integration
│   │   ├── client.js     # API client for chosen LLM
│   │   └── commands.js   # Command classification and extraction
│   ├── tools/            # Tool implementations
│   │   ├── timer.js      # Timer functionality
│   │   ├── notes.js      # Note-taking features
│   │   └── zapier.js     # Zapier integration connector
│   ├── storage/          # Database and state management
│   │   ├── db.js         # Database client (Supabase/Firebase)
│   │   └── session.js    # Session state management
│   └── utils/            # Helper utilities
│       ├── hotkeys.js    # Global hotkey registration
│       └── logger.js     # Logging functionality
├── tests/                # Test directory
│   ├── unit/             # Unit tests
│   └── integration/      # Integration tests
└── config/               # Configuration files
    ├── google-cloud.js   # Google Cloud API configuration
    └── app-config.js     # Application settings
```

## Initial Setup Steps

1. Initialize the Node.js project:
```bash
mkdir voice-assistant
cd voice-assistant
npm init -y
```

2. Install Electron and development dependencies:
```bash
npm install --save-dev electron electron-builder nodemon
```

3. Install core dependencies:
```bash
npm install electron-store node-global-key-listener @google-cloud/speech @google-cloud/text-to-speech
```

4. Set up package.json scripts:
```json
"scripts": {
  "start": "electron .",
  "dev": "nodemon --exec electron .",
  "build": "electron-builder"
}
```

5. Create basic main.js file:
```javascript
const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    frame: false,
    transparent: true,
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
    // Register global hotkey (Alt+Space as example)
    globalShortcut.register('Alt+Space', () => {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    });
  });
}

// Create window when Electron is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Unregister shortcuts when app is quitting
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
```

6. Create preload.js for secure communication:
```javascript
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use IPC
contextBridge.exposeInMainWorld('api', {
  startRecording: () => ipcRenderer.send('start-recording'),
  stopRecording: () => ipcRenderer.send('stop-recording'),
  onSpeechResult: (callback) => ipcRenderer.on('speech-result', callback),
  onValidationResult: (callback) => ipcRenderer.on('validation-result', callback),
  onResponseReady: (callback) => ipcRenderer.on('response-ready', callback)
});
```

7. Create basic renderer/index.html:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Voice Assistant</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <div class="status-indicator"></div>
    <div class="transcript-container">
      <p id="transcript"></p>
    </div>
    <div class="response-container">
      <p id="response"></p>
    </div>
  </div>
  <script src="renderer.js"></script>
</body>
</html>
```

8. Create basic renderer/styles.css:
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: rgba(25, 25, 25, 0.9);
  color: white;
  user-select: none;
  -webkit-app-region: drag;
}

.container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 10px;
  min-height: 200px;
}

.status-indicator {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #888;
  margin-bottom: 15px;
  transition: background-color 0.3s ease;
}

.status-indicator.listening {
  background-color: #ff5252;
  animation: pulse 1.5s infinite;
}

.status-indicator.processing {
  background-color: #ffca28;
}

.status-indicator.speaking {
  background-color: #66bb6a;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.transcript-container, .response-container {
  margin: 10px 0;
}

#transcript, #response {
  margin: 0;
  line-height: 1.5;
}

#transcript {
  color: #aaa;
  font-style: italic;
}

#response {
  color: white;
  font-weight: 500;
}
```

9. Create basic renderer/renderer.js:
```javascript
// DOM elements
const statusIndicator = document.querySelector('.status-indicator');
const transcript = document.getElementById('transcript');
const response = document.getElementById('response');

// UI state handling
function setListeningState() {
  statusIndicator.className = 'status-indicator listening';
  transcript.textContent = 'Listening...';
  response.textContent = '';
}

function setProcessingState() {
  statusIndicator.className = 'status-indicator processing';
}

function setSpeakingState() {
  statusIndicator.className = 'status-indicator speaking';
}

function setIdleState() {
  statusIndicator.className = 'status-indicator';
}

// Voice Assistant API events
window.api.onSpeechResult((event, text) => {
  transcript.textContent = text;
  setProcessingState();
});

window.api.onValidationResult((event, correctedText) => {
  transcript.textContent = correctedText;
});

window.api.onResponseReady((event, responseText) => {
  response.textContent = responseText;
  setSpeakingState();
  
  // Reset to idle after speaking finishes (simulate for now)
  setTimeout(() => {
    setIdleState();
  }, 3000);
});

// Start in listening state when window appears
document.addEventListener('DOMContentLoaded', () => {
  setListeningState();
  window.api.startRecording();
});
```

## Next Steps

After setting up this basic project structure:

1. Configure Google Cloud Speech API credentials
2. Implement the audio recording and streaming functionality
3. Build the speech-to-text integration
4. Develop the input validation layer
5. Add initial command processing logic 