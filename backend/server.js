import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './firebase-admin.js'; // initialize firebase admin

import challengeRoutes from './routes/challenges.js';
import communityRoutes from './routes/community.js';
import weatherRoutes from './routes/weather.js';
import impactRoutes from './routes/impact.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', challengeRoutes);
app.use('/api', communityRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/impact', impactRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`FarmQuest Backend running on port ${PORT}`);
});
