import React from "react";
import { redirect } from "next/navigation";
import CategorizedSongs from "@/app/(components)/CategorizedSongsDT/CategorizedSongs";
import { Song } from "@/typings";
import { getPlaylistData } from "@/actions/spotify";
import ErrorToast from "@/app/(components)/ErrorToast";

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
      <div className="flex flex-col items-center justify-center w-full mx-auto p-3 md:px-8 h-full">
        <p className="text-5xl mb-8 pb-6 mt-2 font-bold text-transparent bg-clip-text bg-gradient-to-t from-primary to-white via-white/80">
          <span className="text-primary/75">{"{"}</span> {playlistName}{" "}
          <span className="text-primary/75">{"}"}</span> categorized!
        </p>
        <CategorizedSongs songs={songs} />
      </div>
    );
  } catch (error) {
    return (
      <ErrorToast
        error="Something went wrong. Please try again later."
        redirect="/playlists"
      />
    );
  }
};

export default CategorizedSongsPage;
