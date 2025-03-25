const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'weather',
  description: 'Obtenir la météo actuelle d\'une ville',
  author: 'Tata',
  usage:'weather [city]',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const city = args.join(' ').trim();

    // Vérifier si une ville a été fournie
    if (!city) {
      await sendMessage(senderId, { text: 'Veuillez entrer le nom d\'une ville pour obtenir la météo. Ex : meteo Antananarivo' }, pageAccessToken);
      return;
    }

    try {
      // Faire une requête à l'API de wttr.in
      const response = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=%C+%t+%h+%w&m`);

      const weatherData = response.data; // Ex: "Partly cloudy +27°C 64% Humidity ↙ 15 km/h"
      const formattedMessage = `🌤️ Météo à ${city} :\n\n${weatherData}`;

      // Envoyer la réponse à l'utilisateur
      await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);

    } catch (error) {
      console.error('Erreur lors de la recherche météo:', error.message);
      await sendMessage(senderId, { text: 'Impossible de récupérer la météo. Vérifiez le nom de la ville ou réessayez plus tard.' }, pageAccessToken);
    }
  }
};
