import React from "react";
import CategorizedSongs from "@/app/(components)/CategorizedSongsDT/CategorizedSongs";
import { Song } from "@/typings";
import { getPlaylistData } from "@/actions/spotify";
import { Music } from "lucide-react";
import Celebrate from "@/app/(components)/Celebrate";
import ToastManager from "@/app/(components)/ToastManager";

type PlaylistData = { playlistName: string; songs: Song[] };

const CategorizedSongsPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) => {
  const playlistId = searchParams?.playlistId;

  if (!playlistId)
    throw new Error(
      "PlaylistID is required to categorize your songs inside it."
    );

  try {
    const data = await getPlaylistData(playlistId);

    if (!data) throw new Error("Failed to load playlist data.");

    const { playlistName, songs }: PlaylistData = data;

    if (!Array.isArray(songs) || songs.length === 0)
      throw new Error("No songs found in this playlist.");

    return (
      <>
        <ToastManager playlistId={playlistId} />
        <div className="w-full flex flex-col items-center justify-center p-3 md:px-8 h-full">
          <Celebrate />
          <p className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 pb-6 mt-2 font-bold text-transparent bg-clip-text text-center bg-gradient-to-t from-primary to-white via-white/80">
            <span className="inline-block transform -rotate-6">
              <Music className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 inline-block mr-2 text-primary" />
            </span>
            {playlistName}
            <span className="inline-block transform rotate-6">
              <Music className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 inline-block ml-2 text-primary" />
            </span>
          </p>
          <CategorizedSongs songs={songs} />
        </div>
      </>
    );
  } catch (error: any) {
    throw new Error(error || "An error occurred please try again");
  }
};

export default CategorizedSongsPage;
