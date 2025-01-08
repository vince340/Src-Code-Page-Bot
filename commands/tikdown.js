const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'tikdownload',
  usage: 'tikdownload <url>',
  description: 'Download a TikTok video from the provided URL.',
  author: 'Jerome',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (args.length < 1) {
      return sendMessage(senderId, {
        text: 'Please provide a TikTok video URL.',
      }, pageAccessToken);
    }

    const videoUrl = args[0];
    const apiUrl = `https://kaiz-apis.gleeze.com/api/tiktok-dl?url=${encodeURIComponent(videoUrl)}`;

    try {
      const response = await axios.get(apiUrl);
      const videoLink = response.data.link; // Siguraduhing tama ang key na ginagamit mo mula sa response

      if (!videoLink) {
        return sendMessage(senderId, {
          text: 'Sorry, I could not retrieve the video. Please check the URL and try again.',
        }, pageAccessToken);
      }

      const message = `Here is your TikTok video:\n${videoLink}`;
      await sendMessage(senderId, { text: message }, pageAccessToken);

      const videoMessage = {
        attachment: {
          type: 'video',
          payload: {
            url: videoLink,
          },
        },
      };
      await sendMessage(senderId, videoMessage, pageAccessToken);
    } catch (error) {
      console.error('Error:', error.message);
      sendMessage(senderId, {
        text: 'Sorry, there was an error downloading the video. Please try again later.',
      }, pageAccessToken);
    }
  },
};
