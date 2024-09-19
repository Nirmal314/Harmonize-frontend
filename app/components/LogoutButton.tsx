"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleSignout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <button
      className="p-5 bg-spotify text-white rounded-full"
      onClick={handleSignout}
    >
      Logout
    </button>
  );
}
