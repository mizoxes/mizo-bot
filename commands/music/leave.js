const { prefix } = require('../../config.json');
const player = require('../../player/player.js');

module.exports = {
    name: 'leave',
    category: 'music',
    usage: `${prefix}leave`,
    aliases: ["fuckoff"],

    execute(client, message, args) {
        player.leave();

        message.channel.send({
            embeds: [{
                color: 3447003,
                author: { name: "leaving" },
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