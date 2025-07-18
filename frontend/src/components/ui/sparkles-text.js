import React from "react";
import Sparkle from "react-sparkle";
import { motion } from "framer-motion";

export function SparklesText({ text, className = "" }) {
  return (
    <motion.span
      className={`relative inline-block font-extrabold text-white ${className}`}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, type: "spring", stiffness: 80 }}
      style={{ position: "relative", display: "inline-block" }}
    >
      {text}
      <Sparkle
        color="white"
        count={18}
        minSize={7}
        maxSize={13}
        overflowPx={8}
        fadeOutSpeed={10}
        flicker={false}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      />
    </motion.span>
  );
} 