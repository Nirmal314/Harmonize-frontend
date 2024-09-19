"use client";
import { signIn } from "next-auth/react";

export default function LoginButton() {
  const handleSignin = async () => {
    await signIn("spotify", {
      callbackUrl: "/",
    });
  };

  return (
    <button
      className="p-5 bg-spotify text-white rounded-full"
      onClick={handleSignin}
    >
      Login with Spotify
    </button>
  );
}
