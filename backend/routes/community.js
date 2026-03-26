import express from 'express';
import { generatePostInsight } from '../gemini.js';

const router = express.Router();

router.post('/generate-insight', async (req, res) => {
  try {
    const { postBody } = req.body;
    const insight = await generatePostInsight(postBody);
    res.json({ insight });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate insight' });
  }
});

export default router;
