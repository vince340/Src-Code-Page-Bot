const axios = require('axios');

module.exports = {
  name: 'animeinfo',
  description: 'Search information for anime!',
  author: 'Dale Mekumi', 
  usage: 'animeinfo animetitle',
  async execute(senderId, args, pageAccessToken, sendMessage) {

    const prompt = args.join(' ');
    if (!prompt) return sendMessage(senderId, { text: "Usage: animeinfo animetitle" }, pageAccessToken);
    
    sendMessage(senderId, { text: "⚙ Searching Anime please wait..." }, pageAccessToken);

    try {
      const response = await axios.get(`https://kaiz-apis.gleeze.com/api/mal?title=${encodeURIComponent(prompt)}`);
      const auth = response.data.author;
      const title = response.data.title;
      const status = response.data.status;
      const episodes = response.data.episodes;
      const duration = response.data.duration;
      const genres = response.data.genres;
      const description = response.data.description;
      const url = response.data.url;
      const picture = response.data.picture;

      const picmessage = {
    attachment: {
      type: 'image',
      payload: {
        url: picture,
      },
    },
  };
  await sendMessage(senderId, picmessage, pageAccessToken);

      sendMessage(senderId, { 
        text: `Anime Information\n\nTitle: ${title}\n\n Author: ${auth}\n\nStatus: ${status}\n\nEpisodes: ${episodes}\n\nDuration: ${duration}\n\nGenres: ${genres}\n\nSource: ${url}\n\n\nDescription\n\n${description}\n\n` 
      }, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}` }, pageAccessToken);
    }
  }
};
