"use client";

import { useEffect } from "react";
import { toast } from "sonner";

const ToastManager = ({ playlistName }: { playlistName: string }) => {
  useEffect(() => {
    const toastId = Number(sessionStorage.getItem("categorizingToastId"));

    if (toastId) {
      toast.dismiss(toastId);
      sessionStorage.removeItem("categorizingToastId");
    }
  }, [playlistName]);

  return null;
};

export default ToastManager;
