// DOM elements
const statusIndicator = document.querySelector('.status-indicator');
const transcript = document.getElementById('transcript');
const response = document.getElementById('response');
const simulateBtn = document.getElementById('simulate-btn');

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
window.api.onStartListening(() => {
  setListeningState();
  window.api.startRecording();
  
  // For demo purposes, simulate voice input after a delay
  setTimeout(() => {
    window.api.simulateVoiceProcessing();
  }, 2000);
});

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

// Simulate button
simulateBtn.addEventListener('click', () => {
  setListeningState();
  
  // For demo, use different example phrases
  const phrases = [
    'remind me to call john tomorrow',
    'create a task to review the project',
    'set a timer for 5 minutes',
    'add a note about the meeting discussion',
    'schedule a meeting for friday at 3pm'
  ];
  
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  
  setTimeout(() => {
    window.api.simulateVoiceProcessing(randomPhrase);
  }, 1000);
}); 