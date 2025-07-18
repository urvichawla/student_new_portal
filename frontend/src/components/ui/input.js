import React from "react";
export function Input({ className, ...props }) {
  return <input className={`flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 ${className || ""}`} {...props} />;
}