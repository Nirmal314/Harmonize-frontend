"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import Sparkles from "../Sparkles";
import SparkleButton from "./SparkleButton";
import { toast } from "sonner";

const Categorize = ({ playlistId }: { playlistId: string }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const navigateToCategorizedPage = () => {
    startTransition(() => {
      const promise = () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ name: "Sonner" }), 2500)
        );

      toast.promise(promise, {
        loading: "Categorizing your playlist...✨",
        success: () => {
          return `Your playlist has been categorized!`;
        },
        error: "Error",
      });
      const params = new URLSearchParams();
      params.set("playlistId", playlistId);
      router.push(`/categorized-songs?${params.toString()}`);
    });
  };

  return (
    <>
      <div className="relative">
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
