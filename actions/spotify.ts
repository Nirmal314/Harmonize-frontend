"use server";

import { getServerSession } from "next-auth/next";
import SpotifyWebApi from "spotify-web-api-node";
import { Playlist, Song } from "@/typings";
import { predictSongCategory } from "@/actions/categorize";
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

    const trackIds = tracks.map((track) => track.track?.id).filter(Boolean);

    const audioFeatures = await fetchAudioFeatures(trackIds as string[]);

    const songs = await getSongsWithAudioFeatures(tracks, audioFeatures);

    return {
      playlistName: playlist.body.name,
      songs: songs.filter(Boolean),
    };
  } catch (error: any) {
    throw new Error(handleSpotifyApiError(error));
  }
};

const getSongsWithAudioFeatures = async (
  tracks: SpotifyApi.PlaylistTrackObject[],
  audioFeatures: any
) => {
  const songPromises = tracks.map((track, index) => {
    const audioFeature = audioFeatures[index]?.body;
    return createSongFromTrack(track, audioFeature);
  });

  const results = await Promise.all(songPromises);

  return results.filter(Boolean) as Song[];
};

const createSongFromTrack = async (
  track: SpotifyApi.PlaylistTrackObject,
  audioFeature: any
) => {
  if (!audioFeature) {
    console.warn(`No audio feature for track ${track.track?.id}`);
    return null;
  }

  const prediction = await getPredictionForTrack(audioFeature);

  if (prediction && prediction.predicted_category) {
    return {
      image: track.track?.album.images[0]?.url || "",
      url: track.track?.external_urls.spotify,
      name: track.track?.name,
      artist: track.track?.artists.map((artist) => artist.name).join(", "),
      album: track.track?.album.name,
      duration: msToMinutesAndSeconds(track.track?.duration_ms || 0),
      category: prediction.predicted_category,
    } as Song;
  }

  return null;
};

const getPredictionForTrack = async (audioFeature: any) => {
  if (audioFeature.instrumentalness > 0.6) {
    return { predicted_category: "instrumental" };
  }

  try {
    return await predictSongCategory({
      danceability: audioFeature.danceability,
      acousticness: audioFeature.acousticness,
      valence: audioFeature.valence,
      tempo: audioFeature.tempo,
      energy: audioFeature.energy,
    });
  } catch (error: any) {
    console.error("Error in prediction API", error.message);
    throw error;
  }
};

async function fetchAudioFeatures(trackIds: string[]) {
  const results = [];

  for (const trackId of trackIds) {
    while (true) {
      try {
        const audioFeature = await spotifyApi.getAudioFeaturesForTrack(trackId);
        results.push(audioFeature);
        break;
      } catch (error: any) {
        if (error?.statusCode === 429) {
          const retryAfter =
            parseInt(error.headers["retry-after"], 10) * 1000 || 5000;
          console.warn(
            `Rate limit hit for track ${trackId}, retrying after ${retryAfter}ms`
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
    }
  }

  return results;
}

export const getPlaylists = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    throw new Error("Unauthorized");
  }

  spotifyApi.setAccessToken(session.user.accessToken);

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
    throw new Error(handleSpotifyApiError(error));
  }
};
