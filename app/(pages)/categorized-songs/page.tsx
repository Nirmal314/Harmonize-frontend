import React from "react";
import { redirect } from "next/navigation";
import CategorizedSongs from "@/app/(components)/CategorizedSongsDT/CategorizedSongs";
import { Song } from "@/typings";
import { getPlaylistData } from "@/actions/spotify";
import ErrorToast from "@/app/(components)/ErrorToast";
import { Disc3, Music } from "lucide-react";
import Celebrate from "@/app/(components)/Celebrate";

type PlaylistData = { playlistName: string; songs: Song[] };

const CategorizedSongsPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) => {
  const playlistId = searchParams?.playlistId;

  if (!playlistId) redirect("/playlists");

  try {
    const { playlistName, songs }: PlaylistData = await getPlaylistData(
      playlistId
    );

    return (
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
