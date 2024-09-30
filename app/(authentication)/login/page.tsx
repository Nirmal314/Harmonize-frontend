import React from "react";
import LoginButton from "@/app/(components)/LoginButton";
import SpotifyLogo from "@/public/spotify.png";
import Image from "next/image";
const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-black w-full min-h-screen">
      <Image className="w-52 mb-5" src={SpotifyLogo} alt="SpotifyLogo" />

      <LoginButton />
    </div>
  );
};

export default Login;
