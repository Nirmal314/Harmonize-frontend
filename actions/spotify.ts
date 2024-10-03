"use server";

import { getServerSession } from "next-auth/next";
import SpotifyWebApi from "spotify-web-api-node";
import { cache } from "react";
import { Playlist, Song, SpotifyPlaylist } from "@/typings";
import { predictSongCategory } from "@/actions/categorize";
import { authOptions } from "@/lib/auth";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

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

export const getPlaylistData = cache(async (playlistId: string) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.accessToken) {
    throw new Error("Unauthorized");
  }

  spotifyApi.setAccessToken(session.user.accessToken);

  try {
    const playlist = await spotifyApi.getPlaylist(playlistId);
    const tracks = playlist.body.tracks.items;

    const trackIds = tracks.map((track) => track.track?.id!).filter(Boolean);
    const audioFeatures = await Promise.all(
      trackIds.map((trackId) => spotifyApi.getAudioFeaturesForTrack(trackId))
    );

    const songs: Song[] = await Promise.all(
      tracks.map(async (track, index) => {
        const audioFeature = audioFeatures[index].body;

        const prediction =
          audioFeature.instrumentalness > 0.6
            ? { predicted_category: "instrumental" }
            : await predictSongCategory({
                // Await the prediction here
                danceability: audioFeature.danceability,
                acousticness: audioFeature.acousticness,
                valence: audioFeature.valence,
                tempo: audioFeature.tempo,
                energy: audioFeature.energy,
              });

        return {
          image: track.track?.album.images[0]?.url || "",
          url: track.track?.external_urls.spotify || "",
          name: track.track?.name || "",
          artist:
            track.track?.artists.map((artist) => artist.name).join(", ") || "",
          album: track.track?.album.name || "",
          duration: msToMinutesAndSeconds(track.track?.duration_ms || 0),
          category: prediction.predicted_category,
        } as Song;
      })
    );

    return {
      playlistName: playlist.body.name,
      songs,
    };
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    throw new Error("Failed to fetch Spotify data");
  }
});

export const getPlaylists = cache(async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    throw new Error("Unauthorized");
  }

  spotifyApi.setAccessToken(session.user.accessToken);

  try {
    const data = await spotifyApi.getUserPlaylists();

    const formattedPlaylists: Playlist[] = await Promise.all(
      data.body.items.map(async (playlist) => {
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
});
