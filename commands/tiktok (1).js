const axios = require("axios");
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: "tiktok",
  description: "Search for TikTok videos",
  author: "chill",

  async execute(senderId, args, pageAccessToken) {
    try {
      const searchQuery = args.join(" ");
      if (!searchQuery) {
        return sendMessage(senderId, { text: "Usage: tiktok <search text>" }, pageAccessToken);
      }

      // Send an initial message indicating that the search is in progress
      sendMessage(senderId, { text: "🤳 | Searching, please wait..." }, pageAccessToken);

      
      const response = await axios.get(`https://markdevs69v2-679r.onrender.com/new/api/tiksearch?search=${encodeURIComponent(searchQuery)}`);

      const videos = response.data.data.videos;

      if (!videos || videos.length === 0) {
        return sendMessage(senderId, { text: "No videos found for the given search query." }, pageAccessToken);
      }

      // Get the first video from the search results
      const videoData = videos[0];
      const videoUrl = videoData.play;


      const message = `📹 TikTok Result:\n\n👤 Post by: ${videoData.author.nickname}\n🔗 Username: ${videoData.author.unique_id}\n\n📝 Title: ${videoData.title}`;

      
      sendMessage(senderId, { text: message }, pageAccessToken);

      
      sendMessage(senderId, {
        attachment: {
          type: 'video',
          payload: {
            url: videoUrl,
            is_reusable: true
          }
        }
      }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: "An error occurred while processing the request." }, pageAccessToken);
    }
  }
};
