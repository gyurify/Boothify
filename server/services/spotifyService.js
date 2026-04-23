const PLACEHOLDER_TRACK = {
  id: 'placeholder-track',
  title: 'Boothify Demo Track',
  artist: 'Preview Layer',
  albumArt: '',
  previewUrl: null,
  externalUrl: 'https://open.spotify.com'
};

export async function searchSpotifyMetadata(query) {
  return {
    source: 'spotify-metadata',
    query,
    items: query ? [PLACEHOLDER_TRACK] : [],
    note: 'Spotify metadata and export audio are separated by design. Use preview audio only when Spotify provides a preview URL.'
  };
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

