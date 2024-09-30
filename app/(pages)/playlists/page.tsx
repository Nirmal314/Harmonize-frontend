"use client";

import SpotifyPlaylists from "@/app/(components)/SpotifyPlaylists";
import useSpotify from "@/hooks/useSpotify";
import { Playlist, SpotifyPlaylist } from "@/typings";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Playlists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const spotifyApi = useSpotify();
  const router = useRouter();

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
    console.log(spotifyApi.getAccessToken());

    if (!spotifyApi.getAccessToken()) {
      toast.error("No access token found, redirecting...");

      setTimeout(() => {
        router.push("/");
      }, 4000);
    }

    // toast.success(
    //   "api calls for /playlists: getUserPlaylists(), getPlaylist(playlist.id)"
    // );

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
  }, []);

  return (
    <div>
      <SpotifyPlaylists playlists={playlists} />
    </div>
  );
};

export default Playlists;
