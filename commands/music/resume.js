const { prefix } = require('../../config.json');
const player = require('../../player/player.js');

module.exports = {
    name: 'resume',
    category: 'music',
    usage: `${prefix}resume`,

    execute(client, message, args) {
        player.resume();

        message.channel.send({
            embeds: [{
                color: 3447003,
                author: { name: "resuming" },
                footer: { text: "" },
                fields: [
                    { name: "f", value: 'f' },
                ],
                timestamp: new Date(),
                description: ""
            }]
        });
    }
};