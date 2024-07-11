const axios = require('axios');
const key = require('../../config/website.json').API_KEY_OPENWEATHERMAP;

async function isValidCity(city) {
    const apiKey = key;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    try {
        const response = await axios.get(url);
        return response.status === 200;
    } catch (error) {
        return false;
    }
}

module.exports = isValidCity;