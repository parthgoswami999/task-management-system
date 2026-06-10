import { Router } from 'express';
import { sendJsonResponse } from '../config/Util.js';

const router = Router();

router.get('/', (_req, res) => {
  sendJsonResponse(_req, res, { status: 'ok' }, 'Server is running');
});

export default router;
