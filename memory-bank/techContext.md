# Technical Context

## Confirmed Technologies

### Speech Processing
- **Speech-to-Text**: Google Cloud Speech-to-Text API (free tier)
- **Text-to-Speech**: Google Cloud Text-to-Speech API (free tier)
- **Rationale**: Mature, reliable APIs with good language support and budgetary alignment

### Cloud Architecture
- **Approach**: Full cloud architecture for all components
- **Rationale**: Maximizes capability while minimizing local complexity and setup time

### Integrations
- **Integration Platform**: Zapier
- **Connected Services**: 
  - Trello (task management)
  - Notion (note-taking)
  - Google Calendar (scheduling/reminders)
- **Rationale**: Zapier provides robust, maintained integrations without custom API management overhead

### Development Tools
- **MCP Servers**: GitHub, StackOverflow, Context7, UIMock, Diagram, Supabase
- **Version Control**: Git with conventional commits
- **Architecture**: Seven-node pattern (LLM, Tool, Control, Memory, Input, Guardrail, Fallback)
  - Added emphasis on Guardrail node for voice input validation

### Target Platform
- **Primary OS**: Windows
- **Deployment**: Desktop application with system-wide hotkey
- **Rationale**: Aligns with user's primary operating environment

### Desktop Framework (Selected)
- **Electron** - JavaScript/TypeScript stack, cross-platform
  - **Rationale**: Faster development cycle, web tech familiarity, easier UI components
  - **Implementation Status**: Basic structure implemented, configuration issues pending resolution

## Technology Decisions Pending

### Cloud Database Options (Narrowed)
1. **Supabase** - PostgreSQL-based, MCP integration, open source
   - **Pros**: Good MCP server support, structured data model, open API
   - **Recommendation**: Better for structured data with relational requirements
2. **Firebase Firestore** - Google ecosystem alignment with Speech APIs
   - **Pros**: Good fit with Google Cloud ecosystem, real-time capabilities
   - **Recommendation**: Better if tight Google integration is valuable

### LLM Provider Options (Narrowed)
1. **Google Gemini** - Integrates with existing Google Cloud services
   - **Pros**: Unified billing, ecosystem alignment with speech services
   - **Recommendation**: Best ecosystem fit with speech services
2. **OpenAI GPT** - Strong general capabilities
   - **Pros**: Excellent function calling, robust documentation
   - **Recommendation**: Best for complex task decomposition
3. **Anthropic Claude** - Strong reasoning capabilities
   - **Pros**: Good at understanding nuanced instructions and validation
   - **Recommendation**: Best for input validation and clarification dialogues

## Current Implementation Details

### Electron Implementation
- **Main Process**: Handles application lifecycle, global shortcuts, and window management
- **Preload Script**: Secure bridge between renderer and main processes
- **Renderer Process**: UI components and user interaction
- **IPC Communication**: Set up for safe main-renderer communication

### Configuration System
- **Package**: electron-store (version 10.0.1)
- **Current Issue**: "TypeError: Store is not a constructor" error when initializing
- **Status**: Import syntax appears correct (`const Store = require('electron-store')`), but constructor fails
- **Investigation Areas**: 
  - CommonJS vs ESM compatibility 
  - Package version compatibility with Electron 36.3.1
  - Potential module resolution issues

### Dependencies
- **Electron**: 36.3.1
- **electron-store**: 10.0.1
- **electron-builder**: 26.0.12
- **nodemon**: 3.1.10

## Core Components for Voice Workflow MVP
1. **Hotkey Registration System** - System-wide keyboard shortcut capture (partially implemented)
2. **Audio Capture Module** - Microphone input recording and processing
3. **Google Cloud Speech-to-Text Client** - Voice transcription
4. **Input Validation Layer** - Grammar, syntax, and logical correction
5. **Command Interpreter** - Intent identification and parameter extraction
6. **Response Generator** - Action execution and feedback creation
7. **Google Cloud Text-to-Speech Client** - Voice response generation
8. **UI Shell** - Minimal interface for visual feedback and text input (implemented)
9. **Persistent Storage** - Session and command history (in progress with electron-store)

## Version Dependencies
- **Node.js**: Latest LTS
- **Google Cloud SDK**: Pending implementation
- **Windows**: 10+ (testing on Windows 10.0.26100) 