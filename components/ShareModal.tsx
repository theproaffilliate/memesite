// components/ShareModal.tsx
"use client";
import { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  memeId: string;
  memeTitle: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  memeId,
  memeTitle,
}: ShareModalProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/meme/${memeId}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(memeTitle);

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: "/whatsapp.svg",
      color: "#25D366",
      action: () => {
        const text = `Check out this meme: "${memeTitle}" ${shareUrl}`;
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text)}`,
          "_blank"
        );
        onClose();
      },
    },
    {
      name: "X",
      icon: "/twitter.svg",
      color: "#1DA1F2",
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
          "_blank"
        );
        onClose();
      },
    },
    {
      name: "Facebook",
      icon: "/facebook.svg",
      color: "#1877F2",
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          "_blank"
        );
        onClose();
      },
    },
    {
      name: "Telegram",
      icon: "/telegram.svg",
      color: "#0088cc",
      action: () => {
        const text = `${memeTitle} - ${shareUrl}`;
        window.open(
          `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
          "_blank"
        );
        onClose();
      },
    },
    {
      name: "Copy Link",
      icon: "/link.svg",
      color: "rgb(156, 163, 175)",
      action: () => {
        navigator.clipboard.writeText(shareUrl);
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
          onClose();
        }, 1500);
      },
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 transition-opacity overflow-hidden"
      onClick={onClose}
    >
      <div
        className="bg-black rounded-t-2xl sm:rounded-2xl w-[calc(100%-1rem)] sm:w-96 mx-4 sm:mx-0 shadow-lg transition-all transform relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded transition z-10"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="px-4 py-4 border-b border-white/10">
          <h3 className="font-semibold text-lg">Share Meme</h3>
          <p className="text-sm text-muted mt-1">{memeTitle}</p>
        </div>

        {/* Share Options */}
        <div className="p-4 space-y-2">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className="w-full px-4 py-3 hover:bg-white/5 rounded-lg flex items-center gap-3 transition cursor-pointer group"
            >
              <img
                src={option.icon}
                alt={option.name}
                className="w-5 h-5 object-contain"
                style={{
                  filter:
                    option.name === "X"
                      ? "brightness(0) saturate(100%) invert(1)"
                      : `drop-shadow(0 0 2px ${option.color}) drop-shadow(0 0 1px ${option.color})`,
                }}
              />
              <span className="flex-1 text-left font-medium">
                {option.name}
              </span>
              {copySuccess && option.name === "Copy Link" && (
                <span className="text-xs text-cyan-400">✓ Copied!</span>
              )}
              <img
                src="/sharelink.svg"
                alt="Open"
                className="w-4 h-4 object-contain shrink-0 group-hover:translate-x-1 transition-transform"
                style={{
                  filter: "brightness(0) saturate(100%) invert(1)",
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
