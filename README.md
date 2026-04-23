# Boothify

Boothify is a full-stack photobooth web app scaffold with a playful React frontend and an Express backend. The product flow is designed around Spotify-assisted photo sessions: pick a song, capture up to 10 shots, choose photos for a strip layout, generate a strip plus animated export, and download the result.

This repository now includes the routed frontend flow, the hand-drawn Boothify UI system, and a modular Spotify search scaffold with backend mock fallback.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- HTTP client: Axios
- Routing: React Router
- Upload handling: Multer

## Project Structure

```text
boothify/
  client/
    src/
      components/
        spotify/
        ui/
      context/
        BoothifyContext.jsx
        boothifyConfig.js
      pages/
        SpotifySelectionPage.jsx
        ...
      services/
        apiClient.js
        spotifyApi.js
  server/
    config/
      spotifyConfig.js
    controllers/
      spotifyController.js
    routes/
      spotifyRoutes.js
    services/
      spotifyAuthService.js
      spotifyMockData.js
      spotifyService.js
```

## Setup

1. Copy `.env.example` to a local `.env` file at the project root.
2. For mock Spotify search only, you can leave the Spotify credentials empty.
3. For real Spotify search, add `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`, and keep `SPOTIFY_USE_MOCK_DATA=false`.
4. Install frontend dependencies:

   ```bash
   cd client
   npm install
   npm run dev
   ```

5. In a second terminal, install backend dependencies:

   ```bash
   cd server
   npm install
   npm run dev
   ```

6. Open the Vite app in your browser. By default, the frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

## Spotify Search Notes

- `GET /api/spotify/config` reports whether Boothify is using mock search or real Spotify app-level search.
- `GET /api/spotify/search?q=...` returns normalized track objects with artwork, title, artist, duration, preview URL, and source metadata.
- The backend uses Spotify Client Credentials when credentials are available.
- If credentials are missing, or if Spotify search fails, the backend falls back to mock track data so the UI and session flow still work.
- The backend comments explain where to replace mock fallback or upgrade to Authorization Code flow for user-specific Spotify features later.

## Current Scaffold Notes

- The frontend includes the routed flow, shared Boothify session state, the sketch-style design system, and Spotify search/selection wiring through the backend.
- The backend includes modular routes, controllers, configuration, auth, and services for Spotify metadata search with mock fallback.
- Spotify export logic is intentionally separated from Spotify metadata logic. Full-track export is restricted by Spotify licensing and Web API limitations, so Boothify only scaffolds metadata and preview-safe fallback handling at this stage.

## Next Build Steps

Suggested next implementation phases:

1. Real webcam capture and countdown controls
2. Strip composition with actual captured image assets
3. GIF/video generation pipeline and download handlers
4. Optional Spotify Authorization Code upgrade for user-linked experiences
