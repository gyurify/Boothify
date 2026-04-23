import { createContext, useContext, useMemo, useReducer } from 'react';
import {
  APP_LIMITS,
  APP_ROUTES,
  SAMPLE_SPOTIFY_TRACKS,
  STRIP_LAYOUTS,
  WORKFLOW_STEPS,
  getStripLayoutById
} from './boothifyConfig.js';

const BoothifyContext = createContext(null);

const SHOT_SWATCHES = ['#ffd761', '#70d7c7', '#8fc5ff', '#ff9bc2', '#ff926d'];

function createInitialGenerationState() {
  return {
    status: 'idle',
    previewType: 'gif',
    previewAsset: null,
    downloads: {
      motion: null,
      strip: null,
      bundle: null
    }
  };
}

function createInitialSessionState() {
  return {
    sessionId: `boothify-${Date.now()}`,
    spotifyQuery: '',
    selectedTrackId: null,
    clipLengthSeconds: APP_LIMITS.defaultClipSeconds,
    selectedLayoutId: STRIP_LAYOUTS[0].id,
    capturedShots: [],
    selectedStripPhotoIds: [],
    generation: createInitialGenerationState()
  };
}

function resetGeneration(state) {
  return {
    ...state,
    generation: createInitialGenerationState()
  };
}

function findTrackById(trackId) {
  return SAMPLE_SPOTIFY_TRACKS.find((track) => track.id === trackId) || null;
}

function boothifyReducer(state, action) {
  switch (action.type) {
    case 'SET_SPOTIFY_QUERY':
      return {
        ...state,
        spotifyQuery: action.payload
      };

    case 'SELECT_TRACK':
      return resetGeneration({
        ...state,
        selectedTrackId: action.payload
      });

    case 'SET_CLIP_LENGTH':
      return resetGeneration({
        ...state,
        clipLengthSeconds: Math.min(
          APP_LIMITS.maxClipSeconds,
          Math.max(APP_LIMITS.minClipSeconds, action.payload)
        )
      });

    case 'SELECT_LAYOUT': {
      const nextLayout = getStripLayoutById(action.payload);

      return resetGeneration({
        ...state,
        selectedLayoutId: nextLayout.id,
        selectedStripPhotoIds: state.selectedStripPhotoIds.slice(0, nextLayout.photoCount)
      });
    }

    case 'ADD_MOCK_SHOT': {
      if (state.capturedShots.length >= APP_LIMITS.maxShots) {
        return state;
      }

      const shotIndex = state.capturedShots.length;
      const nextShotNumber = shotIndex + 1;
      const nextShot = {
        id: `shot-${Date.now()}-${nextShotNumber}`,
        label: `Shot ${String(nextShotNumber).padStart(2, '0')}`,
        tone: SHOT_SWATCHES[shotIndex % SHOT_SWATCHES.length],
        capturedAt: new Date().toISOString()
      };

      return resetGeneration({
        ...state,
        capturedShots: [...state.capturedShots, nextShot]
      });
    }

    case 'REMOVE_CAPTURED_SHOT': {
      const nextShots = state.capturedShots.filter((shot) => shot.id !== action.payload);
      const nextSelectedStripPhotoIds = state.selectedStripPhotoIds.filter(
        (shotId) => shotId !== action.payload
      );

      return resetGeneration({
        ...state,
        capturedShots: nextShots,
        selectedStripPhotoIds: nextSelectedStripPhotoIds
      });
    }

    case 'CLEAR_CAPTURED_SHOTS':
      return resetGeneration({
        ...state,
        capturedShots: [],
        selectedStripPhotoIds: []
      });

    case 'TOGGLE_STRIP_PHOTO': {
      const layout = getStripLayoutById(state.selectedLayoutId);
      const isAlreadySelected = state.selectedStripPhotoIds.includes(action.payload);
      const shotExists = state.capturedShots.some((shot) => shot.id === action.payload);

      if (!shotExists) {
        return state;
      }

      if (isAlreadySelected) {
        return resetGeneration({
          ...state,
          selectedStripPhotoIds: state.selectedStripPhotoIds.filter(
            (shotId) => shotId !== action.payload
          )
        });
      }

      if (state.selectedStripPhotoIds.length >= layout.photoCount) {
        return state;
      }

      return resetGeneration({
        ...state,
        selectedStripPhotoIds: [...state.selectedStripPhotoIds, action.payload]
      });
    }

    case 'CLEAR_STRIP_SELECTION':
      return resetGeneration({
        ...state,
        selectedStripPhotoIds: []
      });

    case 'GENERATE_PREVIEW_PLACEHOLDER': {
      const selectedLayout = getStripLayoutById(state.selectedLayoutId);

      if (state.selectedStripPhotoIds.length !== selectedLayout.photoCount) {
        return state;
      }

      const selectedTrack = findTrackById(state.selectedTrackId);
      const assetStem = `${selectedLayout.id}-${Date.now()}`;

      return {
        ...state,
        generation: {
          status: 'ready',
          previewType: 'gif',
          previewAsset: {
            id: `preview-${assetStem}`,
            label: `${selectedLayout.label} preview`,
            soundtrackLabel: selectedTrack
              ? `${selectedTrack.title} - ${selectedTrack.artist}`
              : 'No soundtrack selected',
            clipLengthSeconds: state.clipLengthSeconds,
            shotCount: state.selectedStripPhotoIds.length,
            note: selectedTrack?.previewUrl
              ? 'Preview-safe Spotify audio is available for this selection.'
              : 'No Spotify preview clip is available, so export audio will need a fallback source.'
          },
          downloads: {
            motion: {
              label: 'GIF / video with song',
              filename: `${assetStem}-motion.mp4`
            },
            strip: {
              label: 'Photo strip only',
              filename: `${assetStem}-strip.png`
            },
            bundle: {
              label: 'Both assets',
              filename: `${assetStem}-bundle.zip`
            }
          }
        }
      };
    }

    case 'RESET_SESSION':
      return createInitialSessionState();

    default:
      return state;
  }
}

