const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const HangmanGame = require('./hangman-game');
const client = new Discord.Client();

const hangman = new HangmanGame(client);


client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', msg => {
	if (msg.content.toLowerCase() === `${prefix}hangman`) {
		hangman.newGame(msg);
	}
	else if (msg.content.includes('gay')) {
		msg.channel.send('Lol gay');
	}
});

// eslint-disable-next-line no-undef
client.login(process.env.BOT_TOKEN);