import React from "react";

export function Label({ children, className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={"block text-sm font-medium text-gray-700 " + className} {...props}>
      {children}
    </label>
  );
} 