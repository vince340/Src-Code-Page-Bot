const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');
const token = fs.readFileSync('token.txt', 'utf8');

// [ true if turn on font & false if turn off ]
const useFontFormatting = true;

module.exports = {
  name: 'ai',
  description: 'Interact to Free GPT - OpenAI.',
  author: 'Arn', // API by Kenlie Navacilla Jugarap

  async execute(senderId, args) {
    const pageAccessToken = token;
    const query = args.join(" ").toLowerCase();

    if (!query) {
      const defaultMessage = "⛷𝙅e 𝒗𝒐𝒖𝒔 𝒑𝒓𝒊𝒆 ძe me ⍴résen𝗍er 𝒍𝒂 𝒒𝒖𝒆𝒔𝒕𝒊𝒐𝒏 𝙨𝙚𝙡𝙤𝙣 𝙫𝙤𝙩𝙧𝙚 préférence⚜, 𝙚𝙩 𝙟𝙚 𝙢'𝙚𝙢𝙥𝙡𝙤𝙞𝙚𝙧𝙖𝙞 à 𝕧𝕠𝕦𝕤 𝕠𝕗𝕗𝕣𝕚𝕣 𝕦𝕟𝕖 réponse 𝕡𝕖𝕣𝕥𝕚𝕟𝕖𝕟𝕥𝕖 𝕖𝕥 adéquate.❤ 𝐒𝐚𝐜𝐡𝐞𝐳 𝐪𝐮𝐞 𝐯𝐨𝐭𝐫𝐞 𝐬𝐚𝐭𝐢𝐬𝐟𝐚𝐜𝐭𝐢𝐨𝐧 𝐝𝐞𝐦𝐞𝐮𝐫𝐞 𝐦𝐚 𝐩𝐫𝐢𝐨𝐫𝐢𝐭é à 𝐭𝐨𝐮𝐭𝐞𝐬 é𝐠𝐚𝐫𝐝𝐬😉.(merci pour votre attention)";
      const formattedMessage = useFontFormatting ? formatResponse(defaultMessage) : defaultMessage;
      return await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
    }

    if (query === "sino creator mo?" || query === "who created you?") {
      const jokeMessage = "Arn/Rynx Gaiser";
      const formattedMessage = useFontFormatting ? formatResponse(jokeMessage) : jokeMessage;
      return await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
    }

    await handleChatResponse(senderId, query, pageAccessToken);
  },
};

const handleChatResponse = async (senderId, input, pageAccessToken) => {
  const apiUrl = "https://kaiz-apis.gleeze.com/api/bert-ai";

  try {
    const aidata = await axios.get(apiUrl, { params: { q: input, uid: senderId } });
    let response = aidata.data.response;

    const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

    const answeringMessage = `⏳ 𝐴𝑡𝑡𝑒𝑛𝑑𝑠 𝑢𝑛 𝑝𝑒𝑢👑...`;
    const formattedAnsweringMessage = useFontFormatting ? formatResponse(answeringMessage) : answeringMessage;
    await sendMessage(senderId, { text: formattedAnsweringMessage }, pageAccessToken);

    const defaultMessage = `𝗥𝗲𝗶𝗻𝗮/𝗠𝗿𝘀 M❤😌

♦︎|☛𝗝𝗼𝗸𝗲𝗿᭄ Sad🖤♦
✅ 𝗔𝗻𝘀𝘄𝗲𝗿: ${response}
▬▭▬ ▬▭▬✧▬▭▬ ▬▭▬
⏰ Response: ${responseTime}`;

    const formattedMessage = useFontFormatting ? formatResponse(defaultMessage) : defaultMessage;

    await sendConcatenatedMessage(senderId, formattedMessage, pageAccessToken);
  } catch (error) {
    console.error('Error while processing AI response:', error.message);

    const errorMessage = '❌ Ahh sh1t error again.';
    const formattedMessage = useFontFormatting ? formatResponse(errorMessage) : errorMessage;
    await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
  }
};

const sendConcatenatedMessage = async (senderId, text, pageAccessToken) => {
  const maxMessageLength = 2000;

  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);
    for (const message of messages) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await sendMessage(senderId, { text: message }, pageAccessToken);
    }
  } else {
    await sendMessage(senderId, { text }, pageAccessToken);
  }
};

const splitMessageIntoChunks = (message, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
};

function formatResponse(responseText) {
  const fontMap = {
    ' ': ' ',
    'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e', 'f': 'f', 'g': 'g', 'h': 'h',
    'i': 'i', 'j': 'j', 'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o', 'p': 'p', 'q': 'q',
    'r': 'r', 's': 's', 't': 't', 'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x', 'y': 'y', 'z': 'z',
    'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F', 'G': 'G', 'H': 'H',
    'I': 'I', 'J': 'J', 'K': 'K', 'L': 'L', 'M': 'M', 'N': 'N', 'O': 'O', 'P': 'P', 'Q': 'Q',
    'R': 'R', 'S': 'S', 'T': 'T', 'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X', 'Y': 'Y', 'Z': 'Z',
  };

  return responseText.split('').map(char => fontMap[char] || char).join('');
      }
