import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { fetchSpotifyClientConfig, searchSpotifyTracks as requestSpotifyTracks } from '../services/spotifyApi.js';
import {
  createDefaultSongClip,
  getSongClipSelection,
  setSongClipEnd as buildSongClipEnd,
  setSongClipLength as buildSongClipLength,
  setSongClipStart as buildSongClipStart,
  setSongClipTiming as buildSongClipTiming
} from '../utils/songClip.js';
import {
  APP_LIMITS,
  APP_ROUTES,
  DEFAULT_SPOTIFY_RESULTS_LIMIT,
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

function createInitialSpotifyState() {
  return {
    auth: {
      checked: false,
      hasClientCredentials: false,
      market: 'US',
      mode: 'mock',
      note: 'Spotify configuration has not been loaded yet.',
      redirectUri: '',
      useMockData: true
    },
    error: null,
    hasSearched: false,
    items: [],
    note: 'Search for a track title or artist to load Spotify results.',
    query: '',
    source: 'mock',
    status: 'idle'
  };
}

function createInitialSessionState() {
  return {
    capturedShots: [],
    generation: createInitialGenerationState(),
    selectedLayoutId: STRIP_LAYOUTS[0].id,
    songClip: createDefaultSongClip(null, APP_LIMITS),
    selectedStripPhotoIds: [],
    selectedTrack: null,
    sessionId: `boothify-${Date.now()}`,
    spotify: createInitialSpotifyState()
  };
}

function resetGeneration(state) {
  return {
    ...state,
    generation: createInitialGenerationState()
  };
}

function createSearchErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Unable to search Spotify tracks right now.'
  );
}

function syncGenerationWithSongClip(generation, rawSongClip, selectedTrack) {
  if (generation.status !== 'ready' || !generation.previewAsset) {
    return generation;
  }

  const songClip = getSongClipSelection(rawSongClip, selectedTrack, APP_LIMITS);

  return {
    ...generation,
    previewAsset: {
      ...generation.previewAsset,
      clipEndSeconds: songClip.endSeconds,
      clipLengthSeconds: songClip.lengthSeconds,
      clipStartSeconds: songClip.startSeconds,
      clipWindowLabel: songClip.timingLabel
    }
  };
}

