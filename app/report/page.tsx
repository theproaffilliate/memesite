"use client";
import { useState } from "react";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import { supabase } from "@/lib/supabase";

export default function ReportPage() {
  const [memeId, setMemeId] = useState("");
  const [reason, setReason] = useState("inappropriate");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!memeId || !reason)
      return setMessage("Please provide the required fields.");

    try {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        setMessage("You must be signed in to file a report.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ meme_id: memeId, reason, comment }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to submit report");

      setMessage(
        "Report submitted — thank you. Our moderators will review it.",
      );
      setMemeId("");
      setReason("inappropriate");
      setComment("");
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Report Content</h1>
      <p className="mb-4 text-sm text-muted">
        Use this form to report videos that violate our policies. You must be
        signed in to submit a report.
      </p>

      {message && (
        <div className="mb-4 p-3 rounded bg-white/5 text-sm">{message}</div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Meme ID</label>
          <Input
            value={memeId}
            onChange={(e) => setMemeId(e.target.value)}
            placeholder="Enter the meme ID (from the URL)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-md px-3 py-2 bg-transparent border border-white/6"
          >
            <option value="inappropriate">Inappropriate content</option>
            <option value="copyright">Copyright infringement</option>
            <option value="privacy">Privacy violation</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-white/3 p-3 rounded-md"
            rows={4}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setMemeId("");
              setReason("inappropriate");
              setComment("");
            }}
          >
            Reset
          </Button>
        </div>
      </form>
    </section>
  );
}
