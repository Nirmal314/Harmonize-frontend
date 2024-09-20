import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    error?: string;
    user: {
      accessToken?: string;
      refreshToken?: string;
      username?: string;
    } & DefaultSession["user"]; // name, email, image
  }
}
