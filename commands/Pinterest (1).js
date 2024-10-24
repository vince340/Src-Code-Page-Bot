const axios = require('axios');

module.exports = {
  name: 'Image',
  description: 'Fetch images from Pinterest',
  author: 'Deku (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');
    try {
      sendMessage(senderId, { text: 'Recherche d\'images...' }, pageAccessToken);
      const apiUrl = `https://joshweb.click/api/pinterest?q=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);
      const result = response.data.result;

      if (result && result.length > 0) {
        // Send each image URL as a separate message
        for (const imageUrl of result) {
          sendMessage(senderId, {
            attachment: {
              type: 'image',
              payload: {
                url: imageUrl,
                is_reusable: true
              }
            }
          }, pageAccessToken);
        }
      } else {
        console.error('Error: No images found in the response.');
        sendMessage(senderId, { text: 'Sorry, no images were found for your query.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Pinterest API:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
