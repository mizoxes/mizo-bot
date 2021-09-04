const { prefix } = require('../../config.json');

module.exports = {
    name: 'help',
    category: 'core',
    usage: `${prefix}help [command name]`,

    execute(client, message, args) {
        let musicCommands = message.client.commands
        .filter(command => command.category == "music")
        .map(command => '`' + command.name + '`').join(', ');

        if (!musicCommands) musicCommands = 'none';

        message.channel.send({
            embeds: [{
                color: 3447003,
                author: { name: "help pannel" },
                footer: { text: "<:poop:883767920428200037>" },
                fields: [
                    { name: "help", value: '`help`' },
                    { name: "music", value: musicCommands }
                ],
                timestamp: new Date(),
                description: "commands"
            }]
        });
    }
};