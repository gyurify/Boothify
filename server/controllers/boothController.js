import { buildPreviewPlaceholder, createBoothSessionDraft } from '../services/boothService.js';

export async function createSessionDraft(request, response) {
  try {
    const draft = createBoothSessionDraft({
      files: request.files || [],
      payload: request.body || {}
    });

    response.status(201).json(draft);
  } catch (error) {
    response.status(400).json({
      message: 'Unable to create booth session draft.',
      error: error.message
    });
  }
}

export async function generatePreview(request, response) {
  try {
    const preview = buildPreviewPlaceholder(request.body || {});

    response.json(preview);
  } catch (error) {
    response.status(400).json({
      message: 'Unable to prepare preview payload.',
      error: error.message
    });
  }
}

