// components/UI/Button.tsx
import React from "react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

export default function Button({
  className,
  children,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md font-semibold transition cursor-pointer";
  const variants: Record<string, string> = {
    primary: "bg-[#1ea7ff] text-white hover:bg-[#17a0e6] shadow-lg",
    ghost: "bg-transparent text-white/90 hover:bg-white/3",
    outline: "bg-transparent border border-white/6 text-white",
  };
  const sizes: Record<string, string> = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