function boothifyReducer(state, action) {
  switch (action.type) {
    case 'SET_SPOTIFY_QUERY':
      return {
        ...state,
        spotify: {
          ...state.spotify,
          query: action.payload
        }
      };

    case 'SPOTIFY_CONFIG_LOADED':
      return {
        ...state,
        spotify: {
          ...state.spotify,
          auth: {
            ...state.spotify.auth,
            ...action.payload
          },
          note: action.payload.note || state.spotify.note
        }
      };

    case 'SPOTIFY_CONFIG_FAILED':
      return {
        ...state,
        spotify: {
          ...state.spotify,
          auth: {
            ...state.spotify.auth,
            checked: true,
            mode: 'mock',
            useMockData: true
          },
          note: action.payload
        }
      };

    case 'CLEAR_SPOTIFY_RESULTS':
      return {
        ...state,
        spotify: {
          ...state.spotify,
          error: null,
          hasSearched: false,
          items: [],
          note: 'Search for a track title or artist to load Spotify results.',
          source: state.spotify.auth.useMockData ? 'mock' : 'spotify-api',
          status: 'idle'
        }
      };

    case 'SPOTIFY_SEARCH_STARTED':
      return {
        ...state,
        spotify: {
          ...state.spotify,
          error: null,
          status: 'loading'
        }
      };

    case 'SPOTIFY_SEARCH_SUCCEEDED': {
      const refreshedSelectedTrack = state.selectedTrack
        ? action.payload.items.find((track) => track.id === state.selectedTrack.id) || state.selectedTrack
        : null;
      const nextSongClip = refreshedSelectedTrack
        ? getSongClipSelection(state.songClip, refreshedSelectedTrack, APP_LIMITS)
        : state.songClip;

      return {
        ...state,
        generation: refreshedSelectedTrack
          ? syncGenerationWithSongClip(state.generation, nextSongClip, refreshedSelectedTrack)
          : state.generation,
        songClip: refreshedSelectedTrack
          ? {
              endSeconds: nextSongClip.endSeconds,
              startSeconds: nextSongClip.startSeconds
            }
          : state.songClip,
        selectedTrack: refreshedSelectedTrack,
        spotify: {
          ...state.spotify,
          auth: {
            ...state.spotify.auth,
            ...(action.payload.auth || {})
          },
          error: null,
          hasSearched: true,
          items: action.payload.items,
          note: action.payload.note || state.spotify.note,
          source: action.payload.source || state.spotify.source,
          status: 'ready'
        }
      };
    }

    case 'SPOTIFY_SEARCH_FAILED':
      return {
        ...state,
        spotify: {
          ...state.spotify,
          error: action.payload,
          hasSearched: true,
          items: [],
          note: action.payload,
          status: 'error'
        }
      };

    case 'SELECT_TRACK':
      return resetGeneration({
        ...state,
        songClip: createDefaultSongClip(action.payload, APP_LIMITS),
        selectedTrack: action.payload
      });

    case 'SET_SONG_CLIP_TIMING': {
      const nextSongClip = buildSongClipTiming(
        state.songClip,
        state.selectedTrack,
        APP_LIMITS,
        action.payload
      );

      return {
        ...state,
        generation: syncGenerationWithSongClip(state.generation, nextSongClip, state.selectedTrack),
        songClip: nextSongClip
      };
    }

    case 'SET_SONG_CLIP_LENGTH': {
      const nextSongClip = buildSongClipLength(
        state.songClip,
        state.selectedTrack,
        APP_LIMITS,
        action.payload
      );

      return {
        ...state,
        generation: syncGenerationWithSongClip(state.generation, nextSongClip, state.selectedTrack),
        songClip: nextSongClip
      };
    }

    case 'SET_SONG_CLIP_START': {
      const nextSongClip = buildSongClipStart(
        state.songClip,
        state.selectedTrack,
        APP_LIMITS,
        action.payload
      );

      return {
        ...state,
        generation: syncGenerationWithSongClip(state.generation, nextSongClip, state.selectedTrack),
        songClip: nextSongClip
      };
    }

    case 'SET_SONG_CLIP_END': {
      const nextSongClip = buildSongClipEnd(
        state.songClip,
        state.selectedTrack,
        APP_LIMITS,
        action.payload
      );

      return {
        ...state,
        generation: syncGenerationWithSongClip(state.generation, nextSongClip, state.selectedTrack),
        songClip: nextSongClip
      };
    }

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
        capturedAt: new Date().toISOString(),
        id: `shot-${Date.now()}-${nextShotNumber}`,
        label: `Shot ${String(nextShotNumber).padStart(2, '0')}`,
        tone: SHOT_SWATCHES[shotIndex % SHOT_SWATCHES.length]
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
      const songClip = getSongClipSelection(state.songClip, state.selectedTrack, APP_LIMITS);

      if (state.selectedStripPhotoIds.length !== selectedLayout.photoCount) {
        return state;
      }

      const assetStem = `${selectedLayout.id}-${Date.now()}`;

      return {
        ...state,
        generation: {
          status: 'ready',
          previewType: 'gif',
          previewAsset: {
            clipEndSeconds: songClip.endSeconds,
            clipLengthSeconds: songClip.lengthSeconds,
            clipStartSeconds: songClip.startSeconds,
            clipWindowLabel: songClip.timingLabel,
            id: `preview-${assetStem}`,
            label: `${selectedLayout.label} preview`,
            note: state.selectedTrack?.previewUrl
              ? 'Preview-safe Spotify audio is available for this selection.'
              : 'No Spotify preview clip is available, so export audio will need a fallback source.',
            shotCount: state.selectedStripPhotoIds.length,
            soundtrackLabel: state.selectedTrack
              ? `${state.selectedTrack.title} - ${state.selectedTrack.artist}`
              : 'No soundtrack selected'
          },
          downloads: {
            bundle: {
              filename: `${assetStem}-bundle.zip`,
              label: 'Both assets'
            },
            motion: {
              filename: `${assetStem}-motion.mp4`,
              label: 'GIF / video with song'
            },
            strip: {
              filename: `${assetStem}-strip.png`,
              label: 'Photo strip only'
            }
          }
        }
      };
    }

    case 'RESET_SESSION': {
      const nextState = createInitialSessionState();

      return {
        ...nextState,
        spotify: {
          ...nextState.spotify,
          auth: state.spotify.auth
        }
      };
    }

    default:
      return state;
  }
}

