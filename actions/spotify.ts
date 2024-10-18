"use server";

import { getServerSession } from "next-auth/next";
import SpotifyWebApi from "spotify-web-api-node";
import { Playlist, Song, SpotifyPlaylist } from "@/typings";
import { predictSongCategory } from "@/actions/categorize";
import { authOptions } from "@/lib/auth";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Utility functions
const msToMinutesAndSeconds = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, "0")}`;
};

const formatPlaylistData = (playlist: SpotifyPlaylist) => ({
  id: playlist.id,
  name: playlist.name,
  description: playlist.description || "No description available",
  url: playlist.external_urls.spotify,
  image: playlist.images[0]?.url || null,
  trackCount: playlist.tracks.total,
  followers: playlist.followers?.total || 0,
  collaborative: playlist.collaborative,
});

// Retry logic for async functions
const retryAsync = async (fn: any, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i < retries - 1) {
        console.warn(`Retrying... (${i + 1}/${retries})`);
        await new Promise((res) => setTimeout(res, 1000)); // Wait before retrying
      } else {
        throw error; // Rethrow the error if all retries fail
      }
    }
  }
};

// Main function to get playlist data
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
    const playlist = await retryAsync(() => spotifyApi.getPlaylist(playlistId));
    const tracks = playlist.body.tracks.items;

    const trackIds = tracks
      .map((track: any) => track.track?.id)
      .filter(Boolean);
    const audioFeatures = await fetchAudioFeaturesInBatches(
      trackIds as string[]
    );
    const songs = await getSongsWithAudioFeatures(tracks, audioFeatures);

    return {
      playlistName: playlist.body.name,
      songs: songs.filter(Boolean),
    };
  } catch (error) {
    handleSpotifyApiError(error);
  }
};

// Get songs with audio features
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

// Create a song object from a track
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

// Get prediction for a track
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
  } catch (error) {
    console.error("Error in prediction API", error);
    return null; // Return null so we have a fallback
  }
};

// Handle Spotify API errors
const handleSpotifyApiError = (error: any) => {
  if (error?.response?.status === 401) {
    console.error("Unauthorized error: Spotify token expired", error);
    throw new Error("Unauthorized: Spotify token expired.");
  }
  if (error?.response?.status === 429) {
    console.error("Rate limit hit, please try again later.", error);
    throw new Error("Spotify rate limit exceeded, please try again later.");
  }
  if (
    error?.code === "ECONNRESET" ||
    error?.message.includes("Connection closed")
  ) {
    console.error("Connection closed. Retrying...");
    throw new Error("Connection closed. Please try again.");
  }
  console.error("Error fetching Spotify data:", error);
  throw new Error(`Failed to fetch Spotify data: ${error.message || error}`);
};

// Fetch audio features in batches
async function fetchAudioFeaturesInBatches(trackIds: string[], batchSize = 20) {
  const results = [];
  for (let i = 0; i < trackIds.length; i += batchSize) {
    const batch = trackIds.slice(i, i + batchSize);
    try {
      const audioFeatures = await Promise.all(
        batch.map((trackId) =>
          retryAsync(() => spotifyApi.getAudioFeaturesForTrack(trackId))
        )
      );
      results.push(...audioFeatures);
    } catch (error) {
      console.error("Error fetching audio features", error);
      throw new Error("Failed to fetch audio features.");
    }

    // Wait to prevent hitting rate limits
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return results;
}

// Get user's playlists
export const getPlaylists = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    throw new Error("Unauthorized");
  }

  spotifyApi.setAccessToken(session.user.accessToken);

  try {
    const playlists = await retryAsync(() => spotifyApi.getUserPlaylists());

    const formattedPlaylists: Playlist[] = await Promise.all(
      playlists.body.items.map(async (playlist: any) => {
        const {
          body: { followers },
        } = await retryAsync(() => spotifyApi.getPlaylist(playlist.id));
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
