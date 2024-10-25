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

type AudioFeatureResult = {
  track: SpotifyApi.TrackObjectFull;
  danceability: number;
  energy: number;
  acousticness: number;
  valence: number;
  tempo: number;
  instrumentalness: number;
};

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

  if (!process.env.MODEL_API_URL || process.env.MODEL_API_URL == "")
    throw new Error(
      "Sorry! Backend of Harmonize is currently down, please try again later."
    );

  try {
    let tracks: SpotifyApi.PlaylistTrackObject[] = [];
    let offset = 0;
    const limit = 100; // Maximum number of tracks per request
    let totalTracks = 0;

    const playlist = await spotifyApi.getPlaylist(playlistId, {
      fields: "tracks.total,name",
    });

    totalTracks = playlist.body.tracks.total;
    while (offset < totalTracks) {
      const response = await spotifyApi.getPlaylistTracks(playlistId, {
        offset,
        limit,
      });
      tracks = tracks.concat(
        response.body.items as SpotifyApi.PlaylistTrackObject[]
      );
      offset += limit;
    }

    const audioFeatures = await fetchAudioFeatures(tracks);

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

const BATCH_SIZE = 100; // Spotify allows up to 100 tracks per request
const MAX_RETRIES = 5;
const BASE_DELAY = 1000;
const CONCURRENT_BATCHES = 3;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const processBatch = async (
  batch: SpotifyApi.PlaylistTrackObject[],
  batchIndex: number,
  totalBatches: number
): Promise<AudioFeatureResult[]> => {
  const trackIds = batch.map((track) => track.track!.id);
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const audioFeatures = await spotifyApi.getAudioFeaturesForTracks(
        trackIds
      );

      const batchResults = audioFeatures.body.audio_features
        .map((feature, index) => {
          if (!feature) return null;

          return {
            track: batch[index].track!,
            danceability: feature.danceability,
            energy: feature.energy,
            acousticness: feature.acousticness,
            valence: feature.valence,
            tempo: feature.tempo,
            instrumentalness: feature.instrumentalness,
          };
        })
        .filter((result): result is AudioFeatureResult => result !== null);

      console.log(`Completed batch ${batchIndex + 1}/${totalBatches}`);
      return batchResults;
    } catch (error: any) {
      attempts++;

      if (error?.statusCode === 429) {
        const retryAfter =
          parseInt(error.headers["retry-after"], 10) * 1000 || 5000;
        console.warn(
          `Rate limit hit for batch ${batchIndex + 1}/${totalBatches}, ` +
            `retrying after ${retryAfter}ms (Attempt ${attempts}/${MAX_RETRIES})`
        );
        await sleep(retryAfter);
        continue;
      }

      if (attempts < MAX_RETRIES) {
        const backoffDelay = BASE_DELAY * Math.pow(2, attempts - 1);
        console.warn(
          `Error fetching batch ${batchIndex + 1}/${totalBatches}, ` +
            `retrying in ${backoffDelay}ms (Attempt ${attempts}/${MAX_RETRIES})`,
          error
        );
        await sleep(backoffDelay);
        continue;
      }

      console.error(
        `Failed to fetch audio features for batch ${
          batchIndex + 1
        }/${totalBatches} ` + `after ${MAX_RETRIES} attempts:`,
        error
      );
      throw error;
    }
  }

  throw new Error(
    `Failed to process batch ${batchIndex + 1} after ${MAX_RETRIES} attempts`
  );
};

const fetchAudioFeatures = async (
  tracks: SpotifyApi.PlaylistTrackObject[]
): Promise<AudioFeatureResult[]> => {
  const validTracks = tracks.filter((track) => track.track?.id);
  const batches = chunk(validTracks, BATCH_SIZE);
  const results: AudioFeatureResult[] = [];

  for (let i = 0; i < batches.length; i += CONCURRENT_BATCHES) {
    const currentBatches = batches.slice(i, i + CONCURRENT_BATCHES);
    const batchPromises = currentBatches.map((batch, index) =>
      processBatch(batch, i + index, batches.length)
    );

    try {
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.flat());

      // Add a small delay between concurrent batch groups
      if (i + CONCURRENT_BATCHES < batches.length) {
        await sleep(100);
      }
    } catch (error) {
      console.error("Error processing concurrent batch group:", error);
      throw error;
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
        image: track.album?.images[0]?.url || "",
        url: track.external_urls.spotify,
        name: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        album: track.album.name,
        duration: msToMinutesAndSeconds(track?.duration_ms || 0),
        category: track.category,
      };
    });
  } catch (error: any) {
    if (typeof error === typeof Error) throw error;
    throw new Error(handleSpotifyApiError(error));
  }
};
