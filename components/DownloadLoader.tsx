// components/DownloadLoader.tsx
"use client";

export default function DownloadLoader({ isOpen }: { isOpen: boolean }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-900 rounded-lg p-8 flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-700 border-t-[#1fb6ff] rounded-full animate-spin" />

        {/* Loading text */}
        <div className="text-center">
          <p className="text-white font-semibold">Processing Video</p>
          <p className="text-sm text-gray-400 mt-1">
            Converting format and processing audio...
          </p>
        </div>

        {/* Progress indicator */}
        <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-linear-to-r from-[#1fb6ff] to-[#00d4ff] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
