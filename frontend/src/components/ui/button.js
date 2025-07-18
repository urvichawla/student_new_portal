import React from "react";
export function Button({ className, variant, ...props }) {
  let base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  let variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline bg-transparent text-primary"
  };
  return <button className={`${base} ${variants[variant] || variants.default} ${className || ""}`} {...props} />;
}