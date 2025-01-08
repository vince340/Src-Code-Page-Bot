const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');
const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'fbd',
  description: 'Download Facebook video',
  usage: 'fbdownloader <video link>',
  author: 'Rized',
  execute: async (senderId, args) => {
    const pageAccessToken = token;
    const videoLink = args.join(' ');

    if (!videoLink) {
      return sendMessage(senderId, { text: 'Usage: fbdownloader <video link>' }, pageAccessToken);
    }

    try {
      const response = await axios.get(`https://betadash-search-download.vercel.app/fbdl?url=${encodeURIComponent(videoLink)}`);
      const videoUrl = response.data;

      if (!videoUrl) {
        return sendMessage(senderId, { text: 'Failed to retrieve video.' }, pageAccessToken);
      }

      const videoMessage = {
        attachment: {
          type: 'video',
          payload: {
            url: videoUrl,
            is_reusable: true
          }
        }
      };

      await sendMessage(senderId, { text: 'Downloading...' }, pageAccessToken);
      await sendMessage(senderId, videoMessage, pageAccessToken);
    } catch (error) {
      console.error('Error:', error.message);
      sendMessage(senderId, { text: 'An error occurred. Try again later.' }, pageAccessToken);
    }
  }
};
