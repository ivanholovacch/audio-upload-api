import express, { Router } from 'express';
import audioController from '../controllers/audio/audioController';
import { createUploadMiddleware } from '../services/audioFile/saveFile.service';

const upload = createUploadMiddleware();
const router: Router = express.Router();

router.post('/upload', upload.single('audio'), audioController.handleAudioUpload);

export default router;