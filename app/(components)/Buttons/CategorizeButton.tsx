"use client";

import React, { useTransition } from "react";
import { Button } from "../../../components/ui/button";
import { Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Sparkles from "../Sparkles";

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
      <div className="relative">
        <div className="relative">
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center h-auto py-2 px-1 sm:py-2 sm:px-3"
            onClick={navigateToCategorizedPage}
            disabled={isPending}
            variant={isPending ? "purple" : "default"}
          >
            <Wand2 className={`w-4 h-4`} />
            <span className="sr-only">
              {isPending ? "Categorizing... ✨" : "Categorize"}
            </span>
          </Button>
        </div>

        <Sparkles />
      </div>
    </>
  );
};

export default Categorize;
