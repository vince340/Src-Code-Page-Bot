const axios = require('axios');

module.exports = {
  name: 'dewa',
  description: 'Generate an image based on a text prompt using OpenAI.',
  author: 'ChatGPT',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ').trim();

    if (!prompt) {
      return sendMessage(senderId, { text: 'Please provide a prompt for the image generation.' }, pageAccessToken);
    }

    try {
      sendMessage(senderId, { text: '🖼️ | Generating your image...' }, pageAccessToken);

      const response = await axios.post('https://api.openai.com/v1/images/generations', {
        prompt: prompt,
        n: 1,
        size: '1024x1024'
      }, {
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json'
        }
      });

      const imageUrl = response.data.data[0].url; // Extract the image URL from the response
      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: imageUrl } } }, pageAccessToken);
    } catch (error) {
      console.error('Error generating image:', error.response ? error.response.data : error.message);
      sendMessage(senderId, { text: '⚠️ An error occurred while generating the image. Please try again later.' }, pageAccessToken);
    }
  }
};
