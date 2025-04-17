const axios = require('axios');

module.exports = {
  name: 'ytmp4',
  description: 'Search Youtube Song And Download!',
  author: 'Dale Mekumi', 
  usage: 'ytmp3 songtitle',
  async execute(senderId, args, pageAccessToken, sendMessage) {

    const prompt = args.join(' ');
    if (!prompt) return sendMessage(senderId, { text: "𝑼𝒔𝒂𝒈𝒆: 𝒚𝒕𝒎𝒑4 𝒕𝒊𝒕𝒍𝒆" }, pageAccessToken);
    
    sendMessage(senderId, { text: "⚙ 𝑺𝒆𝒂𝒓𝒄𝒉𝒊𝒏𝒈 𝑽𝒊𝒅𝒆𝒐 𝑷𝒍𝒆𝒂𝒔𝒆 𝑾𝒂𝒊𝒕..." }, pageAccessToken);

    try {
    const response = await axios.get(`https://search.iyot.plus/ytsearch?title=${encodeURIComponent(prompt)}`);
      const info = response.data.results[0];
      const title = info.title;
      const url = info.link;
      
      const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
      
      
      sendMessage(senderId, { 
        text: `𝗬𝗼𝘂𝘁𝘂𝗯𝗲 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿\n\n🤖𝑻𝒊𝒕𝒍𝒆: ${title}\n\n𝑼𝒓𝒍: ${url}\n\n⏰ 𝗔𝘀𝗶𝗮/𝗠𝗮𝗻𝗶𝗹𝗮: ${responseTime}\n\n𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒊𝒏𝒈 𝑺𝒐𝒏𝒈 𝑷𝒍𝒆𝒂𝒔𝒆 𝑾𝒂𝒊𝒕...` 
      }, pageAccessToken);
      
      
      
      
       const responses = await axios.get(`https://downloader.iyot.plus/ytdl?url=${url}&type=mp3`);
      const dlink = responses.data.download;
     // const url = info.url;

      

      const audiomessage = {
    attachment: {
      type: 'video',
      payload: {
        url: dlink,
      },
    },
  };
  await sendMessage(senderId, audiomessage, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}` }, pageAccessToken);
    }
  }
};
