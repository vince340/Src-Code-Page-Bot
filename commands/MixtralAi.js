const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'mixtral',
  description: 'Discuter avec Mixtral-8x22B-Instruct-v0.1 AI',
  author: 'Tata',
  usage:'mixtral [ta question]',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const input = (args.join(' ') || 'hi').trim();
    const modifiedPrompt = `${input}, direct answer.`;

    try {
      await sendMessage(senderId, { text: 'Generating a response...' }, pageAccessToken);
      const response = await axios.get(`https://www.geo-sevent-tooldph.site/api/mixtral?prompt=${encodeURIComponent(modifiedPrompt)}`);
      const data = response.data;
      const formattedMessage = `・──🤖MixtralAi🤖──・\n${data.response}\n・──── >ᴗ< ────・`;
      await sendMessage(senderId, { text: 'Admin: www.facebook.com/lahatra.gameur' }, pageAccessToken);
      await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error);
      await sendMessage(senderId, { text: 'Error: Unexpected error.' }, pageAccessToken);
    }
  }
};
