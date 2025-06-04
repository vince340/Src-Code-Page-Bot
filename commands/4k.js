const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { sendMessage } = require('../handles/sendMessage');

const getImageUrl = async (event, token) => {
  const mid = event?.message?.reply_to?.mid || event?.message?.mid;
  if (!mid) return null;

  try {
    const { data } = await axios.get(`https://graph.facebook.com/v22.0/${mid}/attachments`, {
      params: { access_token: token }
    });

    return data?.data?.[0]?.image_data?.url || data?.data?.[0]?.file_url || null;
  } catch (err) {
    console.error("Image URL fetch error:", err?.response?.data || err.message);
    return null;
  }
};

module.exports = {
  name: '4k',
  description: 'Enhance low-quality images using Pixelcut upscaler.',
  usage: '-upscale (reply to a photo)',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken, event) {
    const imageUrl = await getImageUrl(event, pageAccessToken);
    if (!imageUrl) {
      return sendMessage(senderId, { text: '❎ | Please reply to an image to enhance it.' }, pageAccessToken);
    }

    const tmpInput = path.join(__dirname, `tmp_upscale_${Date.now()}.jpg`);
    try {
      // Download the original image
      const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(tmpInput, imgResponse.data);

      // Prepare form data for Pixelcut
      const form = new FormData();
      form.append('image', fs.createReadStream(tmpInput), 'image.jpg');

      const upscaleRes = await axios.post(
        'https://api2.pixelcut.app/image/upscale/v1',
        form,
        {
          headers: {
            ...form.getHeaders(),
            'User-Agent': 'Mozilla/5.0 (Android 10)',
            'X-Client-Version': 'web',
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8'
          }
        }
      );

      const resultUrl = upscaleRes?.data?.result_url;
      if (!resultUrl) {
        return sendMessage(senderId, { text: '❎ | Upscale failed. Please try again later.' }, pageAccessToken);
      }

      // Download the upscaled image
      const resultImg = await axios.get(resultUrl, { responseType: 'arraybuffer' });
      const tmpOutput = path.join(__dirname, `tmp_result_${Date.now()}.jpg`);
      fs.writeFileSync(tmpOutput, resultImg.data);

      // Upload to Facebook
      const fbForm = new FormData();
      fbForm.append('message', JSON.stringify({
        attachment: {
          type: 'image',
          payload: { is_reusable: true }
        }
      }));
      fbForm.append('filedata', fs.createReadStream(tmpOutput));

      const uploadRes = await axios.post(
        `https://graph.facebook.com/v22.0/me/message_attachments?access_token=${pageAccessToken}`,
        fbForm,
        { headers: fbForm.getHeaders() }
      );

      const attachmentId = uploadRes.data.attachment_id;

      await axios.post(
        `https://graph.facebook.com/v22.0/me/messages?access_token=${pageAccessToken}`,
        {
          recipient: { id: senderId },
          message: {
            attachment: {
              type: 'image',
              payload: {
                attachment_id: attachmentId
              }
            }
          }
        }
      );

      fs.unlinkSync(tmpOutput);
    } catch (err) {
      console.error('Remini Error:', err.response?.data || err.message || err);
      sendMessage(senderId, { text: '❎ | Failed to upscale the image.' }, pageAccessToken);
    } finally {
      if (fs.existsSync(tmpInput)) fs.unlinkSync(tmpInput);
    }
  }
};
