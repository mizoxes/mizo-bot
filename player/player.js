/**
 *            mizo-bot
 *   A multi-function Discord bot
 * 
 * @author mizoxes (Hamza EL KAICHE)
 * 
 */

const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const DiscordVoice = require("@discordjs/voice");

let player = {
    audioPlayer: new DiscordVoice.createAudioPlayer({
        behaviors: {
            noSubscriber: DiscordVoice.NoSubscriberBehavior.Play
        }
    }),

    playing: false,

    async getSongFromYoutube(str) {
        const song = {};
        if (ytdl.validateURL(str)) {
            const songInfo = await ytdl.getInfo(str);
            song.title = songInfo.videoDetails.title;
            song.url = songInfo.videoDetails.video_url;
        }
        else {
            const searchResult = await ytSearch(str);
            const video = (searchResult.videos.length > 1) ? searchResult.videos[0] : null;
            if (video) {
                song.title = video.title;
                song.url = video.url;
            }
            else {
                return null;
            }
        }
        return song;
    },

    async play(info) {
        const song = await this.getSongFromYoutube(info.song);
        if (!song) {
            info.textChannel.send("can't find that song on youtube");
            return;
        }

        if (!this.playing) {
            this.textChannel = info.textChannel;
            this.voiceChannel = info.voiceChannel;
            this.voiceConnection = DiscordVoice.joinVoiceChannel({
                channelId: info.voiceChannel.id,
                guildId: info.voiceChannel.guild.id,
                adapterCreator: info.voiceChannel.guild.voiceAdapterCreator
            });
            this.songQueue = [song];

            this.voiceConnection.subscribe(this.audioPlayer);

            this.playing = true;
            this.playFirstSongInQueue();
        }
        else {
            this.songQueue.push(song);
            this.textChannel.send(`${song.title} has been added to the queue`);
        }

        return song;
    },

    playFirstSongInQueue() {
        if (!this.songQueue[0]) {
            this.leave();
            //this.playing = false;
            return;
        }

        this.audioPlayer.play(DiscordVoice.createAudioResource(ytdl(this.songQueue[0].url), {
            //inputType: "opus",
            inlineVolume: false
        }));

        this.textChannel.send(`now playing ${this.songQueue[0].title}`);
    },

    skipToNextSong() {
        if (this.playing) {
            this.songQueue.shift();
            this.playFirstSongInQueue();
        }
    },

    pause() {
        if (this.playing) {
            this.playing = false;
            this.audioPlayer.pause();
        }  
    },

    resume() {
        if (!this.playing) {
            this.playing = true;
            this.audioPlayer.unpause();
        }
    },

    leave() {
        if (this.playing) {
            this.playing = false;
            this.voiceConnection.destroy();
        }
    },

    isPlaying() {
        return this.playing;
    },

    getSongQueue() {
        return this.songQueue;
    }
};

player.audioPlayer.on(DiscordVoice.AudioPlayerStatus.Idle, () => {
    player.songQueue.shift();
    player.playFirstSongInQueue();
    console.log("idle");
});

module.exports = player;