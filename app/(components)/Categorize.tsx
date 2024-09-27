"use client";

import React from "react";
import { Button } from "../../components/ui/button";
import { Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";

const Categorize = ({ playlistId }: { playlistId: string }) => {
  const router = useRouter();

  const navigateToCategorizedPage = () => {
    const params = new URLSearchParams();
    params.set("playlistId", playlistId);
    router.push(`/categorized-songs?${params.toString()}`);
  };

  return (
    <>
      <Button
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        onClick={() => navigateToCategorizedPage()}
      >
        <Wand2 className="mr-3 h-4 w-4" />
        <span>Categorize</span>
      </Button>
    </>
  );
};

export default Categorize;
