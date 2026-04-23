import { createContext, useContext, useMemo, useState } from 'react';

export const APP_LIMITS = {
  defaultClipSeconds: 15,
  maxShots: 10
};

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

const BoothifyContext = createContext(null);

export function BoothifyProvider({ children }) {
  const [selectedLayoutId, setSelectedLayoutId] = useState(STRIP_LAYOUTS[0].id);
  const [songClipLength, setSongClipLength] = useState(APP_LIMITS.defaultClipSeconds);
  const [session, setSession] = useState({
    selectedSong: null,
    capturedShots: [],
    selectedStripPhotos: [],
    previewAsset: null
  });

  const value = useMemo(
    () => ({
      availableLayouts: STRIP_LAYOUTS,
      selectedLayoutId,
      selectedLayout: STRIP_LAYOUTS.find((layout) => layout.id === selectedLayoutId),
      songClipLength,
      session,
      appLimits: APP_LIMITS,
      selectLayout: setSelectedLayoutId,
      setSongClipLength,
      updateSession: (payload) => {
        setSession((current) => ({ ...current, ...payload }));
      }
    }),
    [selectedLayoutId, songClipLength, session]
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

