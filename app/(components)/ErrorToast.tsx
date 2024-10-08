"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

type Props = { error: string; redirect: string };

const ErrorToast = ({ error, redirect }: Props) => {
  const router = useRouter();

  useEffect(() => {
    toast.error(error);
    setTimeout(() => {
      router.push(redirect);
    }, 3500);
  }, []);

  return <></>;
};

export default ErrorToast;
