import React from "react";

export function Alert({ variant = "default", children, className = "" }) {
  const base =
    "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground";
  const variants = {
    default: "bg-white text-black border-gray-200",
    destructive: "bg-red-50 text-red-900 border-red-200"
  };
  return (
    <div className={`${base} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </div>
  );
}

export function AlertTitle({ children, className = "" }) {
  return <h5 className={`mb-1 font-semibold leading-none tracking-tight ${className}`}>{children}</h5>;
}

export function AlertDescription({ children, className = "" }) {
  return <div className={`text-sm text-muted-foreground ${className}`}>{children}</div>;
} 