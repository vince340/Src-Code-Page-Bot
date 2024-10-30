const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

// Stock temporaire pour suivre les recherches vidéo par utilisateur
const userSearchResults = {};

module.exports = {
  name: 'video',
  description: 'Search for YouTube videos and send a list for the user to select',
  author: 'Tata',
  

  async execute(senderId, args) {
    const pageAccessToken = token;
    const searchQuery = args.join(' ').trim();

    try {
      // Requête de recherche des vidéos
      const searchResponse = await axios.get(
        `https://me0xn4hy3i.execute-api.us-east-1.amazonaws.com/staging/api/resolve/resolveYoutubeSearch?search=${encodeURIComponent(searchQuery)}`
      );
      const searchData = searchResponse.data;

      if (searchData.code === 200 && searchData.data.length > 0) {
        // Stocker les résultats de recherche pour cet utilisateur
        userSearchResults[senderId] = searchData.data;

        // Créer un message avec la liste des vidéos
        const messageText = searchData.data.slice(0, 5).map((video, index) => (
          `${index + 1}. ${video.title} (${video.duration})`
        )).join('\n');

        await sendMessage(senderId, { text: `🔎 Voici les résultats de recherche pour "${searchQuery}":\n\n${messageText}\n\nEnvoyez le numéro de la vidéo souhaitée.` }, pageAccessToken);
      } else {
        await sendMessage(senderId, { text: "Je n'ai trouvé aucune vidéo correspondant à votre recherche." }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error:', error);
      await sendMessage(senderId, { text: 'Une erreur est survenue lors de la recherche de la vidéo.' }, pageAccessToken);
    }
  }
};

// Fonction pour gérer la réponse de l'utilisateur avec un numéro
const handleUserResponse = async (senderId, userMessage, pageAccessToken) => {
  if (userSearchResults[senderId]) {
    const selectedIndex = parseInt(userMessage, 10) - 1;

    // Vérification que le numéro est valide
    if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < userSearchResults[senderId].length) {
      const selectedVideo = userSearchResults[senderId][selectedIndex];
      const videoUrl = selectedVideo.url;

      await sendMessage(senderId, { text: `Voici le lien de la vidéo : ${videoUrl}` }, pageAccessToken);

      // Supprimer les résultats stockés pour cet utilisateur après l'envoi du lien
      delete userSearchResults[senderId];
    } else {
      await sendMessage(senderId, { text: "Numéro invalide. Veuillez envoyer un numéro correspondant à l'une des vidéos de la liste." }, pageAccessToken);
    }
  } else {
    await sendMessage(senderId, { text: "Aucune recherche en cours. Veuillez d'abord effectuer une recherche de vidéo." }, pageAccessToken);
  }
};

module.exports.handleUserResponse = handleUserResponse;
