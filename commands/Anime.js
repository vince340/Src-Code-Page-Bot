const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'anime',
  description: 'Rechercher des informations sur un anime',
  author: 'Tata',
  usage: 'anime [titre de l\'anime]',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const query = args.join(' ').trim();

    if (!query) {
      return await sendMessage(senderId, { text: 'Veuillez fournir le titre d\'un anime. Exemple : anime Boku no Hero Academia' }, pageAccessToken);
    }

    try {
      await sendMessage(senderId, { text: '🔍 Recherche en cours...' }, pageAccessToken);

      const response = await axios.get(`https://kaiz-apis.gleeze.com/api/mal?title=${encodeURIComponent(query)}`);
      const data = response.data;

      if (!data.title) {
        return await sendMessage(senderId, { text: 'Aucun résultat trouvé pour cet anime.' }, pageAccessToken);
      }

      const formattedMessage = `🎥 **${data.title}** (${data.japanese})\n\n` +
        `📺 **Type :** ${data.type}\n` +
        `📅 **Statut :** ${data.status}\n` +
        `🌟 **Score :** ${data.score} (${data.scoreStats})\n` +
        `👥 **Popularité :** ${data.popularity}\n` +
        `🍿 **Première diffusion :** ${data.premiered}\n` +
        `📆 **Diffusé :** ${data.aired}\n` +
        `🎙️ **Studios :** ${data.studios}\n` +
        `📖 **Genres :** ${data.genres}\n` +
        `📄 **Description :** ${data.description}\n\n` +
        `🔗 **Plus d\'infos :** [Lien MAL](${data.url})`;

      const messageWithImage = {
        attachment: {
          type: 'image',
          payload: {
            url: data.picture,
            is_reusable: true,
          },
        },
      };

      await sendMessage(senderId, messageWithImage, pageAccessToken);
      await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
    } catch (error) {
      console.error('Erreur:', error.message || error);
      await sendMessage(senderId, { text: '❌ Une erreur s\'est produite lors de la recherche. Veuillez réessayer plus tard.' }, pageAccessToken);
    }
  }
};
