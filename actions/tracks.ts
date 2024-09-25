"use server";
import { Song } from "@/typings";

export async function navigateWithTracks(tracks: Song[]) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/tracks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tracks),
  });

  return res.json();
}
