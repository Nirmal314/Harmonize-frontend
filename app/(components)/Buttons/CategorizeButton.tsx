"use client";

import React, { useTransition } from "react";
import { Button } from "../../../components/ui/button";
import { Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";

const Categorize = ({ playlistId }: { playlistId: string }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const navigateToCategorizedPage = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      params.set("playlistId", playlistId);
      router.push(`/categorized-songs?${params.toString()}`);
    });
  };

  return (
    <>
      <Button
        className="w-full bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center justify-center h-auto py-2 px-1 sm:flex-row sm:py-2 sm:px-3"
        onClick={navigateToCategorizedPage}
        disabled={isPending}
        variant={isPending ? "purple" : "default"}
      >
        <Wand2
          className={`w-4 h-4 mb-1 sm:mr-2 sm:mb-0 ${
            isPending ? "hidden" : "block"
          }`}
        />
        <span className="text-xs sm:text-sm">
          {isPending ? "Categorizing... ✨" : "Categorize"}
        </span>
      </Button>
    </>
  );
};

export default Categorize;
