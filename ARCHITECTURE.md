# Backend Architecture

## Overview

The backend uses a **dynamic context injection** system that analyzes user messages and only includes relevant company data in the AI prompt, making responses more efficient and focused.

## File Structure

```
SkyTech/
├── server.js                    # Main Express server
├── data/
│   └── companyData.json        # Structured company data (services, clients, case studies, etc.)
└── src/
    └── utils/
        └── contextBuilder.js   # Dynamic context builder helper
```

## Architecture Components

### 1. `data/companyData.json`

Structured JSON file containing all company information:
- **about**: Company description, founding year, clients served, inventory
- **services**: List of all 12 services with details
- **callCenter**: Features, options (Standard/Customized), impact metrics
- **clients**: Array of client brand names
- **caseStudies**: Array of case studies with stats
- **metrics**: Performance metric abbreviations and meanings
- **contact**: Founder info, email, phone, location
- **whyUs**: Reasons to choose Skytech

### 2. `src/utils/contextBuilder.js`

**Function: `buildContext(userMessage)`**

Analyzes the user's message and returns only relevant context sections:

**Detection Logic:**
- **Services**: Detects keywords like "service", "layanan", "programmatic", "marketing", etc.
- **Call Center**: Detects "call center", "telepon", "instalasi", "setup"
- **Case Studies**: Detects "case study", "studi kasus", brand names, "campaign"
- **Clients**: Detects "client", "klien", "brand", "partner", "trusted"
- **Metrics**: Detects "metric", "metrik", abbreviations (CPM, CTR, etc.)
- **Contact**: Detects "contact", "kontak", "email", "phone", "alamat", "arun"
- **Why Us**: Detects "why", "mengapa", "choose", "benefit", "advantage"

**Always Included:**
- Basic about information (founded year, description, clients served, inventory)

**Benefits:**
- Reduces prompt size (only relevant data)
- Faster AI responses
- More focused answers
- Lower token costs

### 3. `server.js`

**Express Server Setup:**
- **Development**: Uses Vite middleware mode (single port, hot reload)
- **Production**: Serves static files from `dist/` directory

**API Route: `/api/chat`**
1. Validates OpenRouter API key
2. Extracts last user message from conversation
3. Calls `buildContext()` to get relevant context
4. Builds system prompt with dynamic context
5. Streams response via Server-Sent Events (SSE)
6. Handles errors gracefully

**Streaming:**
- Uses OpenRouter SDK with `stream: true`
- Sends chunks as SSE: `data: {"content": "..."}\n\n`
- Final chunk includes `done: true` flag
- Error handling sends error in SSE format

## Data Flow

```
User Message → buildContext() → Relevant Sections → System Prompt → OpenRouter → SSE Stream → Frontend
```

## Example Context Building

**User asks:** "What services do you offer?"

**Context includes:**
- About (always)
- Services (detected keyword "services")

**User asks:** "Tell me about your call center solution"

**Context includes:**
- About (always)
- Call Center (detected keywords "call center")

**User asks:** "Who are your clients?"

**Context includes:**
- About (always)
- Clients (detected keyword "clients")

## Production Deployment

1. **Build frontend**: `npm run build`
2. **Set environment**: `NODE_ENV=production`
3. **Set API key**: `OPENROUTER_API_KEY=your_key`
4. **Start server**: `npm start`

The server will:
- Serve static files from `dist/`
- Handle `/api/chat` requests
- Load `companyData.json` on first request (cached)

## Development

Run `npm run dev`:
- Express server on port 3001 (or PORT env var)
- Vite middleware handles frontend
- Hot module replacement enabled
- Single port for both frontend and backend

## Error Handling

- **Missing API key**: Returns 500 with error message
- **Invalid request**: Returns 400 with error message
- **Context builder failure**: Falls back to basic context
- **OpenRouter error**: Streams error in SSE format

## Scalability

- Company data is cached after first load
- Context builder is stateless (can be parallelized)
- SSE streaming handles multiple concurrent requests
- Minimal dependencies (Express, OpenRouter SDK, Vite)
