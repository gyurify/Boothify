import { Router } from 'express';
import { getSpotifyConfig, searchTracks } from '../controllers/spotifyController.js';

const router = Router();

router.get('/config', getSpotifyConfig);
router.get('/search', searchTracks);

export default router;
