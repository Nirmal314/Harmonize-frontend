import { Sparkles, Wand2 } from "lucide-react";
import React from "react";
import GlowingSparkle from "../GlowingSparkle";

type Props = {
  handler: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isDisabled: boolean | undefined;
};

const SparkleButton = ({ handler, isDisabled }: Props) => {
  return (
    <button
      onClick={handler}
      disabled={isDisabled}
      className="sparkle-button w-full flex justify-center items-center rounded-md"
    >
      <Wand2 className={`w-4 h-4`} />

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
    </button>
  );
};

export default SparkleButton;
