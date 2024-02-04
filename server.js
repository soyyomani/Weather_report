const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;

    if (!cities || !Array.isArray(cities)) {
      return res.status(400).json({ error: 'Invalid input. Please provide an array of cities.' });
    }

    const apiKey = process.env.API_KEY;  

    const weatherResults = await Promise.all(
      cities.map(async (city) => {
        try {
          const response = await axios.get(`https://api.weatherbit.io/v2.0/current?city=${city}&key=${apiKey}`);
          
           
          const temperature = response.data.data[0].temp;  

          return { [city]: `${temperature}°C` };
        } catch (error) {
          return { [city]: 'N/A' };
        }
      })
    );

    const weather = Object.assign({}, ...weatherResults);

    res.json({ weather });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
