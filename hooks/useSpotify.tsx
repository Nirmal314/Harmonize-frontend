"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_ID,
  clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_SECRET,
});

const useSpotify = () => {
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      if (session.error === "RefreshTokenError") {
        signIn();
      }

      spotifyApi.setAccessToken(session.user.accessToken!);
    }
  }, [session]);

  return spotifyApi;
};

export default useSpotify;
