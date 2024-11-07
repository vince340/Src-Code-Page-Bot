const axios = require('axios');

module.exports = {
  name: 'bing',
  description: 'Generate and send images directly from Bing based on your prompt.',
  usage: 'bing [prompt]',  // Usage
  author: 'Jerome',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (args.length === 0) {
      return sendMessage(senderId, { text: 'Please provide a prompt. Example: /bing dog' }, pageAccessToken);
    }

    const prompt = args.join(' ');
    const apiUrl = `https://jerome-web.onrender.com/service/api/bing?prompt=${encodeURIComponent(prompt)}`;

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data.success && data.result && data.result.length > 0) {
        const imageMessages = data.result.slice(0, 4).map((imageUrl) => ({
          attachment: {
            type: 'image',
            payload: {
              url: imageUrl,
              is_reusable: true
            }
          }
        }));

        for (const imageMessage of imageMessages) {
          await sendMessage(senderId, imageMessage, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: `Sorry, no images were found for "${prompt}".` }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching Bing images:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
