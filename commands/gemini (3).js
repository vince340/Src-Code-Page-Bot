const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');
const path = require('path');

// Path to the stored image data
const imageFilePath = path.join(__dirname, '../data/image.json');

module.exports = {
  name: 'gemini',
  description: 'Interact with Google Gemini for image recognition or text responses.',
  usage: 'gemini [your message] or send an image link for recognition',
  author: 'Raniel',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ').trim();

    // Check if there is an image URL stored for the sender
    const imageData = JSON.parse(fs.readFileSync(imageFilePath, 'utf8')) || {};

    if (imageData[senderId] && prompt) {
      // If there is an image URL and a user-provided query, use the "vision" endpoint for recognition
      const imgUrl = imageData[senderId];
      try {
        const visionResponse = await axios.get(`https://jerome-web.onrender.com/service/api/gemini?ask=${encodeURIComponent(prompt)}&imgurl=${encodeURIComponent(imgUrl)}`);

        if (visionResponse.data && visionResponse.data.vision) {
          // Send the vision response to the user
          await sendMessage(senderId, { text: visionResponse.data.vision }, pageAccessToken);
        } else {
          await sendMessage(senderId, { text: 'Failed to recognize the image. Please try again later.' }, pageAccessToken);
        }
      } catch (error) {
        console.error('Error recognizing the image:', error);
        await sendMessage(senderId, { text: 'An error occurred while recognizing the image. Please try again later.' }, pageAccessToken);
      } finally {
        // Remove the entry from image.json after processing
        delete imageData[senderId];
        fs.writeFileSync(imageFilePath, JSON.stringify(imageData, null, 2), 'utf8');
        console.log(`Removed stored image URL for user ${senderId}`);
      }
    } else if (!imageData[senderId] && prompt) {
      // If there is no image URL stored, proceed with the text-only response
      try {
        const textResponse = await axios.get(`https://jerome-web.onrender.com/service/api/gemini?ask=${encodeURIComponent(prompt)}&imgurl=`);

        if (textResponse.data && textResponse.data.textResponse) {
          // Send the text response to the user
          await sendMessage(senderId, { text: textResponse.data.textResponse }, pageAccessToken);
        } else {
          await sendMessage(senderId, { text: 'Failed to generate a response. Please try again later.' }, pageAccessToken);
        }
      } catch (error) {
        console.error('Error generating text response:', error);
        await sendMessage(senderId, { text: 'An error occurred while generating a response. Please try again later.' }, pageAccessToken);
      }
    } else {
      // If no prompt is provided and there is no stored image URL
      await sendMessage(senderId, { text: "Usage: gemini <your query> or send an image for recognition" }, pageAccessToken);
    }
  }
};