"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export const unfollowPlaylist = async (
  playlistId: string,
  playlistName: string,
  totalTracks: number
) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.accessToken) {
    throw new Error("Unauthorized");
  }

  spotifyApi.setAccessToken(session.user.accessToken);

  try {
    const res = await spotifyApi.unfollowPlaylist(playlistId);

    revalidatePath("/playlists");

    return {
      status: res.statusCode,
      message: `Playlist ${playlistName} with ${totalTracks} tracks has been unfollowed.`,
    };
  } catch (error) {
    console.error("Error while deleting playlist: ", error);
    throw new Error("Error while deleting playlist");
  }
};
