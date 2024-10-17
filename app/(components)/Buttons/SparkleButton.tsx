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

      {[1, 2, 3, 4, 5, 6].map((startNumber) => (
        <div className={`sparkle-star-${startNumber}`}>
          <GlowingSparkle />
        </div>
      ))}
    </button>
  );
};

export default SparkleButton;
