# AETHEL Studio — Interactive 3D BIM & AI Structural Architect

A bespoke luxury architecture showcase combining a real-time **Three.js 3D Structural Inspector**, a **Material Resonance Lab**, and a server-side **AI Principal Architect Consultant** powered by **Google Gemini 4 Hydrogen** (`@google/genai` Interactions API) with automatic free-tier fallback (`gemini-3.8-flash` -> `gemini-3.5-flash-lite`).

## Key Features

- **Server-Side Gemini AI Consultation (`/api/chat`)**: Uses the official `@google/genai` Interactions API with strict JSON schema structured outputs (`response_format`) to return both architectural engineering guidance and curated `MaterialCard` physics/durability specs.
- **Zero Exposed API Keys**: `GEMINI_API_KEY` stays strictly on the server (Vercel Node.js Serverless Function in `client/api/chat.mjs` for production, Express backend in `server/` for local dev).
- **Resilient Free-Tier Model Fallback**: Automatically falls back from `gemini-4-hydrogen` to `gemini-3.8-flash` and `gemini-3.5-flash-lite` on transient `429`/`503` rate-limit errors.
- **Interactive 3D WebGL Structural Viewer**: Real-time Three.js model inspection and stress exploration.

## Tech Stack

- **Frontend:** React 18, Tailwind CSS, Three.js
- **Backend / Serverless:** Vercel Node.js Function (`client/api/chat.mjs`) & Express.js (`server/`)
- **AI Integration:** `@google/genai` (Interactions API, Structured JSON Output, `gemini-4-hydrogen` + `gemini-3.8-flash` fallback)

## Local Development

1. Configure server environment variables:
   ```bash
   cp server/.env.example server/.env
   # Add your GEMINI_API_KEY from https://aistudio.google.com/apikey
   ```
2. Start the backend API server:
   ```bash
   cd server
   npm install
   npm run dev
   ```
3. Start the React client (proxies `/api/*` to `http://localhost:5000`):
   ```bash
   cd client
   npm install
   npm start
   ```

## Production Deployment (Vercel)

Set the following **Server-Side Environment Variable** in your Vercel Project Settings (Root Directory: `client`):
- `GEMINI_API_KEY` — Google AI Studio API Key (never prefix with `REACT_APP_`).
- Optional: `GEMINI_PRIMARY_MODEL` (default: `gemini-4-hydrogen`), `GEMINI_FALLBACK_MODEL` (default: `gemini-3.8-flash`).
