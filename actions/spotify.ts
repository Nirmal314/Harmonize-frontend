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

    const audioFeatures = await fetchAudioFeaturesInBatches(
      trackIds as string[]
    );

    const songs = await getSongsWithAudioFeatures(tracks, audioFeatures);

    return {
      playlistName: playlist.body.name,
      songs: songs.filter(Boolean),
    };
  } catch (error: any) {
    handleSpotifyApiError(error);
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

  const results = await Promise.allSettled(songPromises);
  return results
    .filter((result) => result.status === "fulfilled")
    .map((result) => (result as PromiseFulfilledResult<Song>).value);
};

const createSongFromTrack = async (
  track: SpotifyApi.PlaylistTrackObject,
  audioFeature: any
) => {
  if (!audioFeature) {
    console.warn(`No audio feature for track ${track.track?.id}`);
    return {
      image: track.track?.album.images[0]?.url || "",
      url: track.track?.external_urls.spotify || "",
      name: track.track?.name || "Unknown Name",
      artist:
        track.track?.artists.map((artist) => artist.name).join(", ") ||
        "Unknown Artist",
      album: track.track?.album.name || "Unknown Album",
      duration: msToMinutesAndSeconds(track.track?.duration_ms || 0),
      category: "Unknown",
    } as Song;
  }

  const prediction = await getPredictionForTrack(audioFeature);

  return {
    image: track.track?.album.images[0]?.url || "",
    url: track.track?.external_urls.spotify || "",
    name: track.track?.name || "Unknown Name",
    artist:
      track.track?.artists.map((artist) => artist.name).join(", ") ||
      "Unknown Artist",
    album: track.track?.album.name || "Unknown Album",
    duration: msToMinutesAndSeconds(track.track?.duration_ms || 0),
    category: prediction?.predicted_category || "Unknown",
  } as Song;
};

const timeoutPromise = (ms: number) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout error")), ms)
  );

const withTimeout = (promise: Promise<any>, ms: number) => {
  return Promise.race([promise, timeoutPromise(ms)]);
};

const getPredictionForTrack = async (audioFeature: any) => {
  if (audioFeature.instrumentalness > 0.6) {
    return { predicted_category: "instrumental" };
  }

  try {
    return await withTimeout(
      predictSongCategory({
        danceability: audioFeature.danceability,
        acousticness: audioFeature.acousticness,
        valence: audioFeature.valence,
        tempo: audioFeature.tempo,
        energy: audioFeature.energy,
      }),
      10000
    );
  } catch (error: any) {
    console.error(error);
    console.error("Error in prediction API", error.message);
    return null; // Return null if there's an error or a timeout
  }
};

async function fetchAudioFeaturesInBatches(trackIds: string[], batchSize = 40) {
  const results = [];
  for (let i = 0; i < trackIds.length; i += batchSize) {
    const batch = trackIds.slice(i, i + batchSize);
    try {
      const audioFeatures = await Promise.all(
        batch.map((trackId) => spotifyApi.getAudioFeaturesForTrack(trackId))
      );
      results.push(...audioFeatures);
    } catch (error) {
      console.error("Error fetching audio features", error);
      throw new Error("Failed to fetch audio features.");
    }

    // Wait to prevent hitting rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    throw new Error("Failed to fetch Spotify data");
  }
};
