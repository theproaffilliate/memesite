"use client";

interface UploadingModalProps {
  isOpen: boolean;
  progress?: number;
}

export default function UploadingModal({
  isOpen,
  progress = 0,
}: UploadingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-[min(500px,95%)]">
        <div
          style={{
            backgroundColor: "rgba(6,8,12,0.85)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: 12,
          }}
          className="p-8 rounded-xl shadow-2xl border border-blue-400/30"
        >
          {/* Upload Icon with Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/40 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-400 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Uploading Video
          </h2>
          <p className="text-gray-400 text-center text-sm mb-6">
            Please don't close this window
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
              <div
                className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-400 to-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-3 text-center font-medium">
              {progress}% Complete
            </p>
          </div>

          {/* Status Messages */}
          <div className="space-y-2 text-sm text-gray-400 text-center">
            <p className="flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Uploading to secure storage
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-gray-600 rounded-full" />
              Processing video metadata
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
