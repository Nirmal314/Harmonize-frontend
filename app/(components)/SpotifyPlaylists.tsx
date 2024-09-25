import React, { Suspense } from "react";

import { Playlist } from "@/typings";
import PlaylistLoadingCard from "./loading/PlaylistLoadingCard";
import PlaylistCard from "./PlaylistCard";

const SpotifyPlaylists = ({ playlists }: { playlists: Playlist[] }) => {
  return (
    <div className="w-full mx-auto p-4 bg-black text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-100">
        Your Spotify Playlists
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {playlists.map((playlist: Playlist) => (
          <Suspense key={playlist.id} fallback={<PlaylistLoadingCard />}>
            <PlaylistCard playlist={playlist} />
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default SpotifyPlaylists;
