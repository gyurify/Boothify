import apiClient from './apiClient.js';

export async function fetchSpotifyClientConfig() {
  const response = await apiClient.get('/spotify/config');
  return response.data;
}

export async function searchSpotifyTracks(query, { limit = 8 } = {}) {
  const response = await apiClient.get('/spotify/search', {
    params: {
      limit,
      q: query
    }
  });

  return response.data;
}

