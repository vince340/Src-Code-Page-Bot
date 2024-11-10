const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'emogif',  // Command name
  description: 'convert emoji to gif', 
  usage: '[emoji]',  // Usage
  author: 'Jay Ar',  

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, { text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮𝗻 𝗲𝗺𝗼𝗷𝗶.' }, pageAccessToken);
      return;
    }

    const emoji = args[0];
    const availableEmojis = "😀😃😄😁😆😅😂🤣😭😉😗😙😚😘🥰😍🤩🥳🙃🙂🥲🥹😊☺️😌😏🤤😋😛😝😜🤪🥴😔🥺😬😑😐😶🤐🤔🤫🫢🤭🥱🤗😱🤨🧐😒🙄😮‍💨😤😠😡🤬😞😓😟😥😢☹️🙁😰😨😧😦😮😯😲😳🤯😖😣😩😫😵🥶🥵🤢🤮😴😪🤧🤒🤕😷🤥😇🤠🤑🤓😎🥸🤡😈👿🫥";

    if (!availableEmojis.includes(emoji)) {
      await sendMessage(senderId, { text: `Sorry, the emoji "${emoji}" is not available.` }, pageAccessToken);
      return;
    }

    const encodedEmoji = encodeURIComponent(emoji);
    const apiUrl = `https://joshweb.click/emoji2gif?q=${encodedEmoji}`;

    await sendMessage(senderId, { text: '⌛ 𝗖𝗼𝗻𝘃𝗲𝗿𝘁𝗶𝗻𝗴 𝗘𝗺𝗼𝗷𝗶 𝘁𝗼 𝗚𝗜𝗙, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error('❌ Error generating GIF:', error);
      await sendMessage(senderId, { text: '❌ An error occurred while generating the GIF.' }, pageAccessToken);
    }
  }
};
