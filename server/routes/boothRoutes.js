import { Router } from 'express';
import multer from 'multer';
import { createSessionDraft, generatePreview } from '../controllers/boothController.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 10,
    fileSize: 8 * 1024 * 1024
  }
});

router.post('/sessions', upload.array('shots', 10), createSessionDraft);
router.post('/exports/preview', generatePreview);

export default router;

