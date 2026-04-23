import { getSpotifyClientConfig, searchSpotifyMetadata } from '../services/spotifyService.js';

export function getSpotifyConfig(_request, response) {
  response.json(getSpotifyClientConfig());
}

export async function searchTracks(request, response) {
  try {
    const query = request.query.q || '';
    const limit = Number.parseInt(request.query.limit, 10) || 8;
    const result = await searchSpotifyMetadata(query, { limit });

    response.json(result);
  } catch (error) {
    response.status(500).json({
      message: 'Unable to search Spotify metadata.',
      error: error.message
    });
  }
}
