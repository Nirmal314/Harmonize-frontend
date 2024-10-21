import { getPlaylists } from "@/actions/spotify";
import ErrorToast from "@/app/(components)/ErrorToast";
import PlaylistLoadingCard from "@/app/(components)/loading/PlaylistLoadingCard";
import PlaylistCard from "@/app/(components)/PlaylistCard";
import { Playlist } from "@/typings";
import React, { Suspense } from "react";

const Playlists = async () => {
  try {
    const playlists: Playlist[] = await getPlaylists();

    return (
      <div className="w-full mx-auto p-4 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-gray-100 text-center">
          <span className="pb-2 border-b-2 border-b-primary">
            Your Spotify Playlists
          </span>
        </h1>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {playlists.map((playlist: Playlist) => (
            <Suspense key={playlist.id} fallback={<PlaylistLoadingCard />}>
              <PlaylistCard playlist={playlist} />
            </Suspense>
          ))}
        </div>
      </div>
    );
  } catch (e: any) {
    return <ErrorToast error={e} redirect="/playlists" />;
  }
};

export default Playlists;
