"use client";

import React, { useEffect, useState } from "react";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import ConfettiExplosion from "react-confetti-explosion";

export default () => {
  const [isExploding, setIsExploding] = useState(false);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    setIsExploding(true);

    setTimeout(() => {
      setIsExploding(false);
    }, 7000);
  }, []);

  return (
    <>
      {isExploding && (
        <ConfettiExplosion
          height={height}
          width={width}
          particleCount={400}
          duration={3000}
          force={0.6}
          colors={[
            "#A3E635", // Light lime green
            "#65A30D", // Medium olive green
            "#4ADE80", // Mint green
            "#16A34A", // Green
            "#10B981", // Teal green
            "#6EE7B7", // Soft pastel green
            "#86EFAC", // Pastel mint green
            "#34D399", // Emerald green
            "#059669", // Dark emerald
            "#064E3B", // Forest green
          ]}
        />
      )}
    </>
  );
};
