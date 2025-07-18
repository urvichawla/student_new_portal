import React from "react";
import { Squares } from "./Squares";
import { TubelightNavBar } from "./ui/TubelightNavBar";
import { motion } from "framer-motion";
import { SparklesText } from "./ui/sparkles-text";

export function SquaresDemo() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#060606] flex flex-col items-center justify-center">
    
      <TubelightNavBar />
  
      <Squares
        direction="diagonal"
        speed={0.5}
        squareSize={40}
        borderColor="#333"
        hoverFillColor="#222"
        className="absolute inset-0 w-full h-full"
      />
   
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, type: "spring", stiffness: 80 }}
          className="text-6xl md:text-7xl font-extrabold mb-6 text-center tracking-tight drop-shadow-lg"
        >
          <SparklesText text="Welcome to Student Portal" />
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-2xl md:text-3xl text-center max-w-2xl text-white/90 font-medium mb-2"
        >
          Easily manage your profiles and pay fees online.<br />
          Fast, secure, and hassle free.
        </motion.p>
      </div>
    </div>
  );
}