export function BoothifyProvider({ children }) {
  const [session, dispatch] = useReducer(boothifyReducer, undefined, createInitialSessionState);

  const value = useMemo(
    () => {
      const selectedTrack = findTrackById(session.selectedTrackId);
      const selectedLayout = getStripLayoutById(session.selectedLayoutId);
      const normalizedQuery = session.spotifyQuery.trim().toLowerCase();
      const filteredTracks = normalizedQuery
        ? SAMPLE_SPOTIFY_TRACKS.filter((track) =>
            `${track.title} ${track.artist}`.toLowerCase().includes(normalizedQuery)
          )
        : SAMPLE_SPOTIFY_TRACKS;
      const selectedStripShots = session.selectedStripPhotoIds
        .map((shotId) => session.capturedShots.find((shot) => shot.id === shotId))
        .filter(Boolean);

      const progress = {
        hasSelectedTrack: Boolean(selectedTrack),
        hasEnoughShotsForLayout: session.capturedShots.length >= selectedLayout.photoCount,
        hasExactStripSelection: session.selectedStripPhotoIds.length === selectedLayout.photoCount,
        hasGeneratedPreview: session.generation.status === 'ready'
      };

      const routeAccess = {
        landing: {
          allowed: true,
          fallbackPath: APP_ROUTES.landing
        },
        spotify: {
          allowed: true,
          fallbackPath: APP_ROUTES.landing
        },
        stripSelection: {
          allowed: progress.hasSelectedTrack,
          fallbackPath: APP_ROUTES.spotify
        },
        camera: {
          allowed: progress.hasSelectedTrack,
          fallbackPath: progress.hasSelectedTrack
            ? APP_ROUTES.stripSelection
            : APP_ROUTES.spotify
        },
        review: {
          allowed: session.capturedShots.length > 0,
          fallbackPath: APP_ROUTES.camera
        },
        generation: {
          allowed: progress.hasExactStripSelection,
          fallbackPath: APP_ROUTES.review
        },
        download: {
          allowed: progress.hasGeneratedPreview,
          fallbackPath: APP_ROUTES.generation
        }
      };

      const workflow = WORKFLOW_STEPS.map((step) => {
        const completenessMap = {
          landing: true,
          spotify: progress.hasSelectedTrack,
          stripSelection: Boolean(selectedLayout),
          camera: progress.hasEnoughShotsForLayout,
          review: progress.hasExactStripSelection,
          generation: progress.hasGeneratedPreview,
          download: progress.hasGeneratedPreview
        };

        const unlockedMap = {
          landing: true,
          spotify: true,
          stripSelection: routeAccess.stripSelection.allowed,
          camera: routeAccess.camera.allowed,
          review: routeAccess.review.allowed,
          generation: routeAccess.generation.allowed,
          download: routeAccess.download.allowed
        };

        return {
          ...step,
          complete: completenessMap[step.id],
          unlocked: unlockedMap[step.id]
        };
      });

      return {
        appLimits: APP_LIMITS,
        availableLayouts: STRIP_LAYOUTS,
        availableTracks: filteredTracks,
        workflow,
        routeAccess,
        progress,
        session,
        generation: session.generation,
        selectedTrack,
        selectedLayout,
        selectedStripShots,
        setSpotifyQuery: (query) => dispatch({ type: 'SET_SPOTIFY_QUERY', payload: query }),
        selectTrack: (trackId) => dispatch({ type: 'SELECT_TRACK', payload: trackId }),
        setSongClipLength: (seconds) =>
          dispatch({ type: 'SET_CLIP_LENGTH', payload: Number(seconds) }),
        selectLayout: (layoutId) => dispatch({ type: 'SELECT_LAYOUT', payload: layoutId }),
        addMockShot: () => dispatch({ type: 'ADD_MOCK_SHOT' }),
        removeCapturedShot: (shotId) =>
          dispatch({ type: 'REMOVE_CAPTURED_SHOT', payload: shotId }),
        clearCapturedShots: () => dispatch({ type: 'CLEAR_CAPTURED_SHOTS' }),
        toggleStripPhoto: (shotId) => dispatch({ type: 'TOGGLE_STRIP_PHOTO', payload: shotId }),
        clearStripSelection: () => dispatch({ type: 'CLEAR_STRIP_SELECTION' }),
        generatePreviewPlaceholder: () => dispatch({ type: 'GENERATE_PREVIEW_PLACEHOLDER' }),
        resetSession: () => dispatch({ type: 'RESET_SESSION' })
      };
    },
    [session]
  );

  return <BoothifyContext.Provider value={value}>{children}</BoothifyContext.Provider>;
}

export function useBoothify() {
  const context = useContext(BoothifyContext);

  if (!context) {
    throw new Error('useBoothify must be used within a BoothifyProvider.');
  }

  return context;
}
