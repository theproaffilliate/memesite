// app/upload/page.tsx
"use client";
import { useState } from "react";
import UploadModal from "../../components/UploadModal";
import Button from "../../components/UI/Button";

export default function UploadPage() {
  const [open, setOpen] = useState(false);

  return (
    <section className="py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Upload Meme</h1>
        <p className="text-muted mt-1">
          Upload mp4 files. We'll add storage integration later.
        </p>

        <div className="mt-6">
          <div className="upload-area border-dashed border border-white/6 rounded-xl p-6 flex flex-col items-center gap-4">
            <p className="text-sm text-white/70">
              Drag &amp; drop files here or click to choose
            </p>
            <Button variant="primary" onClick={() => setOpen(true)}>
              Choose file
            </Button>
            <p className="text-xs text-muted">Max 10MB • MP4 recommended</p>
          </div>

          <div className="mt-4 text-sm text-muted">
            Note: This UI is standalone — the in-header modal provides the full
            upload flow.
          </div>
        </div>
      </div>

      {open && <UploadModal onClose={() => setOpen(false)} />}
    </section>
  );
}
