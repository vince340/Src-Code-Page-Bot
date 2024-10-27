const a = require("axios"),
      t = require("tinyurl");

const fontMap = {
  ' ': ' ',
  'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡',
  'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪',
  'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
  'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇',
  'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐',
  'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
  '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
};

function normalizeText(text) {
  const boldPattern = /\*\*(.*?)\*\*/g;

  function applyFontMap(str) {
    return str
      .split('')
      .map(char => fontMap[char] || char)
      .join('');
  }

  return text.replace(boldPattern, (match, p1) => `${applyFontMap(p1)}`);
}

function formatResponse(content) {
  const header = `🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\n`;
  const footer = `━━━━━━━━━━━━━━━━`;
  return `${header}${content.trim()}\n${footer}`;
}

global.api = {
  s: "https://www.samirxpikachu.run" + ".place",
  fallbacks: [
    "http://samirxpikachuio.onrender.com",
    "http://samirxzy.onrender.com"
  ]
};

async function fetchFromAPI(url) {
  try {
    const response = await a.get(url);
    return response;
  } catch (error) {
    console.error("Primary API failed:", error.message);
    for (const fallback of global.api.fallbacks) {
      try {
        const response = await a.get(url.replace(global.api.s, fallback));
        return response;
      } catch (error) {
        console.error("Fallback API failed:", error.message);
      }
    }
    throw new Error("All APIs failed.");
  }
}

module.exports = {
  config: {
    name: "ai", 
    version: "1.0",
    author: "Samir OE",
    countDown: 5,
    role: 0,
    category: "ai"
  },
  onStart: async function({ message: m, event: e, args: r, commandName: n }) {
    try {
      let s;
      const i = e.senderID;

      if ("message_reply" === e.type && ["photo", "sticker"].includes(e.messageReply.attachments?.[0]?.type)) {
        s = await t.shorten(e.messageReply.attachments[0].url);
      }

      const o = r.join(" ") + ", short direct answer";
      const url = s ? `&url=${encodeURIComponent(s)}` : '';

      const apiURL = `${global.api.s}/gemini?text=${encodeURIComponent(o)}&system=default${url}&uid=${i}`;
      const c = await fetchFromAPI(apiURL);

      if (c.data && c.data.candidates && c.data.candidates.length > 0) {
        const responseText = normalizeText(c.data.candidates[0].content.parts[0].text);
        const formattedMessage = formatResponse(responseText);

        m.reply({
          body: formattedMessage
        }, (r, o) => {
          global.GoatBot.onReply.set(o.messageID, {
            commandName: n,
            messageID: o.messageID,
            author: i
          });
        });
      }

    } catch (t) {
      console.error("Error:", t.message);
    }
  },

  onReply: async function({ message: m, event: e, Reply: r, args: n }) {
    try {
      let { author: o, commandName: c } = r;
      if (e.senderID !== o) return;

      const i = n.join(" ") + ", short direct answer";
      const apiURL = `${global.api.s}/gemini?text=${encodeURIComponent(i)}&system=default&uid=${e.senderID}`;

      const d = await fetchFromAPI(apiURL);

      if (d.data && d.data.candidates && d.data.candidates.length > 0) {
        const responseText = normalizeText(d.data.candidates[0].content.parts[0].text);
        const formattedMessage = formatResponse(responseText);

        m.reply({
          body: formattedMessage
        }, (t, n) => {
          global.GoatBot.onReply.set(n.messageID, {
            commandName: c,
            messageID: n.messageID,
            author: e.senderID
          });
        });
      }

    } catch (t) {
      console.error("Error:", t.message);
    }
  },

  onChat: async function({ message: m, event: e, args: r }) {
    try {
      const i = e.senderID;
      const text = r.join(" ").trim();

      if (/^(-?[aA][iI])\s*$/.test(text)) {
        let query = 'hello'; 

        const apiURL = `${global.api.s}/gemini?text=${encodeURIComponent(query)}&system=default&uid=${i}`;
        const c = await fetchFromAPI(apiURL);

        if (c.data && c.data.candidates && c.data.candidates.length > 0) {
          const responseText = normalizeText(c.data.candidates[0].content.parts[0].text);
          const formattedMessage = formatResponse(responseText);

          m.reply({
            body: formattedMessage
          }, (r, o) => {
            global.GoatBot.onReply.set(o.messageID, {
              commandName: 'ai',
              messageID: o.messageID,
              author: i
            });
          });
        }

      } else if (/^(-?[aA][iI])\s/.test(text)) {
        let query = text.replace(/^(-?[aA][iI])\s/, '').trim(); // User-provided query text
        query += ", short direct answer.";

        const apiURL = `${global.api.s}/gemini?text=${encodeURIComponent(query)}&system=default&uid=${i}`;
        const c = await fetchFromAPI(apiURL);

        if (c.data && c.data.candidates && c.data.candidates.length > 0) {
          const responseText = normalizeText(c.data.candidates[0].content.parts[0].text);
          const formattedMessage = formatResponse(responseText);

          m.reply({
            body: formattedMessage
          }, (r, o) => {
            global.GoatBot.onReply.set(o.messageID, {
              commandName: 'ai',
              messageID: o.messageID,
              author: i
            });
          });
        }
      }

    } catch (t) {
      console.error("Error:", t.message);
    }
  }
};