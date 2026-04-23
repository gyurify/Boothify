function buildMockArtworkDataUrl(label, accent, paper) {
  const initials = label
    .split(/\s+/)
    .map((word) => word[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
      <rect width="240" height="240" rx="26" fill="${paper}" />
      <rect x="18" y="18" width="204" height="204" rx="24" fill="${accent}" />
      <circle cx="182" cy="58" r="18" fill="rgba(255,255,255,0.55)" />
      <path d="M44 166c42-20 80-34 136-48" stroke="#211b16" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.2" />
      <text
        x="50%"
        y="57%"
        text-anchor="middle"
        fill="#211b16"
        font-family="Arial, sans-serif"
        font-size="58"
        font-weight="700"
      >
        ${initials}
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// This file is the clean offline fallback for Spotify search development.
// Replace or expand these fixtures if you want richer local demos without
// touching the auth or API search services.
const MOCK_TRACKS = [
  {
    id: 'mock-midnight-polaroid',
    title: 'Midnight Polaroid',
    artist: 'The Afterglow Club',
    albumName: 'Flash Memories',
    artworkUrl: buildMockArtworkDataUrl('Midnight Polaroid', '#ffd470', '#fff6da'),
    durationMs: 198000,
    durationLabel: '3:18',
    previewUrl: 'https://p.scdn.co/mp3-preview/example-midnight-polaroid',
    externalUrl: 'https://open.spotify.com/track/mock-midnight-polaroid'
  },
  {
    id: 'mock-neon-sidewalk',
    title: 'Neon Sidewalk',
    artist: 'Paper Hearts',
    albumName: 'City Confetti',
    artworkUrl: buildMockArtworkDataUrl('Neon Sidewalk', '#8fc5ff', '#edf6ff'),
    durationMs: 177000,
    durationLabel: '2:57',
    previewUrl: 'https://p.scdn.co/mp3-preview/example-neon-sidewalk',
    externalUrl: 'https://open.spotify.com/track/mock-neon-sidewalk'
  },
  {
    id: 'mock-film-roll-summer',
    title: 'Film Roll Summer',
    artist: 'Soda Arcade',
    albumName: 'Boardwalk Tape',
    artworkUrl: buildMockArtworkDataUrl('Film Roll Summer', '#ff9bc2', '#fff0f6'),
    durationMs: 242000,
    durationLabel: '4:02',
    previewUrl: null,
    externalUrl: 'https://open.spotify.com/track/mock-film-roll-summer'
  },
  {
    id: 'mock-confetti-static',
    title: 'Confetti Static',
    artist: 'Weekend Receiver',
    albumName: 'Static Bloom',
    artworkUrl: buildMockArtworkDataUrl('Confetti Static', '#70d7c7', '#e8fffa'),
    durationMs: 221000,
    durationLabel: '3:41',
    previewUrl: 'https://p.scdn.co/mp3-preview/example-confetti-static',
    externalUrl: 'https://open.spotify.com/track/mock-confetti-static'
  },
  {
    id: 'mock-disco-receipt',
    title: 'Disco Receipt',
    artist: 'Velvet Checkout',
    albumName: 'Weekend Proof',
    artworkUrl: buildMockArtworkDataUrl('Disco Receipt', '#ffb282', '#fff1e8'),
    durationMs: 205000,
    durationLabel: '3:25',
    previewUrl: null,
    externalUrl: 'https://open.spotify.com/track/mock-disco-receipt'
  },
  {
    id: 'mock-soft-flash',
    title: 'Soft Flash',
    artist: 'Instant Camera Club',
    albumName: 'Silver Halide',
    artworkUrl: buildMockArtworkDataUrl('Soft Flash', '#c7b5ff', '#f3efff'),
    durationMs: 186000,
    durationLabel: '3:06',
    previewUrl: 'https://p.scdn.co/mp3-preview/example-soft-flash',
    externalUrl: 'https://open.spotify.com/track/mock-soft-flash'
  }
];

export function searchSpotifyMockTracks(query, { limit = 8 } = {}) {
  const normalizedQuery = String(query || '').trim().toLowerCase();

  if (!normalizedQuery) {
    return MOCK_TRACKS.slice(0, limit);
  }

  return MOCK_TRACKS.filter((track) =>
    `${track.title} ${track.artist} ${track.albumName}`.toLowerCase().includes(normalizedQuery)
  ).slice(0, limit);
}

