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

    const songs: Song[] = [];

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

      const song: Song = {
        image: track.track?.album.images[0].url || "",
        name: track.track?.name || "",
        artist:
          track.track?.artists.map((artist) => artist.name).join(", ") || "",
        album: track.track?.album.name || "",
        duration: msToMinutesAndSeconds(track.track?.duration_ms || 0),
        category: result.predicted_category as Song["category"],
      };

      songs.push(song);
    }

    startTransition(() => {
      navigateWithTracks(songs).then(() => {
        router.push("/categorized-songs");
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
