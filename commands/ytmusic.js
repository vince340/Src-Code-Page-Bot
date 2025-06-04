const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const ytsr = require('@distube/ytsr');

const BASE_URL = 'https://snap-video3.p.rapidapi.com/download';

module.exports = {
    name: 'ytmusic',
    description: 'Searches for songs on YouTube and provides audio links.',
    usage: '-ytmusic <song name>',
    author: 'coffee',

    async execute(senderId, args, pageAccessToken) {
        if (!args.length) return sendMessage(senderId, { text: 'Error: Please provide a song title.' }, pageAccessToken);
        await searchSong(senderId, args.join(' '), pageAccessToken);
    }
};

const searchSong = async (senderId, songName, pageAccessToken) => {
    try {
        // Search for the song using ytsr first
        const song = (await ytsr(`${songName}, official music video.`, { limit: 1 })).items[0];
        if (!song) return sendMessage(senderId, { text: 'Error: Could not find song.' }, pageAccessToken);

        const encodedParams = new URLSearchParams();
        encodedParams.set('url', song.url);

        const options = {
            method: 'POST',
            url: BASE_URL,
            headers: {
                'x-rapidapi-key': '28077613bemshd5a2d7ee4aea83ep17d768jsn7e4822c17d3c',
                'x-rapidapi-host': 'snap-video3.p.rapidapi.com',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: encodedParams,
        };

        const { data } = await axios.request(options);

        if (!data || !data.url || !data.medias) return sendMessage(senderId, { text: 'Error: Unable to retrieve song details.' }, pageAccessToken);

        const { title, thumbnail, duration, medias } = data;

        // Find the media with mp3 extension
        const mp3Media = medias.find(media => media.extension === 'mp3');

        // Send the song title, duration, and thumbnail in a template attachment
        await sendMessage(senderId, {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [{
                        title: `🎧 Title: ${title}`,
                        image_url: thumbnail,
                        subtitle: `Duration: ${duration}`
                    }]
                }
            }
        }, pageAccessToken);

        // Send the audio download link for the mp3 media
        if (mp3Media) {
            await sendMessage(senderId, {
                attachment: { type: 'audio', payload: { url: mp3Media.url } }
            }, pageAccessToken);
        } else {
            sendMessage(senderId, { text: 'Error: No mp3 file available for download.' }, pageAccessToken);
        }
    } catch (error) {
        console.error('Error fetching music track:', error);
        sendMessage(senderId, { text: 'Error: Unexpected error occurred.' }, pageAccessToken);
    }
};