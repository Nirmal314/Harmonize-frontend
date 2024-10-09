"use client";

import React from "react";
import { RWebShare } from "react-web-share";

const ShareButton = ({ url }: { url: string }) => {
  return (
    <div>
      <RWebShare
        data={{
          text: "Share your playlist",
          url,
          title: "Share your playlist",
        }}
        onClick={() => console.log("shared successfully!")}
      >
        <button>Share Playlist</button>
      </RWebShare>
    </div>
  );
};

export default ShareButton;
