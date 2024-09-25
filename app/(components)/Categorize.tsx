"use client";

import React, { useState, useTransition } from "react";
import { Button } from "../../components/ui/button";
import { Wand2 } from "lucide-react";
import useSpotify from "@/hooks/useSpotify";
import { predictSongCategory } from "@/actions/categorize";
import { Song } from "@/typings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CategorizedSongs from "./CategorizedSongsDT/CategorizedSongs";

const msToMinutesAndSeconds = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, "0")}`;
};

const Categorize = ({ playlistId }: { playlistId: string }) => {
  const spotifyApi = useSpotify();

  const [songs, setSongs] = useState<Song[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const categorize = async (playlistId: string) => {
    const selectedPlaylist = await spotifyApi.getPlaylist(playlistId);
    const tracks = selectedPlaylist.body.tracks.items;

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
      } = track.track || {};

      return {
        image: track.track?.album.images[0].url || "",
        name: name,
        artist: artists.map((artist) => artist.name).join(", ") || "",
        album: album.name,
        duration: msToMinutesAndSeconds(duration_ms),
        category: predictions[index].predicted_category as Song["category"],
      };
    });

    setIsOpen(true);
    setSongs(songs);
  };

  return (
    <>
      <Button
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        onClick={() => categorize(playlistId)}
      >
        <Wand2 className="mr-3 h-4 w-4" />
        <span>Categorize</span>
      </Button>

      <AlertDialog open={isOpen}>
        <AlertDialogContent className="min-w-[95%] h-[85%] overflow-y-none no-scrollbar">
          <AlertDialogHeader>
            <AlertDialogTitle>Your songs with categories</AlertDialogTitle>
            <AlertDialogDescription>
              <CategorizedSongs songs={songs} />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Categorize;
