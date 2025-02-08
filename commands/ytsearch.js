const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ytsearch',
  description: 'Search YouTube videos.',
  usage: 'ytsearch [video URL atau search query]',
  author: 'Your Name',
  async execute(senderId, args, pageAccessToken) {
    if (!args.length) {
      return sendMessage(senderId, { text: 'Please provide a search query or URL.' }, pageAccessToken);
    }

    try {
      const response = await axios.get(`https://kaiz-apis.gleeze.com/api/ytsearch?q=${encodeURIComponent(args.join(' '))}`);
      const data = response.data;

      if (data.error) {
        return sendMessage(senderId, { text: `Error: ${data.error}\nParameter: ${data.parameter}` }, pageAccessToken);
      }

      if (!data[0] || !data[0].url) {
        return sendMessage(senderId, { text: 'Video tidak ditemukan.' }, pageAccessToken);
      }

      const video = data[0];
      const videoMessage = {
        attachment: {
          type: 'video',
          payload: {
            url: video.Url,
            is_reusable: true
          }
        }
      };

      await sendMessage(senderId, videoMessage, pageAccessToken);
      sendMessage(senderId, { text: `Judul: ${video.title}` }, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: 'Sorry, an error occurred.' }, pageAccessToken);
    }
  }
};