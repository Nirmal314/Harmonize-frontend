import { Music } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "@/public/logo.png";

const HeaderLeft = () => {
  return (
    <Link className="flex items-center justify-center" href="/playlists">
      {/* <Music className="h-6 w-6 text-primary" /> */}
      <Image src={Logo} width={50} height={50} alt="Harmonize"></Image>
      <span className="ml-2 text-lg font-bold text-white">Harmonize</span>
    </Link>
  );
};

export default HeaderLeft;
