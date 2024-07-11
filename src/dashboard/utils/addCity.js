const isValidCity = require('./isValidCity');
const User = require('../../database/models/user');

async function addCity(id, city) {
    if (await isValidCity(city)) {
        User.updateOne(
            { user_id: id },
            { $addToSet: { 'weather.0.city': city } },
            { upsert: true }
        )
        .then(() => {
            console.log(`${city} dodane do bazy danych.`);
        })
        .catch(err => {
            console.error(`Błąd podczas dodawania ${city}:`, err);
        });
    } else {
        console.log(`${city} nie jest prawidłowym miastem.`);
    }
}

module.exports = addCity;