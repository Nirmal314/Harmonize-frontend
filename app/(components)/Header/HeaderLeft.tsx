import { Music } from "lucide-react";
import Link from "next/link";
import React from "react";

const HeaderLeft = () => {
  return (
    <Link className="flex items-center justify-center" href="/playlists">
      <Music className="h-6 w-6 text-primary" />
      <span className="ml-2 text-lg font-bold text-white">Harmonize</span>
    </Link>
  );
};

export default HeaderLeft;
