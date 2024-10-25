"use client";

import React, { useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sparkles from "../Sparkles";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";
import GlowingSparkle from "../GlowingSparkle";

const Categorize = ({ playlistId }: { playlistId: string }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const navigateToCategorizedPage = useCallback(() => {
    const toastId = toast.loading("Categorizing your playlist...✨", {
      duration: Infinity,
    });

    startTransition(() => {
      const params = new URLSearchParams();
      params.set("playlistId", playlistId);
      router.push(`/categorized-songs?${params.toString()}`);

      sessionStorage.setItem("categorizingToastId", toastId as string);
    });
  }, [playlistId, router]);

  return (
    <>
      <div className="relative w-full">
        <button
          onClick={navigateToCategorizedPage}
          disabled={isPending}
          className="sparkle-button flex justify-center items-center h-9 px-4 py-2 bg-[#9333ea] hover:bg-transparent shadow-purple"
        >
          <Wand2 className={`w-4 h-4 text-white`} />

          <div className={`sparkle-star-1`}>
            <GlowingSparkle />
          </div>
          <div className={`sparkle-star-2`}>
            <GlowingSparkle />
          </div>
          <div className={`sparkle-star-3`}>
            <GlowingSparkle />
          </div>
          <div className={`sparkle-star-4`}>
            <GlowingSparkle />
          </div>
          <div className={`sparkle-star-5`}>
            <GlowingSparkle />
          </div>
          <div className={`sparkle-star-6`}>
            <GlowingSparkle />
          </div>
          <Sparkles />
        </button>
      </div>
    </>
  );
};

export default Categorize;
