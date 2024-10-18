"use client";

import { useEffect } from "react";
import { toast } from "sonner";

const ToastManager = ({ playlistId }: { playlistId: string }) => {
  useEffect(() => {
    const toastId = Number(sessionStorage.getItem("categorizingToastId"));

    if (toastId) {
      toast.dismiss(toastId);
      sessionStorage.removeItem("categorizingToastId");
    }
  }, [playlistId]);

  return null;
};

export default ToastManager;
