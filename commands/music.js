const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'music',
  description: 'Search and send music audio with details using the API.',
  usage: 'music <song name>\nExample: music just know',
  author: 'chilli',
  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: 'Please provide a song name to search.\nExample: music just know'
      }, pageAccessToken);
      return;
    }

    const query = args.join(' ');
    const apiUrl = `https://dlvc.vercel.app/yt-audio?search=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(apiUrl);
      const { title, downloadUrl, time, views, thumbnail, channelName } = response.data;

      await sendMessage(senderId, {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: title,
                image_url: thumbnail,
                subtitle: `${views} • ${channelName} • ${time}`,
                default_action: {
                  type: 'web_url',
                  url: thumbnail,
                  webview_height_ratio: 'tall'
                }
              }
            ]
          }
        }
      }, pageAccessToken);

      // Sending the audio kupal
      await sendMessage(senderId, {
        attachment: {
          type: 'audio',
          payload: {
            url: downloadUrl,
            is_reusable: true
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error('Error fetching music data:', error);
      await sendMessage(senderId, {
        text: 'An error occurred while fetching the music. Please try again later, or use Spotify.'
      }, pageAccessToken);
    }
  }
};
