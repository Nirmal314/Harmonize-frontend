"use server";
import { Song } from "@/typings";

export async function navigateWithTracks(tracks: Song[]) {
  const res = await fetch(`http://localhost:3000/api/tracks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tracks),
  });

  return res.json();
}
