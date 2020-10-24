const Discord = require("discord.js");

const possible_words = require("./hangman-words.json");

//unicode fun...
const letterEmojisMap = {
  "🅰️": "A",
  "🇦": "A",
  "🅱️": "B",
  "🇧": "B",
  "🇨": "C",
  "🇩": "D",
  "🇪": "E",
  "🇫": "F",
  "🇬": "G",
  "🇭": "H",
  ℹ️: "I",
  "🇮": "I",
  "🇯": "J",
  "🇰": "K",
  "🇱": "L",
  "Ⓜ️": "M",
  "🇲": "M",
  "🇳": "N",
  "🅾️": "O",
  "⭕": "O",
  "🇴": "O",
  "🅿️": "P",
  "🇵": "P",
  "🇶": "Q",
  "🇷": "R",
  "🇸": "S",
  "🇹": "T",
  "🇺": "U",
  "🇻": "V",
  "🇼": "W",
  "✖️": "X",
  "❎": "X",
  "❌": "X",
  "🇽": "X",
  "🇾": "Y",
  "💤": "Z",
  "🇿": "Z",
};

class HangmanGame {
  constructor() {
    this.gameEmbed = null;
    this.inGame = false;
    this.word = "";
    this.guesssed = [];
    this.wrongs = 0;
  }

  newGame(msg) {
    if (this.inGame) return;

    this.inGame = true;
    this.word = possible_words[
      Math.floor(Math.random() * possible_words.length)
    ].toUpperCase();
    this.guesssed = [];
    this.wrongs = 0;

    const embed = new Discord.MessageEmbed()
      .setColor("#db9a00")
      .setTitle("Hangman")
      .setDescription(this.getDescription())
      .addField("Letters Guessed", "\u200b")
      .addField(
        "How To Play",
        "Reply to this message with the letter you want to guess"
      )
      .setTimestamp();

    msg.channel.send(embed).then((emsg) => {
      this.gameEmbed = emsg;
      this.waitForReaction();
    });
  }

  makeGuess(letter) {
    if (!this.guesssed.includes(letter)) {
      this.guesssed.push(letter);

      if (this.word.indexOf(letter) == -1) {
        this.wrongs++;

        if (this.wrongs == 6) {
          this.gameOver(false);
        }
      } else if (
        !this.word
          .split("")
          .map((l) => (this.guesssed.includes(l) ? l : "_"))
          .includes("_")
      ) {
        this.gameOver(true);
      }
    }

    if (this.inGame) {
      const editEmbed = new Discord.MessageEmbed()
        .setColor("#db9a00")
        .setTitle("Hangman")
        .setDescription(this.getDescription())
        .addField(
          "Letters Guessed",
          this.guesssed.length == 0 ? "\u200b" : this.guesssed.join(" ")
        )
        .addField(
          "How To Play",
          "Reply to this message with the letter you want to guess"
        )
        .setTimestamp();
      this.gameEmbed.edit(editEmbed);
      this.waitForReaction();
    }
  }

  gameOver(win) {
    this.inGame = false;
    const editEmbed = new Discord.MessageEmbed()
      .setColor("#db9a00")
      .setTitle("Hangman")
      .setDescription(
        (win ? "Chat Wins!" : "Chat losses") + "\n\nThe Word was:\n" + this.word
      )
      .setTimestamp();
    this.gameEmbed.edit(editEmbed);

    this.gameEmbed.reactions.removeAll();
  }

  getDescription() {
    return (
      "```" +
      "|‾‾‾‾‾‾|   \n|     " +
      (this.wrongs > 0 ? "🎩" : " ") +
      "   \n|     " +
      (this.wrongs > 1 ? "😟" : " ") +
      "   \n|     " +
      (this.wrongs > 2 ? "👕" : " ") +
      "   \n|     " +
      (this.wrongs > 3 ? "🩳" : " ") +
      "   \n|    " +
      (this.wrongs > 4 ? "👞👞" : " ") +
      "   \n|     \n|__________\n\n" +
      this.word
        .split("")
        .map((l) => (this.guesssed.includes(l) ? l : "_"))
        .join(" ") +
      "```"
    );
  }

  waitForReaction() {
    // Only use reactions that are just one letter
    const filter = (m) => m.content.length == 1;

    this.gameEmbed.channel
      .awaitMessages(filter, {
        // Give the user(s) 30 seconds to guess
        time: 30000,
        // Only wait for 1 message
        max: 1,
        // Error when times out
        errors: ["time"],
      })
      .then((collected) => {
        // Make the letter uppercase
        const letter = collected.first().content.toUpperCase();
        // Make a guess!
        this.makeGuess(letter);
        // Delete the guess message
        collected
          .first()
          .delete()
          .catch((a) => null);
      })
      .catch(() => this.gameOver(false));
  }
}

module.exports = HangmanGame;
