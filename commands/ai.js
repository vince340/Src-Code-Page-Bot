const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Xao Ai',
  usage: 'aiv2 [your Question or Message]',
  author: 'Gelie',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) return sendMessage(senderId, { text: "Usage: aiv2 <question>" }, pageAccessToken);

    try {
      const { data: { result } } = await axios.get(`https://api.y2pheq.me/xaoai?prompt=hello${encodeURIComponent(prompt)}&UID=${senderId}`);
      sendMessage(senderId, { text: result }, pageAccessToken);
    } catch {
      sendMessage(senderId, { text: 'There was an error generating the content. Please try again later.' }, pageAccessToken);
    }
  }
};
