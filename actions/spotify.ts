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

export const getPlaylistData = async (playlistId: string) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.accessToken) {
    throw new Error("Unauthorized");
  }

  spotifyApi.setAccessToken(session.user.accessToken);

  try {
    const playlist = await spotifyApi.getPlaylist(playlistId);
    const tracks = playlist.body.tracks.items;

    const trackIds = tracks.map((track) => track.track?.id).filter(Boolean);

    const audioFeatures = await fetchAudioFeaturesInBatches(
      trackIds as string[]
    );

    const songs: Song[] = await Promise.all(
      tracks.map(async (track, index) => {
        const audioFeature = audioFeatures[index]?.body;

        // Return a default Song object if audio features are missing
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

        try {
          // const prediction =
          //   audioFeature.instrumentalness > 0.6
          //     ? { predicted_category: "instrumental" }
          //     : { predicted_category: "instrumental" }

          const prediction =
            audioFeature.instrumentalness > 0.6
              ? { predicted_category: "instrumental" }
              : await predictSongCategory({
                  danceability: audioFeature.danceability,
                  acousticness: audioFeature.acousticness,
                  valence: audioFeature.valence,
                  tempo: audioFeature.tempo,
                  energy: audioFeature.energy,
                });

          return {
            image: track.track?.album.images[0]?.url || "",
            url: track.track?.external_urls.spotify || "",
            name: track.track?.name || "Unknown Name",
            artist:
              track.track?.artists.map((artist) => artist.name).join(", ") ||
              "Unknown Artist",
            album: track.track?.album.name || "Unknown Album",
            duration: msToMinutesAndSeconds(track.track?.duration_ms || 0),
            category: prediction.predicted_category,
          } as Song;
        } catch (e) {
          console.error("Error in prediction API", e);
          throw new Error("Error in prediction API. Please try again later.");
        }
      })
    );

    return {
      playlistName: playlist.body.name,
      songs: songs.filter(Boolean),
    };
  } catch (error: any) {
    if (error?.response?.status === 401) {
      throw new Error("Unauthorized: Spotify token expired.");
    }
    if (error?.response?.status === 429) {
      console.error("Rate limit hit, please try again later.");
      throw new Error("Spotify rate limit exceeded, please try again later.");
    }
    console.error("Error fetching Spotify data:", error);
    throw new Error(`Failed to fetch Spotify data: ${error.message}`);
  }
};

async function fetchAudioFeaturesInBatches(trackIds: string[], batchSize = 20) {
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
