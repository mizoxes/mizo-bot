const { prefix } = require('../../config.json');
const player = require('../../player/player.js');

module.exports = {
    name: 'play',
    category: 'music',
    usage: `${prefix}play [name/URL]`,
    aliases: ['p'],

    execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            message.channel.send("you must be in a voice channel to use this command");
            return;
        }

        const permissions = voiceChannel.permissionsFor(client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            message.channel.send("I don't have the permissions to join/speak in your voice channel");
            return;
        }

        player.play({
            song: args.join(' '),
            textChannel: message.channel,
            voiceChannel: voiceChannel
        });
        
        /*.then((title, url) => {
            message.channel.send({
                embeds: [{
                    color: 3447003,
                    author: { name: "now playing" },
                    footer: { text: "" },
                    fields: [
                        { name: "f", value: "f" },
                    ],
                    timestamp: new Date(),
                    description: ""
                }]
            });
        }
        );*/
    }
};