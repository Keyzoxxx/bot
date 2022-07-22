const Discord = require('discord.js');
const intents = new Discord.Intents(32767);
const bot = new Discord.Client();

bot.start(process.env.TOKEN)
