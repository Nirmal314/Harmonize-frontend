"use server";

import { getServerSession } from "next-auth/next";
import SpotifyWebApi from "spotify-web-api-node";
import { Features, Playlist, Song } from "@/typings";
import { predict } from "@/actions/categorize";
import { authOptions } from "@/lib/auth";
import {
  msToMinutesAndSeconds,
  formatPlaylistData,
  handleSpotifyApiError,
} from "@/utils/spotify";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export const getPlaylists = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    throw new Error("Unauthorized: Missing session or access token.");
  }

  try {
    spotifyApi.setAccessToken(session.user.accessToken);
  } catch (error) {
    console.error("Error setting access token:", error);
    throw new Error("Failed to set Spotify access token.");
  }

  try {
    const playlists = await spotifyApi.getUserPlaylists();

    const formattedPlaylists: Playlist[] = await Promise.all(
      playlists.body.items.map(async (playlist) => {
        const {
          body: { followers },
        } = await spotifyApi.getPlaylist(playlist.id);
        return formatPlaylistData({
          ...playlist,
          followers: { total: followers.total },
        });
      })
    );

    return formattedPlaylists;
  } catch (error: any) {
    if (typeof error === typeof Error) throw error;
    throw new Error(handleSpotifyApiError(error));
  }
};

export const getPlaylistData = async (playlistId: string) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.accessToken) {
    throw new Error("Unauthorized: Missing session or access token.");
  }

  try {
    spotifyApi.setAccessToken(session.user.accessToken);
  } catch (error) {
    console.error("Error setting access token:", error);
    throw new Error("Failed to set Spotify access token.");
  }

  try {
    const playlist = await spotifyApi.getPlaylist(playlistId);

    const tracks = playlist.body.tracks.items;

    const audioFeatures = await fetchAudioFeatures(
      tracks as SpotifyApi.PlaylistTrackObject[]
    );

    const songs = await predictAndFormat(audioFeatures);

    return {
      playlistName: playlist.body.name,
      songs,
    };
  } catch (error: any) {
    if (typeof error === typeof Error) throw error;
    throw new Error(handleSpotifyApiError(error));
  }
};

const fetchAudioFeatures = async (tracks: SpotifyApi.PlaylistTrackObject[]) => {
  const results = [];

  for (const track of tracks) {
    let attempts = 0;
    while (attempts < 5) {
      if (track.track?.id) {
        const trackId = track.track.id;
        try {
          const audioFeature = await spotifyApi.getAudioFeaturesForTrack(
            trackId
          );
          results.push({
            track: track.track, // Add track as well
            danceability: audioFeature.body.danceability,
            energy: audioFeature.body.energy,
            acousticness: audioFeature.body.acousticness,
            valence: audioFeature.body.valence,
            tempo: audioFeature.body.tempo,
            instrumentalness: audioFeature.body.instrumentalness,
          });
          break;
        } catch (error: any) {
          if (error?.statusCode === 429) {
            const retryAfter =
              parseInt(error.headers["retry-after"], 10) * 1000 || 5000;
            console.warn(
              `Rate limit hit for track ${trackId}, retrying after ${retryAfter}ms (Attempt ${
                attempts + 1
              }/5)`
            );
            await new Promise((resolve) => setTimeout(resolve, retryAfter));
          } else {
            console.error(
              `Failed to fetch audio feature for track ${trackId}:`,
              error
            );
            throw error;
          }
        }

        attempts++;

        if (attempts === 5) {
          console.error(
            `Failed to fetch audio feature for track ${trackId} after 5 attempts.`
          );
          throw new Error(
            `Failed to fetch audio features for track ${trackId} after 5 retries.`
          );
        }
      }
    }
  }

  return results;
};

const predictAndFormat = async (audioFeatures: Features[]) => {
  try {
    const tracks = await predict(audioFeatures);

    return tracks.map((t) => {
      const track = t.track;

      return {
        image: track.album.images[0].url || "",
        url: track.external_urls.spotify,
        name: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        album: track.album.name,
        duration: msToMinutesAndSeconds(track.duration_ms || 0),
        category: track.category,
      };
    });
  } catch (error: any) {
    if (typeof error === typeof Error) throw error;
    throw new Error(handleSpotifyApiError(error));
  }
};
