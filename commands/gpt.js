‎const axios = require('axios');
‎const { sendMessage } = require('../handles/sendMessage');
‎
‎module.exports = {
‎  name: 'gpt',
‎  description: 'Interagit avec Gpt4 ',
‎  usage: 'gpt [votre message]',
‎  author: 'RONALD SORY',
‎  
‎
‎  async execute(senderId, args, pageAccessToken) {
‎    const message = args.join(' ');
‎    if (!message) {
‎      return sendMessage(senderId, { text: "❗ Utilisation : groq [votre message]" }, pageAccessToken);
‎    }
‎
‎    try {
‎      const apiUrl = `https://ronald-api-v1.vercel.app/api/gpt4?user_id=${senderId}&message=${encodeURIComponent(message)}`;
‎      const response = await axios.get(apiUrl);
‎
‎      const reply = response.data?.response?.trim() || response.data?.content?.trim();
‎
‎      if (reply) {
‎        for (let i = 0; i < reply.length; i += 1800) {
‎          await sendMessage(senderId, { text: reply.substring(i, i + 1800) }, pageAccessToken);
‎        }
‎      } else {
‎        sendMessage(senderId, { text: "❌ Groq n'a pas pu répondre. Réessaie." }, pageAccessToken);
‎      }
‎
‎    } catch (error) {
‎      console.error("❌ Erreur API GPT-4 :", error.message);
‎      sendMessage(senderId, { text: "🚨 Une erreur s'est produite. Réessaie plus tard." }, pageAccessToken);
‎    }
‎  }
‎};
‎
