/**
 *            mizo-bot
 *   A multi-function Discord bot
 * 
 * @author mizoxes (Hamza EL KAICHE)
 * 
 */

const XMLHttpRequest    = require("xmlhttprequest").XMLHttpRequest;
const config            = require("../config.json");

module.exports = {
    authToken: '',
    expiresIn: 0,
    lastRequest: 0,

    async getPlaylistFromSpotify(playlistId) {
        if (!this._updateToken()) {
            console.log(`failed to update token`);
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open("GET", `https://api.spotify.com/v1/playlists/${playlistId}`, false);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${this.authToken}`);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.send();
        
        if (xhr.status !== 200) {
            console.log(`failed to get playlist ${playlistId}`);
            return;
        }

        const playlist = JSON.parse(xhr.responseText);
        const items = playlist.tracks.items;
        const songs = [];
        for (let i = 0; i < items.length; i++) {
            songs.push(items[i].track.name);
        }
        return songs;
    },

    _updateToken() {
        const currentTime = new Date().getTime() / 1000;
        const elapsedTime = currentTime - this.lastRequest;
        if (elapsedTime > this.expiresIn) {
            this._requestNewToken();
        }
        return this.authToken;
    },

    _requestNewToken() {
        const spotify_id        = config["spotify-id"];
        const spotify_secret    = config["spotify-secret"];

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://accounts.spotify.com/api/token", false);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", "Basic " + Buffer.from(spotify_id + ":" + spotify_secret).toString("base64"));
        xhr.send("grant_type=client_credentials");
        
        if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);
            this.authToken = result["access_token"];
            this.expiresIn = result["expires_in"];
            this.lastRequest = new Date().getTime() / 1000;
        }
    }
};