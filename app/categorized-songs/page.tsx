"use client";

import CategorizedSongs from "@/components/CategorizedSongsDT/CategorizedSongs";
import CategorizedSongsDropdown from "@/components/CategorizedSongsDropdown";
import CategorizedSongsTable from "@/components/CategorizedSongsTable";
import { Song } from "@/typings";
import React, { useEffect, useState } from "react";

const CategorizedSongsPage = () => {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/tracks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSongs(data.tracks as Song[]);
        console.log(data);
      });
  }, []);

  return (
    <>
      {/* <CategorizedSongsDropdown /> */}
      {/* <CategorizedSongsTable /> */}
      <div className="w-full mx-auto p-4 bg-black text-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-gray-100">
          Your songs with categories
        </h1>
        <CategorizedSongs songs={songs} />
      </div>
    </>
  );
};

export default CategorizedSongsPage;
