# System Patterns & Architecture Decision Records

## 2024-12-19 – Seven Node Architecture Pattern – Modular agent design
**Decision**: Adopt seven-node architecture (LLM, Tool, Control, Memory, Input, Guardrail, Fallback) for AI agent structure.
**Rationale**: Provides clear separation of concerns, testability, and scalability. Each node has single responsibility, enabling independent development and testing of components.

## 2024-12-19 – Memory Bank Methodology – Canonical knowledge store  
**Decision**: Use memory-bank/ directory as single source of truth for all project knowledge and decisions.
**Rationale**: Ensures consistency across development sessions, provides clear project state tracking, and enables effective collaboration and knowledge transfer.

## 2024-12-19 – Clarification-First Approach – 95% confidence guard
**Decision**: Complete comprehensive requirements gathering before any implementation work.
**Rationale**: Prevents costly rework, ensures alignment with user needs, and establishes clear success criteria before technical commitments.

## 2024-12-19 – Windows-First Approach – Platform prioritization
**Decision**: Target Windows as the primary platform for initial release.
**Rationale**: Aligns with user's primary operating environment, simplifies initial development, and enables faster MVP delivery.

## 2024-12-19 – Voice Interaction Priority – Core feature focus
**Decision**: Prioritize voice interaction workflow as the critical first capability.
**Rationale**: Voice interaction is the primary entry point for user engagement and the foundation for all other features.

## 2024-12-19 – Full Cloud Architecture – API and storage approach
**Decision**: Adopt fully cloud-based architecture for all components (APIs, LLM, storage).
**Rationale**: Maximizes capability while minimizing local complexity, leverages free tiers of cloud services, and enables rapid iteration.

## 2024-12-19 – Voice Input Validation Layer – Error correction
**Decision**: Implement dedicated validation layer between speech-to-text and command execution.
**Rationale**: Improves reliability by catching grammatical/syntactical errors, provides better UX through proactive clarification, and prevents command misinterpretation.

## 2024-12-19 – Electron Framework Selection – Desktop Implementation
**Decision**: Use Electron for the desktop application framework.
**Rationale**: Enables faster MVP development through web technologies, provides robust libraries for audio handling, and simplifies cloud service integration through JavaScript SDKs. Better suited for rapid iteration compared to .NET MAUI despite the latter's better Windows integration.

## Pending Decisions
- **Cloud Database**: Supabase vs Firebase (considering integration with existing tools and future expansion)
- **LLM Provider**: OpenAI vs Google Gemini vs Anthropic Claude (considering integration with Google Cloud speech services) 