"use client";

import React, { useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sparkles from "../Sparkles";
import SparkleButton from "./SparkleButton";
import { toast } from "sonner";

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
      <div className="relative flex items-center justify-center">
        <SparkleButton
          handler={navigateToCategorizedPage}
          isDisabled={isPending}
        />
        <Sparkles />
      </div>
    </>
  );
};

export default Categorize;
