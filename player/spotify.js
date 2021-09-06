/**
 *            mizo-bot
 *   A multi-function Discord bot
 * 
 * @author mizoxes (Hamza EL KAICHE)
 * 
 */

const fs                = require("fs");
const XMLHttpRequest    = require("xmlhttprequest").XMLHttpRequest;
const config            = require("../config.json");

const spotify = {
    authToken: '',
    expiresIn: 0,
    lastRequest: 0,

    async getPlaylistFromSpotify(link) {
        if (!this._updateToken()) {
            console.log(`failed to update token`);
            return;
        }

        const playlistId = this._getPlaylistId(link);
        if (!playlistId) {
            console.log("invalid spotify playlist link");
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

    _getPlaylistId(link) {
        const str = "open.spotify.com/playlist/";
        const idx = link.indexOf(str);
        if (idx === -1) {
            return '';
        }
        let playlistId = '';
        for (let i = idx + str.length; link[i] !== '?' && i < link.length; i++) {
            playlistId += link[i];
        }
        return playlistId;
    },

    _updateToken() {
        const currentTime = new Date().getTime() / 1000;
        const elapsedTime = currentTime - this.lastRequest;
        if (elapsedTime > this.expiresIn) {
            this._requestNewToken();
            this._saveToken();
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
    },

    _saveToken() {
        fs.writeFile("./token.json", JSON.stringify({
            authToken: this.authToken,
            expiresIn: this.expiresIn,
            lastRequest: this.lastRequest
        }), error => console.log("failed to save token: " + error));
    },

    _loadToken() {
        if (!fs.existsSync("./token.json")) {
            return;
        }

        const string = fs.readFileSync("./token.json");
        const data          = JSON.parse(string);
        this.authToken      = data.authToken;
        this.expiresIn      = data.expiresIn;
        this.lastRequest    = data.lastRequest;
    }
};

spotify._loadToken();

module.exports = spotify;