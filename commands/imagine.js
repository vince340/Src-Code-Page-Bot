const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'imagine',  // Command name
  description: 'generates an image based on a prompt',  // Description
  usage: 'imagine [prompt]',  // Usage
  author: 'MakoyQx',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if prompt arguments are provided
    if (!args || args.length === 0) {
      // Send message requesting a prompt if missing
      await sendMessage(senderId, {
        text: '❌ Veuillez fournir une description.\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: imagine un chien.'
      }, pageAccessToken);
      return;  // Exit the function if no prompt is provided
    }

    // Concatenate arguments to form the prompt
    const prompt = args.join(' ');
    const apiUrl = `https://kaiz-apis.gleeze.com/api/flux?prompt=${encodeURIComponent(prompt)}&model=4`;  // API endpoint with the prompt

    // Notify user that the image is being generated
    await sendMessage(senderId, { text: '📸Generating...' }, pageAccessToken);

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
