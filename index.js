const Discord = require('discord.js');
const HangmanGame = require('./hangman-game');
const client = new Discord.Client();
const { prefix } = require('./config.json');
const hangman = new HangmanGame(client);


client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', msg => {
	if(message.author.bot) return;

	if (msg.content.toLowerCase() === `${prefix}hangman`) {
		hangman.newGame(msg);
	}
	else if (message.content.toLowerCase() === "mhm") {
		message.channel.send("mhm")
	}
});

// eslint-disable-next-line no-undef
client.login(process.env.BOT_TOKEN);