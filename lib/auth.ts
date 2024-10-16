import NextAuth, { NextAuthOptions, Session } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "./spotify";
import { JWT } from "next-auth/jwt";

export type Token = JWT & {
  accessToken: string;
  refreshToken: string;
  username: string;
  accessTokenExpires: number;
};

const refreshAccessToken = async (token: Token) => {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    console.log(`refreshed token: ${refreshedToken.access_token}`);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshTokenError",
    };
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_SPOTIFY_ID! as string,
      clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_SECRET! as string,
      authorization: LOGIN_URL,
    }),
  ],

  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/",
  },

  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        // console.log(
        //   "[auth.ts] returning token with accessToken, refreshToken, username, accessTokenExpires."
        // );
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at! * 1000,
        } as Token;
      }

      if (Date.now() < (token as Token).accessTokenExpires) {
        return token;
      }

      console.log("access token has expired, refreshing...");
      return await refreshAccessToken(token as Token);
    },

    async session({ session, token }) {
      session.user!.accessToken = (token as Token).accessToken;
      session.user!.refreshToken = (token as Token).refreshToken;
      session.user!.username = (token as Token).username;

      // console.log(
      //   "[auth.ts] returning session with accessToken, refreshToken, username."
      // );
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
