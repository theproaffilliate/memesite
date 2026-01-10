// components/UI/Input.tsx
import React from "react";
import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={clsx(
        "bg-white/3 border border-white/6 rounded-md px-3 py-2 outline-none w-full text-sm",
        className
      )}
      {...props}
    />
  );
}
