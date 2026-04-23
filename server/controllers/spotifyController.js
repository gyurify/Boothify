import { searchSpotifyMetadata } from '../services/spotifyService.js';

export async function searchTracks(request, response) {
  try {
    const query = request.query.q || '';
    const result = await searchSpotifyMetadata(query);

    response.json(result);
  } catch (error) {
    response.status(500).json({
      message: 'Unable to search Spotify metadata.',
      error: error.message
    });
  }
}

