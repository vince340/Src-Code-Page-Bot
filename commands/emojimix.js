const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  name: 'emojimix',
  description: 'Mixes two emojis into one image.',
  usage: 'emojimix <emoji1> <emoji2>',
  author: 'Your Name',

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Predefined list of random emojis to use if user doesn't provide two
    const randomEmojis = ['😂', '❤️', '🔥', '😊', '🤔', '👍', '🙌', '🥺', '💀', '🎉', '😜'];
    
    // If less than two emojis are provided, choose random emojis
    const [emoji1 = randomEmojis[Math.floor(Math.random() * randomEmojis.length)], emoji2 = randomEmojis[Math.floor(Math.random() * randomEmojis.length)]] = args;

    const apiUrl = `https://betadash-uploader.vercel.app/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`;
    
    // Notify user that the image is being generated and start timer
    const startTime = Date.now();
    await sendMessage(senderId, { text: `⌛ Generating emoji mix for ${emoji1} + ${emoji2}, please wait...` }, pageAccessToken);

    try {
      // Send the generated emoji mix to the user as an image attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl
          }
        }
      }, pageAccessToken);

      // Calculate and send the response time
      const endTime = Date.now();
      const responseTime = ((endTime - startTime) / 1000).toFixed(2);
      await sendMessage(senderId, { text: `✅ Emoji mix created in ${responseTime} seconds!` }, pageAccessToken);

    } catch (error) {
      // Handle and log any errors during emoji mix generation
      console.error('Error generating emoji mix:', error);

      // Notify user of the error
      await sendMessage(senderId, {
        text: 'Oops! Something went wrong while generating the emoji mix.'
      }, pageAccessToken);
    }
  }
}
