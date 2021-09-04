const { prefix } = require('../../config.json');
const player = require('../../player/player.js');

module.exports = {
    name: 'skip',
    category: 'music',
    usage: `${prefix}skip`,
    aliases: ['fs'],

    execute(client, message, args) {
        player.skipToNextSong();

        message.channel.send({
            embeds: [{
                color: 3447003,
                author: { name: "skipping to next song" },
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