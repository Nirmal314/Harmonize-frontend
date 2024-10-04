import React from "react";
import { redirect } from "next/navigation";
import CategorizedSongs from "@/app/(components)/CategorizedSongsDT/CategorizedSongs";
import { Song } from "@/typings";
import { getPlaylistData } from "@/actions/spotify";

const CategorizedSongsPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) => {
  const playlistId = searchParams?.playlistId;

  if (!playlistId) redirect("/playlists");

  try {
    const { playlistName, songs }: { playlistName: string; songs: Song[] } =
      await getPlaylistData(playlistId);

    return (
      <div className="flex flex-col items-center justify-center w-full mx-auto p-3 md:px-8 bg-black text-gray-100 min-h-screen overflow-y-hidden">
        <p className="text-5xl py-8 font-bold text-transparent bg-clip-text bg-gradient-to-t from-primary to-white via-white/80">
          <span className="text-primary/75">{"{"}</span> {playlistName}{" "}
          <span className="text-primary/75">{"}"}</span> categorized!
        </p>
        <CategorizedSongs songs={songs} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching playlist data:", error);
    return <div>Error fetching playlist data. Please try again later.</div>;
  }
};

export default CategorizedSongsPage;
