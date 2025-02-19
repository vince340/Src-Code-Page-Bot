const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

// Lecture du token d'accès pour l'envoi des messages
const token = fs.readFileSync('token.txt', 'utf8');

// Dictionnaire pour suivre le dernier horodatage de chaque utilisateur
const lastUsage = {};

module.exports = {
  name: 'imagine',
  description: 'Generate an AI-based image with a 2-minute cooldown',
  author: 'Tata',
  usage: 'imagine dog',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const prompt = args.join(' ').trim();

    // Vérifie que l'utilisateur a bien entré une commande
    if (!prompt) {
      return await sendMessage(senderId, { text: 'Please provide a prompt for the image generator.' }, pageAccessToken);
    }

    // Vérifier l'intervalle de 2 minutes pour cet utilisateur
    const currentTime = Date.now();
    const cooldownPeriod = 2 * 60 * 1000; // 2 minutes en millisecondes

    if (lastUsage[senderId] && currentTime - lastUsage[senderId] < cooldownPeriod) {
      const remainingTime = Math.ceil((cooldownPeriod - (currentTime - lastUsage[senderId])) / 1000);
      return await sendMessage(senderId, { text: `Please wait ${remainingTime} seconds before using this command again.` }, pageAccessToken);
    }

    // Mettre à jour le dernier horodatage d'utilisation de la commande
    lastUsage[senderId] = currentTime;

    try {
      await sendMessage(senderId, { text: 'Generation de l image en cours...🤩' }, pageAccessToken);
      
      // Appel à la nouvelle API pour générer l'image
      const apiUrl = `https://kaiz-apis.gleeze.com/api/imagine?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' }); // Récupérer l'image comme un buffer

      // Convertir le buffer en base64
      const imageBuffer = Buffer.from(response.data, 'binary').toString('base64');
      const imageUrl = `data:image/jpg;base64,${imageBuffer}`; // Créer une URL de données

      await sendMessage(senderId, {
        attachment: { type: 'image', payload: { url: imageUrl } }
      }, pageAccessToken);

    } catch (error) {
      console.error('Error:', error);
      await sendMessage(senderId, { text: 'Error: Unexpected error while generating image.' }, pageAccessToken);
    }
  }
};
