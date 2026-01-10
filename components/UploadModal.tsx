// components/UploadModal.tsx
"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Button from "./UI/Button";
import Input from "./UI/Input";
import CustomSelect from "./UI/CustomSelect";
import VideoTrimmer from "./VideoTrimmer";
import UploadRejectionModal from "./UploadRejectionModal";
import UploadingModal from "./UploadingModal";
import UploadSuccessModal from "./UploadSuccessModal";
import countries from "../data/countries";
import languages from "../data/languages";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function UploadModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [showUploadingModal, setShowUploadingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [country, setCountry] = useState("All");
  const [language, setLanguage] = useState("All");
  const [fileToTrim, setFileToTrim] = useState<File | null>(null);
  const [trimmedFile, setTrimmedFile] = useState<File | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      // Validate file size on selection
      if (f.size > MAX_FILE_SIZE) {
        const sizeMB = (f.size / 1024 / 1024).toFixed(2);
        setRejectionMessage(
          `File size is ${sizeMB}MB. Maximum allowed size is 10MB.`
        );
        setShowRejectionModal(true);
        return;
      }
      // Show trimmer modal for optional trimming
      setFileToTrim(f);
      setTrimmedFile(f); // Use original file as default
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) {
      // Validate file size on drop
      if (f.size > MAX_FILE_SIZE) {
        const sizeMB = (f.size / 1024 / 1024).toFixed(2);
        setRejectionMessage(
          `File size is ${sizeMB}MB. Maximum allowed size is 10MB.`
        );
        setShowRejectionModal(true);
        return;
      }
      setFileName(f.name);
      // populate the hidden input's files so form readers can access it
      try {
        const dt = new DataTransfer();
        dt.items.add(f);
        if (fileInputRef.current) fileInputRef.current.files = dt.files;
      } catch (err) {
        // ignore if DataTransfer isn't supported in the environment
      }
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    (async () => {
      // Use trimmed file if available, otherwise use original
      const fileToUpload = trimmedFile;
      if (!fileToUpload) return alert("Please select a video file to upload.");
      if (!title) return alert("Please enter a title for your upload.");

      // Validate file size
      if (fileToUpload.size > MAX_FILE_SIZE) {
        const sizeMB = (fileToUpload.size / 1024 / 1024).toFixed(2);
        setRejectionMessage(
          `File size is ${sizeMB}MB. Maximum allowed size is 10MB.`
        );
        setShowRejectionModal(true);
        return;
      }

      // Ensure user is signed in (client)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return alert("Please sign in before uploading.");

      try {
        setIsUploading(true);
        setShowUploadingModal(true);
        setUploadProgress(0);

        const fd = new FormData();
        fd.append("file", fileToUpload as Blob);
        fd.append("title", title);
        fd.append("description", description);
        fd.append(
          "tags",
          JSON.stringify(
            tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          )
        );
        fd.append("country", country);
        fd.append("language", language);
        fd.append("creator_id", user.id);

        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) return prev;
            return prev + Math.random() * 20;
          });
        }, 500);

        const res = await fetch("/api/upload", { method: "POST", body: fd });
        clearInterval(progressInterval);
        setUploadProgress(100);

        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Upload failed");

        // Show success modal
        setTimeout(() => {
          setShowUploadingModal(false);
          setShowSuccessModal(true);
        }, 500);
      } catch (err: any) {
        console.error(err);
        setShowUploadingModal(false);
        setRejectionMessage(
          err.message || "An unexpected error occurred during upload."
        );
        setShowRejectionModal(true);
      } finally {
        setIsUploading(false);
      }
    })();
  }

  function handleSuccessClose() {
    setShowSuccessModal(false);
    onClose();
  }

  function handleRejectionClose() {
    setShowRejectionModal(false);
    setRejectionMessage("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        style={{
          backgroundColor: "rgba(6,8,12,0.55)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRadius: 12,
        }}
        className="relative w-full max-w-2xl rounded-xl z-50 shadow-lg border border-white/6 flex flex-col max-h-[90vh] overflow-hidden p-6"
      >
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-[#1fb6ff]"
            >
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold">Upload Video Reaction</h3>
              <p className="text-sm text-muted">
                Share your video reactions with the world ! (No Watermark)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white">
            ✕
          </button>
        </div>

        <form
          onSubmit={submit}
          className="grid gap-4 overflow-y-auto flex-1 modal-scroll"
        >
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Video File
            </label>
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  fileInputRef.current?.click();
              }}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition cursor-pointer ${
                isDragging
                  ? "border-[#1fb6ff] bg-white/2"
                  : "border-white/20 hover:border-white/40"
              }`}
            >
              <img
                src="/upload-icon.svg"
                alt="Upload"
                className="w-8 h-8 mx-auto mb-2"
              />
              <p className="text-white font-medium">
                Click or Drag & Drop to upload video
              </p>
              <p className="text-xs text-muted mt-1">MP4 Only (Max 10MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4"
                onChange={handleFile}
                className="sr-only"
                id="video-file-input"
              />
              <label htmlFor="video-file-input" className="cursor-pointer">
                {fileName && (
                  <div className="text-xs text-muted mt-3">{fileName}</div>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Title
            </label>
            <Input
              placeholder="Short title for the video"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your meme..."
              className="w-full bg-white/3 p-3 rounded-md text-white placeholder-muted outline-none focus:ring-1 focus:ring-white/20"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Tags (Optional)
            </label>
            <Input
              placeholder="e.g. funny, cat, viral, etc. (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Location (Optional)
            </label>
            <CustomSelect
              value={country}
              onChange={(v) => setCountry(String(v))}
              options={countries
                .slice(0, 50)
                .map((c) => ({ value: c.code, label: c.name }))}
              placeholder="Search location"
              className="w-full text-left rounded-md px-3 py-2 bg-transparent border border-white/6"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Language (Optional)
            </label>
            <CustomSelect
              value={language}
              onChange={(v) => setLanguage(String(v))}
              options={languages.map((l) => ({
                value: l.code,
                label: l.name,
              }))}
              placeholder="Select language"
              className="w-full text-left rounded-md px-3 py-2 bg-transparent border border-white/6"
            />
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="flex-1 gap-2"
              disabled={isUploading}
            >
              <img src="/upload-icon.svg" alt="Upload" className="w-4 h-4" />
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </div>

      {/* Modals */}
      {fileToTrim && (
        <VideoTrimmer
          videoFile={fileToTrim}
          onTrimComplete={(trimmed) => {
            setTrimmedFile(trimmed);
            setFileName(trimmed.name);
            setFileToTrim(null);
            // Populate fileInputRef with trimmed file
            try {
              const dt = new DataTransfer();
              dt.items.add(trimmed);
              if (fileInputRef.current) fileInputRef.current.files = dt.files;
            } catch (err) {
              // ignore
            }
          }}
          onCancel={() => {
            setFileToTrim(null);
            setTrimmedFile(null);
            setFileName(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
        />
      )}
      <UploadingModal isOpen={showUploadingModal} progress={uploadProgress} />
      <UploadSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
      />
      <UploadRejectionModal
        isOpen={showRejectionModal}
        errorMessage={rejectionMessage}
        onClose={handleRejectionClose}
      />
    </div>
  );
}
