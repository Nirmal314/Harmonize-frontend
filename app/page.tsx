import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
const Home = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className="flex flex-col items-center justify-center bg-black w-full min-h-screen">
      {!session && (
        <Link href="/login" className="p-5 bg-primary text-white rounded-full">
          Login is required
        </Link>
      )}

      {session && (
        <div className="space-y-3 flex flex-col justify-center items-center">
          <p className="p-5 bg-primary text-white rounded-full">
            Welcome, {session.user?.name}
          </p>

          <LogoutButton />

          <Link
            href="/playlists"
            className="px-4 py-2 bg-primary text-white rounded-3xl"
          >
            Go to your playlists
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
