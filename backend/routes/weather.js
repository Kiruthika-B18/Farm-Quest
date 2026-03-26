import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/:district', async (req, res) => {
  try {
    const { district } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey || apiKey === 'your_openweather_key_here') {
      return res.json({
        temp: 32,
        humidity: 65,
        rainChance: 20,
        wind: 12,
        tip: "Water your crops early morning ☀️"
      });
    }

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${district},IN&appid=${apiKey}&units=metric`);
    const data = response.data;
    
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const rainChance = data.clouds ? data.clouds.all : 0;
    const wind = data.wind.speed;
    
    let tip = "Good weather for farming today!";
    if (rainChance > 60) tip = "Skip irrigation today — rain expected! 🌧️";
    else if (temp > 35) tip = "Water your crops early morning ☀️";
    else if (humidity > 80) tip = "Watch for fungal diseases today 🍄";

    res.json({
      temp: Math.round(temp),
      humidity,
      rainChance,
      wind,
      tip
    });
  } catch (err) {
    console.error("Weather API error:", err.message);
    res.status(500).json({ error: 'Failed to fetch weather' });
  }
});

export default router;
