const { prefix } = require('../../config.json');
const player = require('../../player/player.js');

module.exports = {
    name: 'queue',
    category: 'music',
    usage: `${prefix}queue`,

    execute(client, message, args) {
        const queue = player.getSongQueue();
        let str = '';
        for (const song of queue) {
            str += song.title + '\n';
        }

        message.channel.send({
            embeds: [{
                color: 3447003,
                author: { name: "Queue" },
                footer: { text: "" },
                fields: [
                    { name: "songs", value: str },
                ],
                timestamp: new Date(),
                description: ""
            }]
        });
    }
};