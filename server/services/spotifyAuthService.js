import { Buffer } from 'node:buffer';
import { getSpotifyConfig } from '../config/spotifyConfig.js';

let cachedAppToken = null;

function hasValidCachedToken() {
  return Boolean(cachedAppToken && cachedAppToken.expiresAt > Date.now());
}

// For this step, Boothify only needs app-level Spotify search metadata, so the
// Client Credentials grant is enough when credentials are present. If you later
// need user libraries, playback controls, or user-specific recommendations,
// replace this token flow with Authorization Code + refresh tokens.
export async function getSpotifyAppAccessToken() {
  if (hasValidCachedToken()) {
    return cachedAppToken.accessToken;
  }

  const config = getSpotifyConfig();

  if (config.useMockData) {
    return null;
  }

  const response = await fetch(`${config.accountsBaseUrl}/api/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Spotify token request failed with ${response.status}: ${errorText}`);
  }

  const payload = await response.json();

  cachedAppToken = {
    accessToken: payload.access_token,
    expiresAt: Date.now() + Math.max(payload.expires_in - 60, 60) * 1000
  };

  return cachedAppToken.accessToken;
}

