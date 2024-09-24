import CategorizedSongs from "@/components/CategorizedSongsDT/CategorizedSongs";
import CategorizedSongsDropdown from "@/components/CategorizedSongsDropdown";
import CategorizedSongsTable from "@/components/CategorizedSongsTable";
import { Song } from "@/typings";
import React from "react";

const CategorizedSongsPage = async () => {
  const response = await fetch("/api/tracks");
  const songs: Song[] = await response.json();

  console.log(songs);
  return (
    <>
      {/* <CategorizedSongsDropdown /> */}
      {/* <CategorizedSongsTable /> */}
      <div className="w-full mx-auto p-4 bg-black text-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-gray-100">
          Your Spotify Playlists
        </h1>
        <CategorizedSongs songs={songs} />
      </div>
    </>
  );
};

export default CategorizedSongsPage;
