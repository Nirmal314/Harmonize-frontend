import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const Err = () => {
  return (
    <form
      action={async () => {
        "use server";

        const session = await getServerSession(authOptions);

        if (!session || !session?.user.accessToken) return;

        spotifyApi.setAccessToken(session.user.accessToken);

        try {
          const data = await spotifyApi.getAudioFeaturesForTrack(
            "5kqIPrATaCc2LqxVWzQGbk"
          );
          console.log("DATA:", data);
        } catch (error: any) {
          console.log(error.statusCode);
        }
      }}
    >
      <Button type="submit">Fetch</Button>
    </form>
  );
};

export default Err;