export function BoothifyProvider({ children }) {
  const [session, dispatch] = useReducer(boothifyReducer, undefined, createInitialSessionState);

  const setSpotifyQuery = useCallback((query) => {
    dispatch({ type: 'SET_SPOTIFY_QUERY', payload: query });
  }, []);

  const loadSpotifyConfiguration = useCallback(async () => {
    try {
      const config = await fetchSpotifyClientConfig();
      dispatch({ type: 'SPOTIFY_CONFIG_LOADED', payload: config });
      return config;
    } catch (error) {
      const message = createSearchErrorMessage(error);
      dispatch({ type: 'SPOTIFY_CONFIG_FAILED', payload: message });
      return null;
    }
  }, []);

  const searchSpotifyTracks = useCallback(async (query, { limit = DEFAULT_SPOTIFY_RESULTS_LIMIT } = {}) => {
    const normalizedQuery = String(query || '').trim();

    if (!normalizedQuery) {
      dispatch({ type: 'CLEAR_SPOTIFY_RESULTS' });
      return null;
    }

    dispatch({ type: 'SPOTIFY_SEARCH_STARTED' });

    try {
      const result = await requestSpotifyTracks(normalizedQuery, { limit });
      dispatch({ type: 'SPOTIFY_SEARCH_SUCCEEDED', payload: result });
      return result;
    } catch (error) {
      const message = createSearchErrorMessage(error);
      dispatch({ type: 'SPOTIFY_SEARCH_FAILED', payload: message });
      return null;
    }
  }, []);

  const selectTrack = useCallback((track) => {
    dispatch({ type: 'SELECT_TRACK', payload: track });
  }, []);

  const setSongClipTiming = useCallback((seconds) => {
    dispatch({ type: 'SET_SONG_CLIP_TIMING', payload: Number(seconds) });
  }, []);

  const setSongClipLength = useCallback((seconds) => {
    dispatch({ type: 'SET_SONG_CLIP_LENGTH', payload: Number(seconds) });
  }, []);

  const setSongClipStart = useCallback((seconds) => {
    dispatch({ type: 'SET_SONG_CLIP_START', payload: Number(seconds) });
  }, []);

  const setSongClipEnd = useCallback((seconds) => {
    dispatch({ type: 'SET_SONG_CLIP_END', payload: Number(seconds) });
  }, []);

  const selectLayout = useCallback((layoutId) => {
    dispatch({ type: 'SELECT_LAYOUT', payload: layoutId });
  }, []);

  const addMockShot = useCallback(() => {
    dispatch({ type: 'ADD_MOCK_SHOT' });
  }, []);

  const removeCapturedShot = useCallback((shotId) => {
    dispatch({ type: 'REMOVE_CAPTURED_SHOT', payload: shotId });
  }, []);

  const clearCapturedShots = useCallback(() => {
    dispatch({ type: 'CLEAR_CAPTURED_SHOTS' });
  }, []);

  const toggleStripPhoto = useCallback((shotId) => {
    dispatch({ type: 'TOGGLE_STRIP_PHOTO', payload: shotId });
  }, []);

  const clearStripSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_STRIP_SELECTION' });
  }, []);

  const generatePreviewPlaceholder = useCallback(() => {
    dispatch({ type: 'GENERATE_PREVIEW_PLACEHOLDER' });
  }, []);

  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET_SESSION' });
  }, []);

  const value = useMemo(() => {
    const selectedTrack = session.selectedTrack;
    const selectedLayout = getStripLayoutById(session.selectedLayoutId);
    const songClip = getSongClipSelection(session.songClip, selectedTrack, APP_LIMITS);
    const selectedStripShots = session.selectedStripPhotoIds
      .map((shotId) => session.capturedShots.find((shot) => shot.id === shotId))
      .filter(Boolean);
    const clipValidation = {
      isValid: songClip.isValid,
      note:
        songClip.rawTrackDurationSeconds > 0 &&
        songClip.rawTrackDurationSeconds < APP_LIMITS.defaultClipSeconds
          ? 'This track is shorter than 15 seconds, so the full track is selected.'
          : `Clip length must stay between ${songClip.minLengthSeconds}s and ${songClip.maxLengthSeconds}s.`
    };

    const progress = {
      hasEnoughShotsForLayout: session.capturedShots.length >= selectedLayout.photoCount,
      hasExactStripSelection: session.selectedStripPhotoIds.length === selectedLayout.photoCount,
      hasGeneratedPreview: session.generation.status === 'ready',
      hasSavedSongClip: Boolean(selectedTrack) && clipValidation.isValid,
      hasSelectedTrack: Boolean(selectedTrack)
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
        fallbackPath: progress.hasSelectedTrack ? APP_ROUTES.stripSelection : APP_ROUTES.spotify
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
        camera: progress.hasEnoughShotsForLayout,
        download: progress.hasGeneratedPreview && progress.hasSavedSongClip,
        generation: progress.hasGeneratedPreview,
        landing: true,
        review: progress.hasExactStripSelection,
        spotify: progress.hasSelectedTrack,
        stripSelection: Boolean(selectedLayout)
      };

      const unlockedMap = {
        camera: routeAccess.camera.allowed,
        download: routeAccess.download.allowed,
        generation: routeAccess.generation.allowed,
        landing: true,
        review: routeAccess.review.allowed,
        spotify: true,
        stripSelection: routeAccess.stripSelection.allowed
      };

      return {
        ...step,
        complete: completenessMap[step.id],
        unlocked: unlockedMap[step.id]
      };
    });

    return {
      addMockShot,
      appLimits: APP_LIMITS,
      availableLayouts: STRIP_LAYOUTS,
      availableTracks: session.spotify.items,
      clipValidation,
      clearCapturedShots,
      clearStripSelection,
      generatePreviewPlaceholder,
      generation: session.generation,
      loadSpotifyConfiguration,
      progress,
      removeCapturedShot,
      resetSession,
      routeAccess,
      searchSpotifyTracks,
      selectLayout,
      selectedLayout,
      songClip,
      selectedStripShots,
      selectedTrack,
      selectTrack,
      session,
      setSongClipEnd,
      setSongClipStart,
      setSongClipTiming,
      setSongClipLength,
      setSpotifyQuery,
      spotify: session.spotify,
      toggleStripPhoto,
      workflow
    };
  }, [
    addMockShot,
    clearCapturedShots,
    clearStripSelection,
    generatePreviewPlaceholder,
    loadSpotifyConfiguration,
    removeCapturedShot,
    resetSession,
    searchSpotifyTracks,
    selectLayout,
    selectTrack,
    session,
    setSongClipEnd,
    setSongClipStart,
    setSongClipTiming,
    setSongClipLength,
    setSpotifyQuery,
    toggleStripPhoto
  ]);

  return <BoothifyContext.Provider value={value}>{children}</BoothifyContext.Provider>;
}

export function useBoothify() {
  const context = useContext(BoothifyContext);

  if (!context) {
    throw new Error('useBoothify must be used within a BoothifyProvider.');
  }

  return context;
}
