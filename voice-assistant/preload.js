const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use IPC
contextBridge.exposeInMainWorld('api', {
  // Recording controls
  startRecording: () => ipcRenderer.send('start-recording'),
  stopRecording: () => ipcRenderer.send('stop-recording'),
  
  // Temporary simulation function for MVP
  simulateVoiceProcessing: (text) => ipcRenderer.send('simulate-voice-processing', text),
  
  // Result listeners
  onStartListening: (callback) => ipcRenderer.on('start-listening', callback),
  onSpeechResult: (callback) => ipcRenderer.on('speech-result', callback),
  onValidationResult: (callback) => ipcRenderer.on('validation-result', callback),
  onResponseReady: (callback) => ipcRenderer.on('response-ready', callback)
}); 