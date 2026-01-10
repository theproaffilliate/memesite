"use client";
import React, { useState, useRef, useEffect } from "react";

interface VideoTrimmerProps {
  videoFile: File;
  onTrimComplete: (trimmedFile: File) => void;
  onCancel: () => void;
}

export default function VideoTrimmer({
  videoFile,
  onTrimComplete,
  onCancel,
}: VideoTrimmerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrimming, setIsTrimming] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState("");
  const [draggingHandle, setDraggingHandle] = useState<"start" | "end" | null>(
    null
  );

  // Initialize video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const videoUrl = URL.createObjectURL(videoFile);
    video.src = videoUrl;

    const handleLoadedMetadata = () => {
      const videoDuration = video.duration;
      setDuration(videoDuration);
      setEndTime(videoDuration);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", () =>
      setCurrentTime(video.currentTime)
    );

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", () =>
        setCurrentTime(video.currentTime)
      );
      URL.revokeObjectURL(videoUrl);
    };
  }, [videoFile]);

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingHandle || !timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const time = (x / rect.width) * duration;

      if (draggingHandle === "start") {
        setStartTime(Math.min(time, endTime - 0.1));
      } else {
        setEndTime(Math.max(time, startTime + 0.1));
      }
    };

    const handleMouseUp = () => {
      setDraggingHandle(null);
    };

    if (draggingHandle) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingHandle, duration, startTime, endTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTrim = async () => {
    if (startTime >= endTime) {
      setError("Start time must be less than end time");
      return;
    }

    setIsTrimming(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("startTime", startTime.toString());
      formData.append("endTime", endTime.toString());

      const response = await fetch("/api/trim-video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to trim video");
      }

      const trimmedBlob = await response.blob();
      const trimmedFile = new File([trimmedBlob], `trimmed_${videoFile.name}`, {
        type: "video/mp4",
      });

      onTrimComplete(trimmedFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to trim video");
      setIsTrimming(false);
    }
  };

  const startPercent = (startTime / duration) * 100;
  const endPercent = (endTime / duration) * 100;
  const currentPercent = (currentTime / duration) * 100;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl p-4 w-full max-w-xl max-h-[85vh] overflow-y-auto modal-scroll border border-white/10">
        <h2 className="text-xl font-bold text-white mb-4">Trim Video</h2>

        {/* Video Preview - Compact */}
        <div className="mb-4 bg-black rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full bg-black"
            controls={false}
          />
        </div>

        {/* Playback Controls */}
        <div className="mb-4 flex gap-2 items-center">
          <button
            onClick={togglePlayPause}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition cursor-pointer"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <div className="flex-1">
            <span className="text-xs text-gray-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Timeline with Draggable Trimmer */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-white mb-2">
            Drag handles to trim
          </label>
          <div
            ref={timelineRef}
            className="relative w-full h-16 bg-gray-800 rounded-lg border border-gray-700 overflow-visible cursor-pointer"
            onClick={(e) => {
              const rect = timelineRef.current?.getBoundingClientRect();
              if (!rect) return;
              const x = e.clientX - rect.left;
              const time = (x / rect.width) * duration;
              if (videoRef.current) {
                videoRef.current.currentTime = time;
                setCurrentTime(time);
              }
            }}
          >
            {/* Progress bar */}
            <div
              className="absolute top-0 left-0 h-full bg-blue-500/30 pointer-events-none"
              style={{ width: `${currentPercent}%` }}
            />

            {/* Selected range */}
            <div
              className="absolute top-0 h-full bg-blue-600/40 border-l-2 border-r-2 border-blue-400"
              style={{
                left: `${startPercent}%`,
                right: `${100 - endPercent}%`,
              }}
            />

            {/* Start Handle */}
            <div
              className="absolute top-1/2 transform -translate-y-1/2 w-5 h-10 rounded-md border-2 border-blue-300 shadow-lg cursor-col-resize hover:shadow-xl hover:scale-110 transition-all z-10"
              style={{
                left: `${startPercent}%`,
                transform: "translateX(-50%) translateY(-50%)",
                background: "linear-gradient(to right, #3b82f6, #60a5fa)",
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDraggingHandle("start");
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "linear-gradient(to right, #60a5fa, #93c5fd)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "linear-gradient(to right, #3b82f6, #60a5fa)";
              }}
              title="Drag to adjust start time"
            />

            {/* End Handle */}
            <div
              className="absolute top-1/2 transform -translate-y-1/2 w-5 h-10 rounded-md border-2 border-blue-300 shadow-lg cursor-col-resize hover:shadow-xl hover:scale-110 transition-all z-10"
              style={{
                right: `${100 - endPercent}%`,
                transform: "translateX(50%) translateY(-50%)",
                background: "linear-gradient(to right, #60a5fa, #3b82f6)",
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDraggingHandle("end");
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "linear-gradient(to right, #93c5fd, #60a5fa)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "linear-gradient(to right, #60a5fa, #3b82f6)";
              }}
              title="Drag to adjust end time"
            />

            {/* Current position indicator */}
            <div
              className="absolute top-0 w-0.5 h-full bg-yellow-400 pointer-events-none"
              style={{ left: `${currentPercent}%` }}
            />
          </div>
        </div>

        {/* Time Display */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div className="bg-gray-800 rounded p-2">
            <p className="text-gray-400">Start</p>
            <p className="text-white font-semibold">{formatTime(startTime)}</p>
          </div>
          <div className="bg-gray-800 rounded p-2">
            <p className="text-gray-400">End</p>
            <p className="text-white font-semibold">{formatTime(endTime)}</p>
          </div>
        </div>

        {/* Duration Info */}
        <div className="mb-4 p-2 bg-blue-900/30 rounded border border-blue-700/50 text-xs">
          <p className="text-blue-300">
            Duration:{" "}
            <span className="font-semibold">
              {formatTime(Math.max(0, endTime - startTime))}
            </span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-2 bg-red-900/30 rounded border border-red-700/50 text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            disabled={isTrimming}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleTrim}
            disabled={isTrimming}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isTrimming ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Trimming...</span>
              </>
            ) : (
              "Trim & Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
