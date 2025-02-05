const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Function to get the image URL from a Facebook message reply
const getImageUrl = async (event, token) => {
  const mid = event?.message?.reply_to?.mid;
  if (!mid) return null;
  try {
    const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
      params: { access_token: token }
    });
    return data?.data?.[0]?.image_data?.url || null;
  } catch (err) {
    console.error("Image URL fetch error:", err);
    return null;
  }
};

module.exports = {
  name: 'imgur',
  description: 'Upload images to Imgur using a specific API.',
  usage: '-imgur (reply to an image)',

  async execute(senderId, args, pageAccessToken, event) {
    const imageUrl = await getImageUrl(event, pageAccessToken);
    if (!imageUrl) return sendMessage(senderId, { text: 'No image found to upload. Please reply to an image.' }, pageAccessToken);

    const apiUrl = `https://api.kenliejugarap.com/imgur/?mediaLink=${encodeURIComponent(imageUrl)}`;

    try {
      const response = await axios.get(apiUrl);
      if (response.data.status) {
        const imgUrl = response.data.message;
        await sendMessage(senderId, { text: `Image uploaded to Imgur: ${imgUrl}` }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'Failed to upload image to Imgur.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      sendMessage(senderId, { text: 'An error occurred while uploading the image.' }, pageAccessToken);
    }
  }
};