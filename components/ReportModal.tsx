"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Button from "./UI/Button";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  memeId: string;
  memeTitle: string;
}

const REPORT_REASONS = [
  "Inappropriate Content",
  "Offensive Language",
  "Copyright Infringement",
  "Spam",
  "Harassment",
  "False Information",
  "Other",
];

export default function ReportModal({
  isOpen,
  onClose,
  memeId,
  memeTitle,
}: ReportModalProps) {
  const { user } = useAuth();
  const [selectedReason, setSelectedReason] = useState("");
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to report a meme");
      return;
    }

    if (!selectedReason) {
      setError("Please select a reason for reporting");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meme_id: memeId,
          reason: selectedReason,
          comment: comment.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit report");
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSelectedReason("");
        setComment("");
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting your report");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg mx-auto rounded-2xl shadow-2xl bg-[rgba(18,18,27,0.98)] border border-white/10 p-0 sm:p-0 animate-scale-in"
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-white/5">
          <h2 className="text-xl font-bold">Report Meme</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-white transition text-2xl font-bold px-2"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div
          className="px-6 pb-6 pt-2 overflow-y-auto modal-scroll"
          style={{ maxHeight: "70vh" }}
        >
          <p className="text-sm text-muted mb-4 line-clamp-2">"{memeTitle}"</p>

          {success ? (
            <div className="text-center py-8">
              <div className="text-green-400 mb-2 text-3xl">✓</div>
              <p className="text-green-400 font-semibold">Report submitted</p>
              <p className="text-sm text-muted mt-1">
                Thank you for helping keep our community safe
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Reason for Report
                </label>
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition"
                >
                  <option value="">Select a reason...</option>
                  {REPORT_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Additional Details (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Provide any additional information..."
                  maxLength={500}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition resize-none"
                />
                <p className="text-xs text-muted mt-1">
                  {comment.length}/500 characters
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading || !selectedReason}
                >
                  {isLoading ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
