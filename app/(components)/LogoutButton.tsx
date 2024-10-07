"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleSignout = async () => {
    await signOut();
  };

  return (
    <Button
      onClick={handleSignout}
      className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-full transition duration-300 flex items-center justify-center space-x-2"
    >
      <LogOut className="w-5 h-5" />
      <span>Logout</span>
    </Button>
  );
}
