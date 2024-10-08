"use client";

import { unfollowPlaylist } from "@/actions/playlist";
import React, { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Props = {
  playlistId: string;
  playlistName: string;
  totalTracks: number;
};

const UnfollowPlaylist = ({ playlistId, playlistName, totalTracks }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleUnfollow = async () => {
    const { status, message } = await unfollowPlaylist(
      playlistId,
      playlistName,
      totalTracks
    );

    if (status && message) {
      toast.success(message);
    }
  };
  return (
    <>
      <Button
        variant="destructive"
        className="flex flex-col items-center justify-center h-auto py-2 px-1 sm:flex-row sm:py-2 sm:px-3"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="w-4 h-4 mb-1 sm:mr-2 sm:mb-0" />
        <span className="text-xs sm:text-sm">Unfollow</span>
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will unfollow your playlist
              from your Spotify account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleUnfollow}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UnfollowPlaylist;

// shadow-[rgba(24,216,96,0.8)_0px_0px_15px_12px]
