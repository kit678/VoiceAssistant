# Voice Assistant MVP Architecture

## Seven-Node Architecture with Voice Workflow Focus

```mermaid
graph TB
    subgraph "Voice Assistant System"
        UI[UI Shell<br/>Electron or .NET MAUI]
        
        subgraph "User Input Node"
            Hotkey[Hotkey Registration]
            AudioCapture[Audio Capture Module]
            STT[Google Cloud<br/>Speech-to-Text API]
        end
        
        subgraph "Guardrail Node"
            Validation[Input Validation Layer<br/>Grammar/Syntax Correction]
            Clarification[Ambiguity Detection<br/>& Clarification Prompts]
        end
        
        subgraph "LLM Node"
            CommandProcessing[Command/Intent Classification]
            ParamExtraction[Parameter Extraction]
            ResponseGeneration[Response Text Generation]
        end
        
        subgraph "Tool Node"
            TimerTool[Timer System]
            NoteTool[Note-Taking]
            ZapierConnector[Zapier Integration<br/>Connector]
        end
        
        subgraph "Memory Node"
            DB[Cloud Database<br/>Supabase/Firebase]
            SessionStore[Conversation History]
            UserPrefs[User Preferences]
        end
        
        subgraph "Fallback Node"
            ErrorHandler[Error Recovery]
            Retry[API Retry Logic]
            Fallback[Degraded Operation Modes]
        end
        
        subgraph "Control Node"
            Orchestrator[Workflow Orchestration]
            StateManager[Session State Management]
        end

        TTS[Google Cloud<br/>Text-to-Speech API]
    end
    
    subgraph "External Services"
        GCloud[Google Cloud Platform]
        Zapier[Zapier]
        subgraph "Integrated Tools"
            Trello[Trello]
            Notion[Notion]
            GCal[Google Calendar]
        end
    end
    
    %% Input Flow
    Hotkey --> AudioCapture
    AudioCapture --> STT
    STT --> Validation
    Validation --> Clarification
    Clarification -- "Needs User Input" --> UI
    Clarification -- "Validated Input" --> CommandProcessing
    
    %% Processing Flow
    CommandProcessing --> ParamExtraction
    ParamExtraction --> ResponseGeneration
    ResponseGeneration --> Orchestrator
    
    %% Output Paths
    Orchestrator --> TTS
    Orchestrator --> TimerTool
    Orchestrator --> NoteTool
    Orchestrator --> ZapierConnector
    
    %% Storage
    CommandProcessing -.-> SessionStore
    ResponseGeneration -.-> SessionStore
    Orchestrator -.-> UserPrefs
    
    %% UI Connection
    UI --> Hotkey
    TTS --> UI
    
    %% Error Handling
    STT -. Error .-> ErrorHandler
    TTS -. Error .-> ErrorHandler
    ZapierConnector -. Error .-> ErrorHandler
    ErrorHandler --> Retry
    Retry -. "Max Retries Exceeded" .-> Fallback
    
    %% External Connections
    STT -.-> GCloud
    TTS -.-> GCloud
    ZapierConnector -.-> Zapier
    Zapier -.-> Trello
    Zapier -.-> Notion
    Zapier -.-> GCal
    DB -.-> GCloud
    
    %% Control Flow
    StateManager --> Orchestrator

    classDef focusNode fill:#f96,stroke:#333,stroke-width:2px;
    class Validation,Clarification,STT,TTS,UI,AudioCapture focusNode;
```

## Voice Workflow MVP Component Details

### 1. Hotkey Registration System
- Registers system-wide keyboard shortcuts
- Uses OS-specific APIs via chosen desktop framework
- Activates voice input mode when triggered

### 2. Audio Capture Module
- Interfaces with microphone hardware
- Handles recording start/stop
- Processes audio streams for STT service

### 3. Speech-to-Text API Integration
- Uses Google Cloud Speech-to-Text API (free tier)
- Converts audio to text representation
- Handles streaming recognition for real-time feedback

### 4. Input Validation Layer
- Detects and corrects grammatical/syntactical errors
- Analyzes logical consistency of commands
- Implements the Guardrail node functionality

### 5. Clarification Protocol
- Detects ambiguous or uncertain commands
- Generates targeted clarification questions
- Confirms interpretations with user

### 6. Command Interpreter
- Identifies intent from validated text
- Extracts parameters and arguments
- Maps to executable actions

### 7. Response Generator
- Creates natural language responses
- Formats command feedback appropriately
- Prepares text for TTS conversion

### 8. Text-to-Speech Integration
- Uses Google Cloud Text-to-Speech API (free tier)
- Converts response text to spoken audio
- Manages voice characteristics and speech settings

### 9. UI Shell
- Provides visual feedback during interactions
- Displays recognized text and agent responses
- Offers fallback text input option

### 10. Cloud Database Integration
- Stores conversation history
- Maintains user preferences
- Leverages Supabase or Firebase based on final decision

## Framework Decision

Based on the requirement for rapid MVP development on Windows while focusing on voice interaction capabilities, **Electron** is recommended for the initial implementation:

- **Pros for this project**:
  - Faster development cycle with web technologies
  - Extensive libraries for audio handling and UI feedback
  - Simpler integration with cloud services via JavaScript SDKs
  - Better suited for quick MVP iteration

- **Alternative**:
  - **.NET MAUI** would provide better native Windows integration but at the cost of longer development time
  - Could be considered for v2 once the voice workflow is validated

## Next Steps

1. Set up Electron project structure
2. Implement hotkey registration
3. Create audio capture module
4. Configure Google Cloud Speech-to-Text API
5. Build initial UI shell for testing 