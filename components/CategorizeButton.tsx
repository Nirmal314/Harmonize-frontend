"use client";

import React from "react";
import { Button } from "./ui/button";
import { Wand2 } from "lucide-react";
import useSpotify from "@/hooks/useSpotify";
import { predictSongCategory } from "@/actions/categorize";

type Category =
  | "happy"
  | "sad"
  | "energetic"
  | "calm"
  | "confident"
  | "instrumental";

const CategorizeButton = ({ playlistId }: { playlistId: string }) => {
  const spotifyApi = useSpotify();

  const categorize = async (playlistId: string) => {
    const selectedPlaylist = await spotifyApi.getPlaylist(playlistId);
    const tracks = selectedPlaylist.body.tracks.items;

    const trackIds = tracks
      .map((track) => track.track?.id)
      .filter((id): id is string => !!id);

    const audioFeaturesResponse = await spotifyApi.getAudioFeaturesForTracks(
      trackIds
    );
    const { audio_features } = audioFeaturesResponse.body;

    const categorizedTracks: Record<Category, typeof tracks> = {
      happy: [],
      sad: [],
      energetic: [],
      calm: [],
      confident: [],
      instrumental: [],
    };

    await Promise.all(
      tracks.map(async (track, index) => {
        const features = audio_features[index];
        const {
          danceability,
          acousticness,
          valence,
          tempo,
          energy,
          instrumentalness,
        } = features;

        if (instrumentalness > 0.4) {
          categorizedTracks["instrumental"]?.push(track);
        } else {
          const result = await predictSongCategory({
            danceability,
            acousticness,
            valence,
            tempo,
            energy,
          });

          console.log({
            danceability,
            acousticness,
            valence,
            tempo,
            energy,
            instrumentalness,
          });

          const category = result.predicted_category as Category;
          categorizedTracks[category]?.push(track);
        }
      })
    );

    console.log(categorizedTracks);
    // TODO: proceed from here
  };

  return (
    <Button
      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      onClick={() => categorize(playlistId)}
    >
      <Wand2 className="mr-3 h-4 w-4" />
      Categorize
    </Button>
  );
};

export default CategorizeButton;
