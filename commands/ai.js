const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Generate text using GPT-4o API',
  author: 'Carl John Villavito',
  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');

    if (prompt === "") {
      sendMessage(senderId, { text: "Usage: /Ai <question>" }, pageAccessToken);
      return; // Ensure the function doesn't continue
    }

    // Inform the user that content is being generated
    sendMessage(senderId, { text: '' }, pageAccessToken);

    try {
      const apiUrl = `https://joshweb.click/api/gpt-4o?q=${encodeURIComponent(prompt)}&uid=${senderId}`;
      const response = await axios.get(apiUrl);

      // Extract the result from the response
      const result = response.data.result;

      // Send the generated text to the user with proper concatenation
      sendMessage(senderId, { text: "👸 LOVELY AI  :\n\n" + result }, pageAccessToken);

    } catch (error) {
      console.error('Error calling GPT-4o API:', error);
      sendMessage(senderId, { text: 'There was an error generating the content. Please try again later.' }, pageAccessToken);
    }
  }
};
