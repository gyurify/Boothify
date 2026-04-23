# Boothify

Boothify is a full-stack photobooth web app scaffold with a playful React frontend and an Express backend. The product flow is designed around Spotify-assisted photo sessions: pick a song, capture up to 10 shots, choose photos for a strip layout, generate a strip plus animated export, and download the result.

This repository currently contains the base project structure and boilerplate for the first build step.

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
    index.html
    package.json
    vite.config.js
    src/
      App.jsx
      main.jsx
      components/
        AppShell.jsx
        StepCard.jsx
        StripLayoutGallery.jsx
      context/
        BoothifyContext.jsx
      pages/
        HomePage.jsx
        NotFoundPage.jsx
      styles/
        app.css
        global.css
  server/
    package.json
    server.js
    controllers/
      boothController.js
      healthController.js
      spotifyController.js
    routes/
      boothRoutes.js
      healthRoutes.js
      spotifyRoutes.js
    services/
      boothService.js
      spotifyService.js
  .env.example
  .gitignore
  README.md
```

## Setup

1. Copy `.env.example` to a local `.env` file at the project root and fill in the Spotify credentials when ready.
2. Install frontend dependencies:

   ```bash
   cd client
   npm install
   npm run dev
   ```

3. In a second terminal, install backend dependencies:

   ```bash
   cd server
   npm install
   npm run dev
   ```

4. Open the Vite app in your browser. By default, the frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

## Current Scaffold Notes

- The frontend includes a playful starter UI, React Router setup, global state, strip layout definitions, and a backend health check.
- The backend includes modular routes, controllers, and services for health checks, booth session placeholders, and Spotify metadata placeholders.
- Spotify export logic is intentionally separated from Spotify metadata logic. Full-track export is restricted by Spotify licensing and Web API limitations, so only metadata and preview-based fallback logic are scaffolded at this stage.

## Next Build Steps

Suggested next implementation phases:

1. Camera capture flow and shot management
2. Strip photo selection and composition
3. Spotify search/auth flow with preview audio fallback
4. GIF/video generation pipeline and downloads

