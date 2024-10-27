const axios = require('axios');
const fs = require('fs');
const { sendMessage } = require('../handles/sendMessage');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'gpt',
  description: 'Interact with the GPT-4o API',
  usage: '-gpt [hello!]',
  author: 'coffee',

  async execute(senderId, args) {
    const input = this.parseInput(args);
    if (!input) {
      return await this.sendError(senderId, 'Error: Missing input!');
    }

    try {
      const response = await this.fetchGPT4OResponse(input);
      await sendMessage(senderId, { text: this.formatResponse(response) }, token);
    } catch (error) {
      console.error('Error processing input:', error);
      await this.sendError(senderId, 'Error: Unexpected error occurred while processing the input.');
    }
  },

  parseInput(args) {
    return Array.isArray(args) && args.length > 0 ? args.join(' ').trim() : null;
  },

  async fetchGPT4OResponse(input) {
    const apiUrl = `https://appjonellccapis.zapto.org/api/gpt4o?ask=${encodeURIComponent(input)}&id=1`;
    const { data } = await axios.get(apiUrl);
    return data;
  },

  formatResponse(data) {
    if (data.status) {
      return `🗨️ | 𝙶𝙿𝚃 [㊗️] \n・───────────・\n${data.response || 'No response provided.'}\n・──── >ᴗ< ────・`;
    }
    return 'Error: Unable to fetch response.';
  },

  async sendError(senderId, errorMessage) {
    await sendMessage(senderId, { text: errorMessage }, token);
  }
};
