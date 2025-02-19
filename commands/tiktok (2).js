const axios = require('axios');
 const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'tiktok',
  description: 'Download TikTok video',
  usage: 'tiktok <video link>',
  author: 'raniel',
  execute: async (senderId, args, pageAccessToken, sendMessage) => {
    const videoLink = args.join(' ');
    if (!videoLink) {
      return sendMessage(senderId, { text: 'Usage: tiktok <video link>' }, pageAccessToken);
    }
    try {
      const response = await axios.get(`https://sandipbaruwal.onrender.com/tikdown?url=${encodeURIComponent(videoLink)}`);
      const videoUrl = response.data;
      if (!videoUrl) {
        return sendMessage(senderId, { text: 'Failed to retrieve video.' }, pageAccessToken);
      }
      if (attachment) {
      messagePayload.message.attachment = {
        type: attachment.type,
        payload: {
          url: attachment.payload.url,
          is_reusable: true
        }
      };
    }
      sendMessage(senderId, { attachment }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error.message);
      sendMessage(senderId, { text: 'An error occurred. Try again later.' }, pageAccessToken);
    }
  }
};