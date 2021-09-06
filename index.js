/**
 *            mizo-bot
 *   A multi-function Discord bot
 * 
 * @author mizoxes (Hamza EL KAICHE)
 * 
 */

const fs = require("fs");
const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client({
    disableMentions: 'everyone',
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_VOICE_STATES"
    ]
});

client.config = config;
client.commands = new Discord.Collection();

fs.readdirSync("./commands")
.forEach(dir => {
    fs.readdirSync(`./commands/${dir}`)
    .filter(file => file.endsWith(".js"))
    .forEach(file => {
        const command = require(`./commands/${dir}/${file}`);
        client.commands.set(command.name.toLowerCase(), command);
    });
});

client.on("messageCreate", message => {
    if (message.author.bot || !message.content.startsWith(config.prefix))
        return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
    cmd ? cmd.execute(client, message, args) : message.reply("unknown command");
});

client.login(client.config.token);