// components/DownloadMenu.tsx
"use client";
import Button from "./UI/Button";
import { Dropdown } from "./UI/Dropdown";
import DownloadLoader from "./DownloadLoader";
import useAuth from "@/hooks/useAuth";
import React from "react";
import { useState } from "react";

export default function DownloadMenu({
  memeId,
  onDownload,
}: {
  memeId?: string;
  onDownload?: (audioType: "with" | "no") => void;
}) {
  const [audio, setAudio] = useState<"with" | "no">("with");
  const [isDownloading, setIsDownloading] = useState(false);
  const { user } = useAuth();

  // Record download count
  const recordDownload = async () => {
    if (!memeId || !user) return;

    try {
      const {
        data: { session },
      } = await (await import("@/lib/supabase")).supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) return;

      await fetch(`/api/memes/${memeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "increment_downloads" }),
      });
    } catch (error) {
      console.error("Error recording download:", error);
    }
  };

  const handleDownload = async () => {
    if (!memeId) {
      console.error("Meme ID is required for download. memeId:", memeId);
      alert("Unable to download: Meme ID is missing. Please refresh the page.");
      return;
    }

    try {
      setIsDownloading(true);

      // Call the API to process and download the video
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memeId,
          format: "MP4",
          audioType: audio,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Download failed with status ${response.status}`
        );
      }

      // Get the filename from Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `video.mp4`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+?)"/);
        if (match) filename = match[1];
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Record download if user is authenticated
      await recordDownload();

      // Call the optional callback
      onDownload?.(audio);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download video. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full">
      <Dropdown
        fullWidth
        trigger={
          <div className="w-full">
            <Button
              variant="primary"
              size="md"
              className="flex items-center justify-between w-full px-3"
            >
              <div className="inline-flex items-center gap-2">
                <img
                  src="/side-download.svg"
                  alt="download"
                  className="w-4 h-4"
                />
                <span>Download</span>
              </div>
              <span className="inline-flex items-center gap-2">
                <span className="text-sm">▾</span>
              </span>
            </Button>
          </div>
        }
        align="left"
      >
        <div className="flex flex-col gap-3 p-2">
          {/* Audio Selection - Disabled for now (FFmpeg not available on Vercel serverless) */}

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full px-4 py-3 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <img src="/side-download.svg" alt="" className="w-4 h-4" />
            <span>{isDownloading ? "Downloading..." : "Download MP4"}</span>
          </button>
        </div>
      </Dropdown>

      {/* Download Loader */}
      <DownloadLoader isOpen={isDownloading} />
    </div>
  );
}
