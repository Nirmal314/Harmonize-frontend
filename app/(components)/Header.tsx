"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Music } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect } from "react";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import { usePathname } from "next/navigation";

const Header = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-[#0000007c] fixed top-0 left-0 right-0 px-4 lg:px-6 h-14 flex justify-between items-center z-50 backdrop-filter backdrop-blur-xl bg-opacity-60"
    >
      <Link className="flex items-center justify-center" href="/playlists">
        <Music className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-bold text-white">Harmonize</span>
      </Link>
      {session && (
        <>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link
              className={`text-sm ${
                pathname === "/playlists"
                  ? "text-primary border-b border-b-primary"
                  : "text-white"
              } font-medium transition-colors hover:text-primary`}
              href="/playlists"
            >
              Playlists
            </Link>
            <Link
              className={`text-sm ${
                pathname === "/categorized-songs"
                  ? "text-primary border-b border-b-primary"
                  : "text-white"
              } font-medium transition-colors hover:text-primary`}
              href="/categorized-songs"
            >
              Categorized Songs
            </Link>
          </nav>
          <Avatar className="mx-4">
            <AvatarImage
              src={session?.user.image || "/public/placeholder-image.png"}
              alt="User"
            />
            <AvatarFallback className="text-black font-bold text-xl">
              {session?.user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <LogoutButton />
        </>
      )}

      {!session && (
        <>
          <LoginButton className="ml-10" />
        </>
      )}
    </motion.header>
  );
};

export default Header;
