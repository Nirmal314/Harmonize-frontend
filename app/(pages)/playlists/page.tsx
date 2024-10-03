import { getPlaylists } from "@/actions/spotify";
import SpotifyPlaylists from "@/app/(components)/SpotifyPlaylists";
import { Playlist } from "@/typings";
import React from "react";

const Playlists = async () => {
  const playlists: Playlist[] = await getPlaylists();

  return (
    <div>
      <SpotifyPlaylists playlists={playlists} />
    </div>
  );
};

export default Playlists;
