"use client";

import React from "react";
import Sparkles from "../Sparkles";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";
import GlowingSparkle from "../GlowingSparkle";

const Categorize = ({ playlistId }: { playlistId: string }) => {

  return (
    <>
      <div className="relative w-full">
        <button
          onClick={() => 
            toast.error(
              <div>
                Unable to categorize the playlist — Spotify deprecated the API endpoint
                that provided the songs' audio features :(
                <br />
                <br />
                <a
                  href="https://developer.spotify.com/documentation/web-api/reference/get-audio-features"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  https://developer.spotify.com/documentation/web-api/reference/get-audio-features
                </a>
              </div>,
              {
                duration: Infinity,
              }
            )
          }
          className="sparkle-button flex justify-center items-center h-9 px-4 py-2 bg-[#9333ea] hover:bg-transparent shadow-purple"
        >
          <Wand2 className={`w-4 h-4 text-white`} />

          <div className={`sparkle-star-1`}>
            <GlowingSparkle />
          </div>
          <div className={`sparkle-star-2`}>
            <GlowingSparkle />
          </div>
          <div className={`sparkle-star-3`}>
            <GlowingSparkle />
          </div>
          <div className={`sparkle-star-4`}>
            <GlowingSparkle />
          </div>
          <div className={`sparkle-star-5`}>
            <GlowingSparkle />
          </div>
          <div className={`sparkle-star-6`}>
            <GlowingSparkle />
          </div>
          <Sparkles />
        </button>
      </div>
    </>
  );
};

export default Categorize;
