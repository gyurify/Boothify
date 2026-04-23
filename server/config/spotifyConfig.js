const SPOTIFY_ACCOUNTS_BASE_URL = 'https://accounts.spotify.com';
const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';

function readBooleanFlag(value) {
  return String(value || '')
    .trim()
    .toLowerCase() === 'true';
}

export function getSpotifyConfig() {
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim() || '';
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim() || '';
  const redirectUri =
    process.env.SPOTIFY_REDIRECT_URI?.trim() || 'http://localhost:5173/auth/spotify/callback';
  const market = process.env.SPOTIFY_MARKET?.trim() || 'US';
  const hasClientCredentials = Boolean(clientId && clientSecret);
  const forceMockMode = readBooleanFlag(process.env.SPOTIFY_USE_MOCK_DATA);
  const useMockData = forceMockMode || !hasClientCredentials;

  return {
    accountsBaseUrl: SPOTIFY_ACCOUNTS_BASE_URL,
    apiBaseUrl: SPOTIFY_API_BASE_URL,
    clientId,
    clientSecret,
    forceMockMode,
    hasClientCredentials,
    market,
    redirectUri,
    useMockData
  };
}

export function getSpotifyPublicConfig() {
  const config = getSpotifyConfig();

  return {
    checked: true,
    hasClientCredentials: config.hasClientCredentials,
    market: config.market,
    mode: config.useMockData ? 'mock' : 'client-credentials',
    redirectUri: config.redirectUri,
    useMockData: config.useMockData,
    note: config.useMockData
      ? 'Spotify search is running in mock mode. Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to switch on real search.'
      : 'Spotify app-level track search is enabled with Client Credentials. Replace this with Authorization Code flow later if you need user-specific Spotify access.'
  };
}

