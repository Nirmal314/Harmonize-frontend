import React from "react";
import CategorizedSongs from "@/app/(components)/CategorizedSongsDT/CategorizedSongs";
import { Song } from "@/typings";
import { getPlaylistData } from "@/actions/spotify";
import { Music } from "lucide-react";
import Celebrate from "@/app/(components)/Celebrate";
import ToastManager from "@/app/(components)/ToastManager";
import Error from "@/app/(components)/Error";

type PlaylistData = { playlistName: string; songs: Song[] };

const CategorizedSongsPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) => {
  const playlistId = searchParams?.playlistId;

  if (!playlistId) {
    return (
      <ToastManager
        message="PlaylistID is required to categorize your songs inside it."
        redirect="/playlists"
      />
    );
  }

  try {
    const data = await getPlaylistData(playlistId);

    if (!data)
      return (
        <ToastManager
          message={"Failed to load playlist data."}
          redirect="/playlists"
        />
      );

    const { playlistName, songs }: PlaylistData = data;

    if (!Array.isArray(songs) || songs.length === 0)
      return (
        <ToastManager
          message={"No songs found in this playlist."}
          redirect="/playlists"
        />
      );

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
    return <Error error={error} />;
  }
};

export default CategorizedSongsPage;
