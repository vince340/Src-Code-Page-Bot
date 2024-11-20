const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'gemini',
  description: 'Interact with Google Gemini',
  usage: 'gemini [your message]',
  author: 'coffee',
  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) return sendMessage(senderId, { text: "Usage: gemini <your message>" }, pageAccessToken);

    try {
      const { data } = await axios.get(`https://joshweb.click/gemini?prompt=${encodeURIComponent(prompt)}`);
      sendMessage(senderId, { text: data.gemini }, pageAccessToken);
    } catch {
      sendMessage(senderId, { text: 'Error generating response. Try again later.' }, pageAccessToken);
    }
  }
};