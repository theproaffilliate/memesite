// components/UI/Avatar.tsx
import React from "react";

export default function Avatar({ src, alt }: { src?: string; alt?: string }) {
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="text-sm">{alt?.[0]}</div>
      )}
    </div>
  );
}
