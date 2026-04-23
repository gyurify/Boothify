export const APP_ROUTES = {
  landing: '/',
  spotify: '/spotify',
  stripSelection: '/strip-selection',
  camera: '/camera',
  review: '/review',
  generation: '/generation',
  download: '/download'
};

export const APP_LIMITS = {
  defaultClipSeconds: 15,
  minClipSeconds: 5,
  maxClipSeconds: 30,
  maxShots: 10
};

export const WORKFLOW_STEPS = [
  {
    id: 'landing',
    label: 'Landing',
    title: 'Start session',
    path: APP_ROUTES.landing,
    description: 'Set the mood and begin a new Boothify session.'
  },
  {
    id: 'spotify',
    label: 'Spotify',
    title: 'Select song',
    path: APP_ROUTES.spotify,
    description: 'Choose Spotify metadata and a preview-safe clip plan.'
  },
  {
    id: 'stripSelection',
    label: 'Strip',
    title: 'Choose layout',
    path: APP_ROUTES.stripSelection,
    description: 'Pick the strip format that determines how many photos you need.'
  },
  {
    id: 'camera',
    label: 'Camera',
    title: 'Capture photos',
    path: APP_ROUTES.camera,
    description: 'Take up to ten shots inside the booth.'
  },
  {
    id: 'review',
    label: 'Review',
    title: 'Compose strip',
    path: APP_ROUTES.review,
    description: 'Choose which captured shots go into the final layout.'
  },
  {
    id: 'generation',
    label: 'Generate',
    title: 'Render preview',
    path: APP_ROUTES.generation,
    description: 'Prepare the GIF or video preview plus strip output.'
  },
  {
    id: 'download',
    label: 'Download',
    title: 'Deliver assets',
    path: APP_ROUTES.download,
    description: 'Offer the motion export, strip-only export, or both.'
  }
];

export const STRIP_LAYOUTS = [
  {
    id: '2x6-1x2',
    label: '1 x 2 strip',
    stripSizeLabel: '2 x 6 in',
    photoSizeLabel: '2 x 2.5 in',
    columns: 1,
    rows: 2,
    photoCount: 2
  },
  {
    id: '2x6-1x3',
    label: '1 x 3 strip',
    stripSizeLabel: '2 x 6 in',
    photoSizeLabel: '2 x 1.7 in',
    columns: 1,
    rows: 3,
    photoCount: 3
  },
  {
    id: '2x6-1x4',
    label: '1 x 4 strip',
    stripSizeLabel: '2 x 6 in',
    photoSizeLabel: '2 x 1.3 in',
    columns: 1,
    rows: 4,
    photoCount: 4
  },
  {
    id: '2x6-1x5',
    label: '1 x 5 strip',
    stripSizeLabel: '2 x 6 in',
    photoSizeLabel: '2 x 1.0 in',
    columns: 1,
    rows: 5,
    photoCount: 5
  },
  {
    id: '2x8-1x2',
    label: 'Tall 1 x 2 strip',
    stripSizeLabel: '2 x 8 in',
    photoSizeLabel: '2 x 3.5 in',
    columns: 1,
    rows: 2,
    photoCount: 2
  },
  {
    id: '2x8-1x3',
    label: 'Tall 1 x 3 strip',
    stripSizeLabel: '2 x 8 in',
    photoSizeLabel: '2 x 2.4 in',
    columns: 1,
    rows: 3,
    photoCount: 3
  },
  {
    id: '2x8-1x4',
    label: 'Tall 1 x 4 strip',
    stripSizeLabel: '2 x 8 in',
    photoSizeLabel: '2 x 1.8 in',
    columns: 1,
    rows: 4,
    photoCount: 4
  },
  {
    id: '2x8-1x5',
    label: 'Tall 1 x 5 strip',
    stripSizeLabel: '2 x 8 in',
    photoSizeLabel: '2 x 1.4 in',
    columns: 1,
    rows: 5,
    photoCount: 5
  },
  {
    id: '2x6-2x3',
    label: 'Grid 2 x 3 strip',
    stripSizeLabel: '2 x 6 in',
    photoSizeLabel: '1 x 2 in',
    columns: 2,
    rows: 3,
    photoCount: 6
  },
  {
    id: '2x8-2x3',
    label: 'Tall grid 2 x 3 strip',
    stripSizeLabel: '2 x 8 in',
    photoSizeLabel: '1 x 2.6 in',
    columns: 2,
    rows: 3,
    photoCount: 6
  }
];

export const SAMPLE_SPOTIFY_TRACKS = [
  {
    id: 'track-midnight',
    title: 'Midnight Polaroid',
    artist: 'The Afterglow Club',
    durationLabel: '3:18',
    previewUrl: 'https://p.scdn.co/mp3-preview/example-midnight'
  },
  {
    id: 'track-neon',
    title: 'Neon Sidewalk',
    artist: 'Paper Hearts',
    durationLabel: '2:57',
    previewUrl: 'https://p.scdn.co/mp3-preview/example-neon'
  },
  {
    id: 'track-film',
    title: 'Film Roll Summer',
    artist: 'Soda Arcade',
    durationLabel: '4:02',
    previewUrl: null
  },
  {
    id: 'track-confetti',
    title: 'Confetti Static',
    artist: 'Weekend Receiver',
    durationLabel: '3:41',
    previewUrl: 'https://p.scdn.co/mp3-preview/example-confetti'
  }
];

export function getStripLayoutById(layoutId) {
  return STRIP_LAYOUTS.find((layout) => layout.id === layoutId) || STRIP_LAYOUTS[0];
}

