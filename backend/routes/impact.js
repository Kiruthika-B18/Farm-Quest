import express from 'express';
import { db } from '../firebase-admin.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // If DB isn't strictly configured with service account, return mock
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      return res.json({
        totalWaterSaved: 43500,
        totalChemicalFreeDays: 1420,
        totalCO2Reduced: 3200,
        totalFarmers: 165
      });
    }
    
    const impactDoc = await db.collection('impact').doc('global').get();
    if (!impactDoc.exists) {
      return res.json({
        totalWaterSaved: 0,
        totalChemicalFreeDays: 0,
        totalCO2Reduced: 0,
        totalFarmers: 0
      });
    }
    res.json(impactDoc.data());
  } catch (err) {
    console.error("Impact API error:", err.message);
    res.status(500).json({ error: 'Failed to fetch impact stats' });
  }
});

export default router;
