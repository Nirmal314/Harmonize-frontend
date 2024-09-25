import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { Wand2 } from "lucide-react";
import useSpotify from "@/hooks/useSpotify";
import { predictSongCategory } from "@/actions/categorize";
import { useRouter } from "next/navigation";
import { Category, Song, TrackWithCategory } from "@/typings";
import { navigateWithTracks } from "@/actions/tracks";

const msToMinutesAndSeconds = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, "0")}`;
};

const CategorizeButton = ({ playlistId }: { playlistId: string }) => {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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
          if (instrumentalness > 0.6) {
            return { predicted_category: "instrumental" };
          }

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

    startTransition(() => {
      fetch(`http://localhost:3000/api/tracks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(songs),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) router.push("/categorized-songs");
        });
    });
  };

  return (
    <Button
      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      onClick={() => categorize(playlistId)}
      disabled={isPending}
    >
      <Wand2 className="mr-3 h-4 w-4" />
      {isPending ? "Categorizing..." : "Categorize"}
    </Button>
  );
};

export default CategorizeButton;
