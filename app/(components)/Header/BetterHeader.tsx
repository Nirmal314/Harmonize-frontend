"use client";
import { useSession } from "next-auth/react";
import React from "react";
import { motion } from "framer-motion";
import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";

const BetterHeader = () => {
  const { data: session } = useSession();
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0000007c] no-backdrop-blur backdrop-filter backdrop-blur-xl bg-opacity-60 px-4 lg:px-6 h-14 flex justify-between items-center"
    >
      <HeaderLeft />
      <HeaderRight session={session} />
    </motion.header>
  );
};

export default BetterHeader;
