const axios = require("axios");
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: "gemini",
  description: "interact to gemini 1.5 flash vision",
  author: "developer",

  async execute(senderId, args, pageAccessToken, event, imageUrl) {
    const userPrompt = args.join(" ");

    if (!userPrompt && !imageUrl) {
      return sendMessage(senderId, { 
        text: `❌ 𝗣𝗿𝗼𝘃𝗶𝗱𝗲𝗱 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻 𝗼𝗿 𝗶𝗺𝗮𝗴𝗲 𝗮𝗻𝗱 𝘁𝘆𝗽𝗲 𝘆𝗼𝘂𝗿 𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻 𝘁𝗼 𝗿𝗲𝗰𝗼𝗴𝗻𝗶𝘇𝗲...` 
      }, pageAccessToken);
    }

    try {
      if (!imageUrl) {
        if (event.message.reply_to && event.message.reply_to.mid) {
          imageUrl = await getRepliedImage(event.message.reply_to.mid, pageAccessToken);
        } else if (event.message?.attachments && event.message.attachments[0]?.type === 'image') {
          imageUrl = event.message.attachments[0].payload.url;
        }
      }

      // Use both APIs
      const apiUrlGemini = `https://joshweb.click/gemini`;
      const apiUrlGpt4o = `https://joshweb.click/gemini`;

      const responseGemini = await handleImageRecognition(apiUrlGemini, userPrompt, imageUrl);
      const responseGpt4o = await handleImageRecognition(apiUrlGpt4o, userPrompt, imageUrl);

      const result = responseGpt4o.gemini || responseGemini.gemini; // Prioritize response from the new API

      // Check for image generation
      if (result.includes('TOOL_CALL: generateImage')) {
        const imageUrlMatch = result.match(/\!\[.*?\]\((https:\/\/.*?)\)/);
        if (imageUrlMatch && imageUrlMatch[1]) {
          const generatedImageUrl = imageUrlMatch[1];
          await sendMessage(senderId, {
            attachment: {
              type: 'image',
              payload: { url: generatedImageUrl }
            }
          }, pageAccessToken);
        }
      }

      // Get the current response time in Manila timezone
      const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

      // Format the response message
      const message = `━━━━━━━━━━━━━━━━━━
${result}━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗧𝗶𝗺𝗲: ${responseTime}`;

      await sendConcatenatedMessage(senderId, message, pageAccessToken);

    } catch (error) {
      console.error("Error in Gemini command:", error);
      sendMessage(senderId, { text: `Error: ${error.message || "Something went wrong."}` }, pageAccessToken);
    }
  }
};

async function handleImageRecognition(apiUrl, prompt, imageUrl) {
  const { data } = await axios.get(apiUrl, {
    params: {
      prompt,
      url: imageUrl || ""
    }
  });

  return data;
}

async function getRepliedImage(mid, pageAccessToken) {
  const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
    params: { access_token: pageAccessToken }
  });

  if (data && data.data.length > 0 && data.data[0].image_data) {
    return data.data[0].image_data.url;
  } else {
    return "";
  }
}

async function sendConcatenatedMessage(senderId, text, pageAccessToken) {
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
}

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}
