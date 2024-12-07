const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'audio',
  description: 'Search YouTube audio and send audio',
  author: 'Tata',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const query = args.join(' ');

    // Validation de la recherche utilisateur
    if (!query.trim()) {
      await sendMessage(senderId, { text: "Veuillez fournir un titre ou des mots-clés pour rechercher une vidéo." }, pageAccessToken);
      return;
    }

    try {
      // Recherche de vidéos YouTube en fonction de l'entrée utilisateur
      const searchResponse = await axios.get(`https://me0xn4hy3i.execute-api.us-east-1.amazonaws.com/staging/api/resolve/resolveYoutubeSearch?search=${encodeURIComponent(query)}`);
      const videos = searchResponse.data.data;

      if (!videos || videos.length === 0) {
        await sendMessage(senderId, { text: "Aucune vidéo trouvée pour votre recherche." }, pageAccessToken);
        return;
      }

      // Construction du carrousel horizontal avec des images
      const elements = videos.slice(0, 10).map(video => ({
        title: video.title,
        subtitle: `Durée: ${video.duration} | Vues: ${video.views}`,
        image_url: video.imgSrc || 'https://via.placeholder.com/720x405?text=No+Image', // Image par défaut si aucune image n'est disponible
        buttons: [{
          type: "postback",
          title: "Écouter",
          payload: `LISTEN_AUDIO_${video.videoId}`
        }]
      }));

      const messageData = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements
          }
        }
      };

      // Envoi du carrousel horizontal
      await sendMessage(senderId, messageData, pageAccessToken);
    } catch (error) {
      console.error('Erreur lors de la recherche YouTube:', error.message);
      await sendMessage(senderId, { text: "Erreur lors de la recherche de vidéos." }, pageAccessToken);
    }
  },

  // Traitement des postbacks pour écouter l'audio
  async handlePostback(senderId, payload) {
    const pageAccessToken = token;

    if (payload.startsWith("LISTEN_AUDIO_")) {
      const videoId = payload.split("_")[2];
      const downloadUrl = `https://api-improve-production.up.railway.app/yt/download?url=https://www.youtube.com/watch?v=${videoId}&format=mp3&quality=128`;

      try {
        // Téléchargement de l'audio de la vidéo
        const downloadResponse = await axios.get(downloadUrl);
        const audioUrl = downloadResponse.data.audio;

        if (!audioUrl) {
          throw new Error("URL de l'audio introuvable.");
        }

        // Envoi du message vocal à l'utilisateur
        await sendMessage(senderId, {
          attachment: {
            type: "audio",
            payload: { url: audioUrl }
          }
        }, pageAccessToken);
      } catch (error) {
        console.error('Erreur lors du téléchargement de l\'audio:', error.message);
        await sendMessage(senderId, { text: "Erreur lors du téléchargement de l'audio." }, pageAccessToken);
      }
    }
  }
};
