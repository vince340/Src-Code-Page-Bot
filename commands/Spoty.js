const axios = require('axios');

module.exports = {
  name: 'sp',
  description: 'Get a Spotify link for a song',
  author: 'Deku (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const query = args.join(' ');

    try {
      const apiUrl = `https://hiroshi-api.onrender.com/tiktok/spotify?search=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);

      // Extract the Spotify download link from the response
      const spotifyDownloadLink = response.data[0].download;

      if (spotifyDownloadLink) {
        // Send the MP3 file as a generic file attachment
        sendMessage(senderId, {
          attachment: {
            type: 'file',
            payload: {
              url: spotifyDownloadLink,
              is_reusable: true
            }
          }
        }, pageAccessToken);

        // After sending the file, send Quick Replies
        sendMessage(senderId, {
          text: 'What would you like to do next?',
          quick_replies: [
            {
              content_type: 'text',
              title: 'Search another song',
              payload: 'SEARCH_ANOTHER_SONG'
            },
            {
              content_type: 'text',
              title: 'Help',
              payload: 'HELP'
            }
          ]
        }, pageAccessToken);

      } else {
        sendMessage(senderId, { text: 'Sorry, no Spotify link found for that query.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error retrieving Spotify link:', error);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
