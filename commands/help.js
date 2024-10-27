const commandInfoMap = {
	ai: {
			name: "ai",
			description: "AI Based on GPT-4",
			guide: "ai what is life?"
	},
	alldl: {
			name: "alldl",
			description: "Download video content using links from Facebook, Instagram, Tiktok, Youtube, Twitter, and Spotify audio",
			guide: "alldl [link]"
	},
	blackbox: {
			name: "blackbox",
			description: "An artificial Intelligence you can ask for anything.",
			guide: "blackbox what is life?"
	},
	dalle: {
			name: "dalle",
			description: "Creates an image based on your imagination",
			guide: "dalle cat with wings"
	},
	font: {
			name: "font",
			description: "Changes your font text",
			guide: "font list\n%1font <font name> <text>"
	},
	join: {
			name: "join",
			description: "to join other existing gc",
			guide: "join and reply number 1 to 5 in the list."
	},
	gemini: {
			name: "gemini",
			description: "Google Gemini LLM",
			guide: "gemini what is life?"
	},
	gmage: {
			name: "gmage",
			description: "Search Google Images online",
			guide: "gmage cat"
	},
	help: {
			name: "help",
			description: "View all commands",
			guide: "help\n%1help <command name>"
	},
	lyrics: {
			name: "lyrics",
			description: "Fetches lyrics of a song",
			guide: "lyrics perfect by ed sheeran"
	},
	pinterest: {
			name: "pinterest",
			description: "Searches images on Pinterest",
			guide: "pinterest cat -10"
	},
	prefix: {
			name: "prefix",
			description: "View some commands and shows bot's prefix",
			guide: "prefix"
	},
	remini: {
			name: "remini",
			description: "Enhances your image to lessen the blur",
			guide: "Reply to an image and type %1remini"
	},
	removebg: {
			name: "removebg",
			description: "Remove background of an image",
			guide: "Reply to an image and type\n%1removebg or %1rbg"
	},
	spotify: {
			name: "spotify",
			description: "Plays a song available on Spotify",
			guide: "spotify perfect by ed sheeran"
	},
	tempmail: {
			name: "tempmail",
			description: "Get Temporary Emails and its Inbox messages",
			guide: "tempmail create\n%1tempmail inbox <email>"
	},
	translate: {
			name: "translate",
			description: "Translate to any language",
			guide: "Reply to the text you want to translate and type\n%1translate <language>"
	},
	unsend: {
			name: "unsend",
			description: "Deletes bot messages",
			guide: "Reply to bot message and type %1unsend"
	}
};

module.exports = {
	config: {
			name: "help",
			aliases: ["help"],
			version: 1.0,
			author: "LiANE&Coffee",
			shortDescription: { en: "View all commands" },
			category: "members",
	},
	onStart: async function({ message, args }) {
			const prefix = global.GoatBot.config.prefix; // Access the global prefix

			if (args[0]) {
					const command = args[0].toLowerCase();
					if (commandInfoMap[command]) {
							const { name, description, guide } = commandInfoMap[command];
							const response = `━━━━━━━━━━━━━━━━\n𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙽𝚊𝚖𝚎: ${name}\n𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗: ${description}\n𝙶𝚞𝚒𝚍𝚎: ${guide.replace(/%1/g, prefix)}\n━━━━━━━━━━━━━━━━`;
							return message.reply(response);
					} else {
							return message.reply("Command not found.");
					}
			} else {
					const commandsList = `━━━━━━━━━━━━━━━━
𝙰𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜:
╭─╼━━━━━━━━╾─╮
│  📖 | 𝙴𝚍𝚞𝚌𝚊𝚝𝚒𝚘𝚗
│  Ai
│  Blackbox
│  Gemini
│  Translate
╰─━━━━━━━━━╾─╯
╭─╼━━━━━━━━╾─╮
│  🖼 | 𝙸𝚖𝚊𝚐𝚎
│  Dalle
│  Gmage
│  Pinterest
│  Remini
│  Removebg
╰─━━━━━━━━━╾─╯
╭─╼━━━━━━━━╾─╮
│  🎧 | 𝙼𝚞𝚜𝚒𝚌
│  Lyrics
│  Spotify
╰─━━━━━━━━━╾─╯
╭─╼━━━━━━━━╾─╮
│  👥 | 𝙼𝚎𝚖𝚋𝚎𝚛𝚜
│  Alldl
│  Font
│  Join
│  Help
│  Prefix
│  Tempmail
│  Unsend
╰─━━━━━━━━━╾─╯
help <command name>
𝚃𝚘 𝚜𝚎𝚎 𝚑𝚘𝚠 𝚝𝚘 𝚞𝚜𝚎
𝚝𝚑𝚎 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜.

Example: help gemini
━━━━━━━━━━━━━━━━`;

					return message.reply(commandsList.replace(/%1/g, prefix));
			}
	}
};
