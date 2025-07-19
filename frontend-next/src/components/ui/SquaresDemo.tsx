"use client";
import { Squares } from "@/components/ui/Squares";

export function SquaresDemo() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#060606] z-[-1]">
      <Squares
        direction="diagonal"
        speed={0.5}
        squareSize={40}
        borderColor="#333"
        hoverFillColor="#222"
        className="w-full h-full"
      />
    </div>
  );
}