"use client";

import Button from "./UI/Button";

interface UploadRejectionModalProps {
  isOpen: boolean;
  errorMessage: string;
  onClose: () => void;
}

export default function UploadRejectionModal({
  isOpen,
  errorMessage,
  onClose,
}: UploadRejectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[min(500px,95%)]">
        <div
          style={{
            backgroundColor: "rgba(6,8,12,0.85)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: 12,
          }}
          className="p-8 rounded-xl shadow-2xl border border-red-500/30"
        >
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white text-center mb-3">
            Upload Failed
          </h2>

          {/* Error Message */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm leading-relaxed">
              {errorMessage}
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-blue-400 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Requirements:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Maximum file size: 10MB</li>
                  <li>File format: MP4</li>
                  <li>Check your internet connection</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            variant="primary"
            onClick={onClose}
            className="w-full justify-center"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
