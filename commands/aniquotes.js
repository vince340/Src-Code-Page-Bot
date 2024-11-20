const axios = require('axios');

module.exports = {
  name: 'aniquotes',
  description: 'fetch a random anime quote!',
  author: 'Dale Mekumi', 
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "⚙ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝗮𝗻𝗶𝗺𝗲 𝗾𝘂𝗼𝘁𝗲..." }, pageAccessToken);

    try {
      const response = await axios.get('https://h-anime-quote-api.vercel.app/anime-quote');
      const quoteData = response.data.data;

      const anime = quoteData.anime.name;
      const character = quoteData.character.name;
      const quote = quoteData.content;

      if (!quote || !anime || !character) {
        return sendMessage(senderId, { text: "🥺 𝗦𝗼𝗿𝗿𝘆, 𝗜 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝗳𝗶𝗻𝗱 𝗮𝗻 𝗮𝗻𝗶𝗺𝗲 𝗾𝘂𝗼𝘁𝗲." }, pageAccessToken);
      }

      sendMessage(senderId, { 
        text: `📝: 𝗔𝗻𝗶𝗺𝗲 𝗤𝘂𝗼𝘁𝗲\n\n 🖋️: "${quote}"\n\n👤: ${character} (${anime})` 
      }, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}` }, pageAccessToken);
    }
  }
};
