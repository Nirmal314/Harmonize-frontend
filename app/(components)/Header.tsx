"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Music, Menu, X, ChevronDown, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";
import LogoutButton from "./Buttons/LogoutButton";
import LoginButton from "./Buttons/LoginButton";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Header = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: "-100%" },
  };

  const linkVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
  };

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

      <div className="md:hidden">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMenu}
          className="text-white"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="absolute top-14 left-0 right-0 bg-[#0000007c] backdrop-filter backdrop-blur-xl bg-opacity-60 p-4 md:hidden"
          >
            <nav className="flex flex-col gap-4">
              <Link
                className={`text-sm ${
                  pathname === "/playlists"
                    ? "text-primary border-b border-b-primary"
                    : "text-white"
                } font-medium transition-colors hover:text-primary`}
                href="/playlists"
                onClick={toggleMenu}
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
                onClick={toggleMenu}
              >
                Categorized Songs
              </Link>
            </nav>
            {session ? (
              <div className="mt-4 flex items-center justify-between">
                <Avatar className="mr-4">
                  <AvatarImage
                    src={session?.user.image || "/public/placeholder-image.png"}
                    alt="User"
                  />
                  <AvatarFallback className="text-black font-bold text-xl">
                    {session?.user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <LogoutButton />
              </div>
            ) : (
              <LoginButton className="mt-4" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden md:flex items-center">
        {session && (
          <nav className="mr-4 flex gap-4 sm:gap-6">
            <motion.div whileHover="hover" variants={linkVariants}>
              <Link
                className={`text-sm ${
                  pathname === "/playlists" ? "text-primary" : "text-white"
                } font-medium transition-colors hover:text-primary`}
                href="/playlists"
              >
                Playlists
              </Link>
            </motion.div>
            <motion.div whileHover="hover" variants={linkVariants}>
              <Link
                className={`text-sm ${
                  pathname === "/categorized-songs"
                    ? "text-primary"
                    : "text-white"
                } font-medium transition-colors hover:text-primary`}
                href="/categorized-songs"
              >
                Categorized Songs
              </Link>
            </motion.div>
          </nav>
        )}
        {session ? (
          <div className="flex items-center">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full border border-primary/10 bg-background p-0"
                  onClick={toggleDropdown}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={session.user.image || "/placeholder-avatar.png"}
                      alt={session.user.name || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {session.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <motion.div
                    className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-3 w-3 text-primary-foreground" />
                  </motion.div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-row items-center space-x-3 p-2">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden">
                      <Image
                        src={session.user.image || "/placeholder-avatar.png"}
                        alt={session.user.name || "User"}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <p className="text-base font-medium leading-none">
                        {session.user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @{session.user.username || "username"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <LoginButton />
        )}
      </div>
    </motion.header>
  );
};

export default Header;
