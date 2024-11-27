"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const ToastManager = ({
  playlistId,
  message,
  redirect,
}: {
  playlistId?: string;
  message?: string;
  redirect?: string;
}) => {
  const router = useRouter();

  useEffect(() => {
    if (message) {
      toast.error(message, { duration: 7000 });
      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/");
      }
    }
    const toastId = Number(sessionStorage.getItem("categorizingToastId"));

    if (toastId) {
      toast.dismiss(toastId);
      sessionStorage.removeItem("categorizingToastId");
    }
  }, [playlistId]);

  return null;
};

export default ToastManager;
