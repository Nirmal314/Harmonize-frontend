"use client";

import React, { useEffect, useState } from "react";
import CategorizedSongs from "../(components)/CategorizedSongsDT/CategorizedSongs";
import { Song } from "@/typings";
import { predictSongCategory } from "@/actions/categorize";
import useSpotify from "@/hooks/useSpotify";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const msToMinutesAndSeconds = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, "0")}`;
};

const CategorizedSongsPage = () => {
  const spotifyApi = useSpotify();
  const searchParams = useSearchParams();

  const playlistId: string | null = searchParams.get("playlistId");

  const { data: session } = useSession();
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const categorize = async () => {
      const selectedPlaylist = await spotifyApi.getPlaylist(playlistId!);
      const tracks = selectedPlaylist.body.tracks.items;

      console.log(tracks);

      const trackIds = tracks.map((track) => track.track?.id!).filter(Boolean);

      const audioFeaturesResponses = await Promise.all(
        trackIds.map((trackId) => spotifyApi.getAudioFeaturesForTrack(trackId))
      );

      const predictions = await Promise.all(
        audioFeaturesResponses.map(
          ({
            body: {
              danceability,
              acousticness,
              valence,
              tempo,
              energy,
              instrumentalness,
            },
          }) => {
            if (instrumentalness > 0.6)
              return { predicted_category: "instrumental" };

            return predictSongCategory({
              danceability,
              acousticness,
              valence,
              tempo,
              energy,
            });
          }
        )
      );

      const songs: Song[] = tracks.map((track, index) => {
        const {
          name = "",
          artists = [],
          album = { name: "" },
          duration_ms = 0,
          external_urls = { spotify: "" },
        } = track.track || {};

        return {
          image: track.track?.album.images[0].url || "",
          url: external_urls.spotify,
          name: name,
          artist: artists.map((artist) => artist.name).join(", ") || "",
          album: album.name,
          duration: msToMinutesAndSeconds(duration_ms),
          category: predictions[index].predicted_category as Song["category"],
        };
      });

      setSongs(songs);
    };

    if (!spotifyApi.getAccessToken()) return;

    if (!playlistId) return; // TODO: make error toast and redirect to /playlists

    categorize();
  }, [session, spotifyApi]);
  return (
    <div className="flex flex-col items-center justify-center w-full mx-auto p-3 md:p-8 bg-black text-gray-100 min-h-screen">
      <p className="text-5xl py-8 font-bold text-transparent bg-clip-text bg-gradient-to-t from-primary to-white via-white/80">
        Your songs from playlist (playlist_name) are categorized!
      </p>

      <CategorizedSongs songs={songs} />
    </div>
  );
};

export default CategorizedSongsPage;
