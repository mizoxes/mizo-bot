const { prefix } = require('../../config.json');
const player = require('../../player/player.js');

module.exports = {
    name: 'pause',
    category: 'music',
    usage: `${prefix}pause`,

    execute(client, message, args) {
        player.pause();

        message.channel.send({
            embeds: [{
                color: 3447003,
                author: { name: "pausing" },
                footer: { text: "" },
                fields: [
                    { name: "f", value: 'f' },
                ],
                timestamp: new Date(),
                description: "commands"
            }]
        });
    }
};