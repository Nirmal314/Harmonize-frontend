"use client";

import SpotifyPlaylists from "@/app/(components)/SpotifyPlaylists";
import useSpotify from "@/hooks/useSpotify";
import { Playlist, SpotifyPlaylist } from "@/typings";
import React, { useEffect, useState } from "react";

const Playlists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const spotifyApi = useSpotify();

  const formatPlaylistData = (playlist: SpotifyPlaylist) => ({
    id: playlist.id,
    name: playlist.name,
    description: playlist.description || "No description available",
    url: playlist.external_urls.spotify,
    image: playlist.images[0]?.url || null,
    trackCount: playlist.tracks.total,
    followers: playlist.followers?.total || 0,
    collaborative: playlist.collaborative,
  });

  useEffect(() => {
    if (!spotifyApi.getAccessToken()) return;

    spotifyApi.getUserPlaylists().then(async (data) => {
      const formattedPlaylists: Playlist[] = await Promise.all(
        data.body.items.map(async (playlist) => {
          const {
            body: { followers },
          } = await spotifyApi.getPlaylist(playlist.id);
          return formatPlaylistData({
            ...playlist,
            followers: { total: followers.total },
          });
        })
      );
      setPlaylists(formattedPlaylists);
    });
  }, [spotifyApi]);

  return (
    <div>
      <SpotifyPlaylists playlists={playlists} />
    </div>
  );
};

export default Playlists;
