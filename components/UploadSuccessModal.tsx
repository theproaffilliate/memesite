"use client";

import Link from "next/link";
import Button from "./UI/Button";

interface UploadSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadSuccessModal({
  isOpen,
  onClose,
}: UploadSuccessModalProps) {
  if (!isOpen) return null;

  const handleViewProfile = () => {
    onClose();
    // Navigation happens via link
  };

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
          className="p-8 rounded-xl shadow-2xl border border-green-500/30"
        >
          {/* Success Icon with Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full bg-green-500/20 border border-green-400/40" />
              <div className="absolute inset-0 flex items-center justify-center animate-scale-in">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Upload Successful!
          </h2>
          <p className="text-gray-400 text-center text-sm mb-6">
            Your video has been uploaded and is now live
          </p>

          {/* Success Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <svg
                className="w-5 h-5 text-green-400 shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <span className="text-sm text-green-300">
                Video processing completed
              </span>
            </div>
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <svg
                className="w-5 h-5 text-green-400 shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <span className="text-sm text-green-300">
                Visible to all users
              </span>
            </div>
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <svg
                className="w-5 h-5 text-green-400 shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <span className="text-sm text-green-300">
                Earning reactions already
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              href="/profile"
              onClick={handleViewProfile}
              className="flex-1"
            >
              <Button variant="primary" className="w-full justify-center">
                View Profile
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 justify-center"
            >
              Upload More
            </Button>
          </div>

          {/* Footer Message */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Your video will appear in the main feed shortly
          </p>
        </div>
      </div>
    </div>
  );
}
