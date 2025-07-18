import React from 'react';
import { Squares } from './Squares';

export default function AnimatedSquaresBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      <Squares
        direction="diagonal"
        speed={0.5}
        squareSize={40}
        borderColor="#333"
        hoverFillColor="#222"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
} 