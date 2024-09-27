import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
  "user-read-email", //! 	Read access to user’s email address.
  "user-read-private", //! Read access to user’s subscription details (type of user account).
  // "user-read-playback-state", //! 	Read access to a user’s player state.
  // "user-modify-playback-state", //! 	Write access to a user’s playback state
  // "user-read-currently-playing" //! 	Read access to a user’s currently playing content.
  "playlist-read-private", //! 	Read access to user's private playlists.
  "playlist-read-collaborative", //! 	Include collaborative playlists when requesting a user's playlists.
  "playlist-modify-private", //! 	Write access to a user's private playlists.
  "playlist-modify-public", //! Write access to a user's public playlists.
  "user-library-modify", //! Write/delete access to a user's "Your Music" library.
  "user-library-read", //! 	Read access to a user's library.
  "user-follow-read", //! Read access to the list of artists and other users that the user follows.
].join(",");

const params = {
  scope: scopes,
};

const queryParams = new URLSearchParams(params);

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParams.toString()}`;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_ID,
  clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_SECRET,
});

export default spotifyApi;

export { LOGIN_URL };

//? https://developer.spotify.com/documentation/web-api/concepts/scopes
