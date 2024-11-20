const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Interact with LLMA META AI',
  usage: 'ai [your Question or Message]',
  author: 'Raniel',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) return sendMessage(senderId, { text: "Usage: ai <question>" }, pageAccessToken);

    try {
      const { data: { result } } = await axios.get(`https://joshweb.click/api/llama-3-70b?q=${encodeURIComponent(prompt)}`);
      sendMessage(senderId, { text: result }, pageAccessToken)+`\n━━━━━━━━━━━━━━━━━━\n\nThis Ai is made by ICT students in Pau Excellencia Global Academy Foundation, Inc.(Pegafi)\n━━━━━━━━━━━━━━━━━━`;
    } catch {
      sendMessage(senderId, { text: 'There was an error generating the content. Please try again later.' }, pageAccessToken);
    }
  }
};
