import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutButton from "./components/LogoutButton";
const Home = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center justify-center bg-black w-full min-h-screen">
      {!session && (
        <Link href="/login" className="p-5 bg-spotify text-white rounded-lg">
          Login is required
        </Link>
      )}

      {session && (
        <>
          <p className="p-5 bg-spotify text-white rounded-lg mb-3">
            Welcome, {session.user?.name}
          </p>

          <LogoutButton />
        </>
      )}
    </div>
  );
};

export default Home;
