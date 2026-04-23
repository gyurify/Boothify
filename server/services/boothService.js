import { randomUUID } from 'node:crypto';

export const MAX_SHOTS = 10;
export const DEFAULT_CLIP_SECONDS = 15;

export function createBoothSessionDraft({ files = [], payload = {} }) {
  if (files.length > MAX_SHOTS) {
    throw new Error(`A Boothify session supports up to ${MAX_SHOTS} uploaded shots.`);
  }

  return {
    sessionId: randomUUID(),
    status: 'draft',
    uploadedShotCount: files.length,
    selectedLayoutId: payload.selectedLayoutId || '2x6-1x2',
    clipLengthSeconds: Number(payload.clipLengthSeconds) || DEFAULT_CLIP_SECONDS,
    nextStep: 'choose-strip-photos'
  };
}

export function buildPreviewPlaceholder(payload = {}) {
  return {
    status: 'preview-pending',
    selectedLayoutId: payload.selectedLayoutId || '2x6-1x2',
    requestedAssetType: payload.assetType || 'gif',
    note: 'GIF/video rendering is not implemented yet in this scaffold. This placeholder marks where preview generation will plug in.'
  };
}
