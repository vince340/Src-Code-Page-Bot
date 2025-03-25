 const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'draw',  // Command name
  description: 'generates an image based on a prompt',  // Description
  usage: 'draw [prompt]',  // Usage
  author: 'Raniel',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if prompt arguments are provided
    if (!args || args.length === 0) {
      // Send message requesting a prompt if missing
      await sendMessage(senderId, {
        text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗽𝗿𝗼𝗺𝗽𝘁\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: draw 𝗱𝗼𝗴.'
      }, pageAccessToken);
      return;  // Exit the function if no prompt is provided
    }

    // Concatenate arguments to form the prompt
    const prompt = args.join(' ');
    const apiUrl = `https://kaiz-apis.gleeze.com/api/text2image?prompt=${encodeURIComponent(prompt)}`;  // API endpoint with the prompt

    // Notify user that the image is being generated
    await sendMessage(senderId, { text: '⌛ 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲 𝗯𝗮𝘀𝗲𝗱 𝗼𝗻 𝘆𝗼𝘂𝗿 𝗽𝗿𝗼𝗺𝗽𝘁, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      // Send the generated image to the user as an attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl  // URL of the generated image
          }
        }
      }, pageAccessToken);

    } catch (error) {
      // Handle and log any errors during image generation
      console.error('Error generating image:', error);
      
      // Notify user of the error
      await sendMessage(senderId, {
        text: 'An error occurred while generating the image. Please try again later.'
      }, pageAccessToken);
    }
  }
};
