const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'gemini',
  description: 'Interact with Google Gemini',
  usage: 'gemini [your message]',
  author: 'tata',
  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) return sendMessage(senderId, { text: "Usage: gemini <your message>" }, pageAccessToken);

    try {
      sendMessage(senderId, {text: '...✍🏻'},pageAccessToken);
      const { data } = await axios.get(`https://joshweb.click/new/gemini?prompt=${encodeURIComponent(prompt)}`);
      sendMessage(senderId, { text: data.result.data }, pageAccessToken);
    } catch {
      sendMessage(senderId, { text: 'Error generating response. Try again later.' }, pageAccessToken);
    }
  }
};
