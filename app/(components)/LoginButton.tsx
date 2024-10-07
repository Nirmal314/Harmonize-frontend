"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Music } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginButton({
  className,
}: {
  className?: string | undefined;
}) {
  const handleSignin = async () => {
    await signIn("spotify");
  };

  return (
    <Button
      onClick={handleSignin}
      className={cn(
        "bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-full transition duration-300 flex items-center justify-center space-x-2",
        className
      )}
    >
      <Music className="w-5 h-5" />
      <span>Connect Your Spotify</span>
    </Button>
  );
}
