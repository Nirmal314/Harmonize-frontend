"use client";

import React from "react";
import { Button } from "./ui/button";
import { Wand2 } from "lucide-react";
import useSpotify from "@/hooks/useSpotify";
import { predictSongCategory } from "@/actions/categorize";

const CategorizeButton = ({ playlistId }: { playlistId: string }) => {
  const spotifyApi = useSpotify();

  const categorize = async (playlistId: string) => {
    const selectedPlaylist = await spotifyApi.getPlaylist(playlistId);
    const tracks = selectedPlaylist.body.tracks.items;

    const tracksWithCategories = [];

    for (const track of tracks) {
      const trackId = track.track?.id!;

      const {
        body: { danceability, acousticness, valence, tempo, energy },
      } = await spotifyApi.getAudioFeaturesForTrack(trackId);

      const result = await predictSongCategory({
        danceability,
        acousticness,
        valence,
        tempo,
        energy,
      });

      const trackJson = {
        ...track,
        category: result.predicted_category,
      };

      tracksWithCategories.push(trackJson);
    }

    console.log(tracksWithCategories);
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
