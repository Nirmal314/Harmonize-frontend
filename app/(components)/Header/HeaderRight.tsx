"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Session } from "next-auth";
import Profile from "./Profile";
import LoginButton from "../Buttons/LoginButton";

const HeaderRight = ({ session }: { session: Session | null }) => {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const [isPending, startTransition] = useTransition();

  const menuVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: "-100%" },
  };

  const linkVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
  };
  return (
    <>
      {/* PC */}
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

        {session ? <Profile session={session} /> : <LoginButton />}
      </div>

      {/* Mobile */}

      {/* Hamburger menu */}
      <div className="md:hidden">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => startTransition(() => toggleMenu())}
          className="text-white"
        >
          <label className="hamburger" id="hamburger-btn">
            <input type="checkbox" />
            <svg viewBox="0 0 32 32">
              <path
                className="line line-top-bottom"
                d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
              ></path>
              <path className="line" d="M7 16 27 16"></path>
            </svg>
          </label>
          {/* {isMenuOpen ? <X /> : <Menu />} */}
        </motion.button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="absolute top-14 left-0 right-0 bg-[#0000007c] backdrop-filter no-backdrop-blur backdrop-blur-xl bg-opacity-60 p-4 md:hidden"
          >
            {session ? (
              <div className="mt-4 flex items-center justify-between">
                <nav className="flex flex-col gap-4">
                  <Link
                    className={`text-sm ${
                      pathname === "/playlists" ? "text-primary" : "text-white"
                    } font-medium transition-colors hover:text-primary`}
                    href="/playlists"
                    onClick={() => {
                      toggleMenu();
                      document.getElementById("hamburger-btn")?.click();
                    }}
                  >
                    Playlists
                  </Link>
                  <Link
                    className={`text-sm ${
                      pathname === "/categorized-songs"
                        ? "text-primary"
                        : "text-white"
                    } font-medium transition-colors hover:text-primary`}
                    href="/categorized-songs"
                    onClick={() => {
                      toggleMenu();
                      document.getElementById("hamburger-btn")?.click();
                    }}
                  >
                    Categorized Songs
                  </Link>
                </nav>
                <Profile session={session} />
              </div>
            ) : (
              <LoginButton className="mt-4 w-full md:w-fit" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeaderRight;
