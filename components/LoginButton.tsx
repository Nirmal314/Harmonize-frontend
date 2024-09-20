"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function LoginButton() {
  const handleSignin = async () => {
    console.log("first");
    await signIn("spotify", {
      callbackUrl: "/",
    });
  };

  return <Button onClick={handleSignin}>Login with Spotify</Button>;
}
