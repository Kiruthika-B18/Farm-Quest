import express from 'express';
import { db } from '../firebase-admin.js';
import { generateChallenges, suggestFertilizers } from '../gemini.js';

const router = express.Router();

router.post('/generate-challenges', async (req, res) => {
  try {
    const farmerProfile = req.body;
    let challengesData = await generateChallenges(farmerProfile);
    
    if (!challengesData || !challengesData.challenges) {
      console.log('Using static fallback for challenges');
      challengesData = {
        challenges: [
          {
            id: 'static_1',
            emoji: '💧',
            title: 'Water early morning',
            description: 'Water your crops before 8 AM to minimize evaporation.',
            category: 'Water',
            points: 100,
            estimatedTime: '30 mins',
            tip: 'Roots absorb water better when soil is cool.',
            verificationPrompt: 'Take a photo of wet soil near the roots.'
          },
          {
            id: 'static_2',
            emoji: '🐛',
            title: 'Neem oil spray',
            description: 'Apply neem oil solution as a natural pest deterrent.',
            category: 'Pest',
            points: 150,
            estimatedTime: '45 mins',
            tip: 'Spray on the undersides of leaves where pests hide.',
            verificationPrompt: 'Take a photo of the mixed neem solution.'
          },
          {
            id: 'static_3',
            emoji: '🌿',
            title: 'Add compost',
            description: 'Add organic compost around the base of your plants.',
            category: 'Soil',
            points: 120,
            estimatedTime: '1 hour',
            tip: 'Avoid touching the stem directly with fresh compost.',
            verificationPrompt: 'Take a photo of compost applied to soil.'
          }
        ]
      };
    }
    res.json(challengesData);
  } catch (error) {
    console.error("Route /generate-challenges error:", error);
    res.status(500).json({ error: 'Failed to generate challenges' });
  }
});

router.post('/complete-challenge', async (req, res) => {
  try {
    const { userId, challengeId, photoUrl, note, gps } = req.body;
    // For MVP MVP we mock response unless FIREBASE_SERVICE_ACCOUNT is available
    res.json({ 
      success: true, 
      newPoints: Math.floor(Math.random() * 50) + 80, 
      newBadges: [], 
      streakBonus: 0 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete challenge' });
  }
});

router.post('/fertilizers', async (req, res) => {
  try {
    const { cropType, soilType, district, state } = req.body;
    let fertData = await suggestFertilizers(cropType, soilType, district, state);
    
    if (!fertData || !fertData.fertilizers) {
      console.log('Using static fallback for fertilizers');
      fertData = {
        fertilizers: [
          {
            id: 'f1',
            name: 'Vermicompost',
            emoji: '🪱',
            benefits: 'Improves soil aeration and water retention.',
            usage: 'Mix into the topsoil around the base of the plant.'
          },
          {
            id: 'f2',
            name: 'Jeevamrutha',
            emoji: '💧',
            benefits: 'Promotes robust microbial activity near the root zone.',
            usage: 'Apply with irrigation water every few weeks.'
          },
          {
            id: 'f3',
            name: 'Panchagavya',
            emoji: '🐄',
            benefits: 'Boosts plant immunity and increases yield.',
            usage: 'Dilute with water and use as a foliar spray.'
          }
        ]
      };
    }
    res.json(fertData);
  } catch (error) {
    console.error("Route /fertilizers error:", error);
    res.status(500).json({ error: 'Failed to generate fertilizer suggestions' });
  }
});

export default router;
