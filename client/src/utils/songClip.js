function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizeSeconds(value) {
  return Math.max(0, Math.round(Number(value) || 0));
}

export function formatTimestampLabel(totalSeconds) {
  const safeSeconds = Math.max(0, Math.round(Number(totalSeconds) || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function getTrackDurationSeconds(track) {
  return Math.max(0, Math.floor((track?.durationMs || 0) / 1000));
}

export function getSongClipBounds(track, limits) {
  const rawTrackDurationSeconds = getTrackDurationSeconds(track);
  const trackDurationSeconds =
    rawTrackDurationSeconds > 0 ? rawTrackDurationSeconds : limits.maxClipSeconds;
  const minLengthSeconds = Math.max(1, Math.min(limits.minClipSeconds, trackDurationSeconds));
  const maxLengthSeconds = Math.max(minLengthSeconds, Math.min(limits.maxClipSeconds, trackDurationSeconds));
  const defaultLengthSeconds = Math.min(limits.defaultClipSeconds, maxLengthSeconds);

  return {
    defaultLengthSeconds,
    maxLengthSeconds,
    minLengthSeconds,
    rawTrackDurationSeconds,
    trackDurationSeconds
  };
}

export function createDefaultSongClip(track, limits) {
  const bounds = getSongClipBounds(track, limits);

  return {
    endSeconds: bounds.defaultLengthSeconds,
    startSeconds: 0
  };
}

export function getSongClipSelection(rawClip, track, limits) {
  const bounds = getSongClipBounds(track, limits);
  const fallbackClip = createDefaultSongClip(track, limits);

  let startSeconds = normalizeSeconds(rawClip?.startSeconds ?? fallbackClip.startSeconds);
  let endSeconds = normalizeSeconds(rawClip?.endSeconds ?? fallbackClip.endSeconds);

  startSeconds = Math.min(
    startSeconds,
    Math.max(0, bounds.trackDurationSeconds - bounds.minLengthSeconds)
  );

  endSeconds = clamp(
    endSeconds,
    startSeconds + bounds.minLengthSeconds,
    bounds.trackDurationSeconds
  );

  if (endSeconds - startSeconds > bounds.maxLengthSeconds) {
    endSeconds = Math.min(bounds.trackDurationSeconds, startSeconds + bounds.maxLengthSeconds);
  }

  if (endSeconds - startSeconds < bounds.minLengthSeconds) {
    startSeconds = Math.max(0, endSeconds - bounds.minLengthSeconds);
  }

  const lengthSeconds = Math.max(0, endSeconds - startSeconds);

  return {
    ...bounds,
    endLabel: formatTimestampLabel(endSeconds),
    endSeconds,
    isValid:
      lengthSeconds >= bounds.minLengthSeconds &&
      lengthSeconds <= bounds.maxLengthSeconds &&
      endSeconds <= bounds.trackDurationSeconds,
    lengthLabel: `${lengthSeconds}s`,
    lengthSeconds,
    shiftMaxSeconds: Math.max(0, bounds.trackDurationSeconds - lengthSeconds),
    startLabel: formatTimestampLabel(startSeconds),
    startSeconds,
    timingLabel: `${formatTimestampLabel(startSeconds)} - ${formatTimestampLabel(endSeconds)}`,
    trimEndMaxSeconds: Math.min(bounds.trackDurationSeconds, startSeconds + bounds.maxLengthSeconds),
    trimEndMinSeconds: Math.min(bounds.trackDurationSeconds, startSeconds + bounds.minLengthSeconds),
    trimStartMaxSeconds: Math.max(0, endSeconds - bounds.minLengthSeconds),
    trimStartMinSeconds: Math.max(0, endSeconds - bounds.maxLengthSeconds),
    trackDurationLabel: formatTimestampLabel(bounds.trackDurationSeconds)
  };
}

export function setSongClipTiming(rawClip, track, limits, nextStartSeconds) {
  const currentClip = getSongClipSelection(rawClip, track, limits);
  const startSeconds = clamp(normalizeSeconds(nextStartSeconds), 0, currentClip.shiftMaxSeconds);

  return {
    endSeconds: startSeconds + currentClip.lengthSeconds,
    startSeconds
  };
}

export function setSongClipLength(rawClip, track, limits, nextLengthSeconds) {
  const currentClip = getSongClipSelection(rawClip, track, limits);
  const lengthSeconds = clamp(
    normalizeSeconds(nextLengthSeconds),
    currentClip.minLengthSeconds,
    currentClip.maxLengthSeconds
  );

  let startSeconds = currentClip.startSeconds;
  let endSeconds = startSeconds + lengthSeconds;

  if (endSeconds > currentClip.trackDurationSeconds) {
    endSeconds = currentClip.trackDurationSeconds;
    startSeconds = Math.max(0, endSeconds - lengthSeconds);
  }

  return {
    endSeconds,
    startSeconds
  };
}

export function setSongClipStart(rawClip, track, limits, nextStartSeconds) {
  const currentClip = getSongClipSelection(rawClip, track, limits);
  const startSeconds = clamp(
    normalizeSeconds(nextStartSeconds),
    currentClip.trimStartMinSeconds,
    currentClip.trimStartMaxSeconds
  );

  return {
    endSeconds: currentClip.endSeconds,
    startSeconds
  };
}

export function setSongClipEnd(rawClip, track, limits, nextEndSeconds) {
  const currentClip = getSongClipSelection(rawClip, track, limits);
  const endSeconds = clamp(
    normalizeSeconds(nextEndSeconds),
    currentClip.trimEndMinSeconds,
    currentClip.trimEndMaxSeconds
  );

  return {
    endSeconds,
    startSeconds: currentClip.startSeconds
  };
}
