"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleSignout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return <Button onClick={handleSignout}>Logout</Button>;
}
