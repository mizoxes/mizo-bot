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
const spotify = require("./spotify");

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
        let songs;
        
        if (info.song.includes("open.spotify.com/playlist/")) {
            const playlist = await spotify.getPlaylistFromSpotify(info.song);
            playlist.forEach(track => {
                songs.push({title: track, url: ''});
            });
        }
        else {
            songs = [{title: info.song, url: ''}];
        }
        
        if (!this.playing) {
            this.textChannel = info.textChannel;
            this.voiceChannel = info.voiceChannel;
            this.voiceConnection = DiscordVoice.joinVoiceChannel({
                channelId: info.voiceChannel.id,
                guildId: info.voiceChannel.guild.id,
                adapterCreator: info.voiceChannel.guild.voiceAdapterCreator
            });
            this.songQueue = songs;

            this.voiceConnection.subscribe(this.audioPlayer);

            this.playing = true;
            this.playFirstSongInQueue();
        }
        else {
            songs.forEach(song => this.songQueue.push(song));
            //this.textChannel.send(`${songs[0].title} has been added to the queue`);
        }
    },

    async playFirstSongInQueue() {
        if (!this.songQueue[0]) {
            this.leave();
            return;
        }

        if (!this.songQueue[0].url) {
            this.songQueue[0] = await this.getSongFromYoutube(this.songQueue[0].title);
            if (!this.songQueue[0]) {
                info.textChannel.send("can't find that song on youtube");
                return;
            }
        }

        this.audioPlayer.play(DiscordVoice.createAudioResource(ytdl(this.songQueue[0].url), {
            //inputType: DiscordVoice.StreamType.OggOpus,
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
            this.audioPlayer.stop(true);
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
    console.log("idle");
    player.songQueue.shift();
    player.playFirstSongInQueue();
});

module.exports = player;