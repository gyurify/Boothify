export function getHealthCheck(_request, response) {
  response.json({
    service: 'boothify-api',
    status: 'ok',
    timestamp: new Date().toISOString(),
    features: {
      spotifyMetadata: true,
      boothSessionDrafts: true,
      mediaExportPipeline: false
    }
  });
}

