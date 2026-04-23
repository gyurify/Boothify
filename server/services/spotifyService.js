import { getSpotifyConfig, getSpotifyPublicConfig } from '../config/spotifyConfig.js';
import { getSpotifyAppAccessToken } from './spotifyAuthService.js';
import { searchSpotifyMockTracks } from './spotifyMockData.js';

function clampLimit(limit) {
  return Math.min(Math.max(Number(limit) || 8, 1), 20);
}

function formatDuration(durationMs) {
  const totalSeconds = Math.max(0, Math.floor((durationMs || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${minutes}:${seconds}`;
}

function normalizeSpotifyTrack(track) {
  return {
    id: track.id,
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(', '),
    albumName: track.album?.name || '',
    artworkUrl: track.album?.images?.[1]?.url || track.album?.images?.[0]?.url || '',
    durationMs: track.duration_ms || 0,
    durationLabel: formatDuration(track.duration_ms || 0),
    previewUrl: track.preview_url,
    externalUrl: track.external_urls?.spotify || null
  };
}

async function searchSpotifyApiTracks(query, limit) {
  const config = getSpotifyConfig();
  const accessToken = await getSpotifyAppAccessToken();
  const searchUrl = new URL(`${config.apiBaseUrl}/search`);

  searchUrl.searchParams.set('q', query);
  searchUrl.searchParams.set('type', 'track');
  searchUrl.searchParams.set('limit', String(limit));
  searchUrl.searchParams.set('market', config.market);

  const response = await fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Spotify track search failed with ${response.status}: ${errorText}`);
  }

  const payload = await response.json();

  return (payload.tracks?.items || []).map(normalizeSpotifyTrack);
}

export function getSpotifyClientConfig() {
  return getSpotifyPublicConfig();
}

export async function searchSpotifyMetadata(query, { limit = 8 } = {}) {
  const normalizedQuery = String(query || '').trim();
  const cappedLimit = clampLimit(limit);
  const publicConfig = getSpotifyPublicConfig();

  if (!normalizedQuery) {
    return {
      auth: publicConfig,
      items: publicConfig.useMockData ? searchSpotifyMockTracks('', { limit: cappedLimit }) : [],
      note: publicConfig.useMockData
        ? 'Showing curated mock tracks until Spotify credentials are configured.'
        : 'Enter a song title or artist to search Spotify.',
      query: normalizedQuery,
      source: publicConfig.useMockData ? 'mock' : 'spotify-api'
    };
  }

  if (publicConfig.useMockData) {
    return {
      auth: publicConfig,
      items: searchSpotifyMockTracks(normalizedQuery, { limit: cappedLimit }),
      note: 'Mock Spotify results are active. Replace the placeholder env values with real credentials to hit Spotify search.',
      query: normalizedQuery,
      source: 'mock'
    };
  }

  try {
    const items = await searchSpotifyApiTracks(normalizedQuery, cappedLimit);

    return {
      auth: publicConfig,
      items,
      note: items.length
        ? 'Results came from Spotify app-level search.'
        : 'Spotify returned no tracks for that search.',
      query: normalizedQuery,
      source: 'spotify-api'
    };
  } catch (error) {
    return {
      auth: {
        ...publicConfig,
        mode: 'mock',
        useMockData: true
      },
      items: searchSpotifyMockTracks(normalizedQuery, { limit: cappedLimit }),
      note: `Spotify API search failed, so Boothify fell back to mock results. ${error.message}`,
      query: normalizedQuery,
      source: 'mock'
    };
  }
}

// Spotify Web API does not allow full-song download or export. This function is
// intentionally isolated so Boothify can fall back to preview audio or another
// legal audio source without mixing that concern into metadata search logic.
export async function resolveExportAudioSource(track) {
  if (track?.previewUrl) {
    return {
      mode: 'spotify-preview',
      clipUrl: track.previewUrl,
      note: 'Using the preview clip returned by Spotify.'
    };
  }

  return {
    mode: 'no-audio',
    clipUrl: null,
    note: 'No Spotify preview is available for this track, so a fallback export strategy is required.'
  };
}
