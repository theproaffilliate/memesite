"use client";
import { useState } from "react";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message)
      return setStatus({
        type: "error",
        text: "Please include your email and message.",
      });

    setLoading(true);
    setStatus({ type: "info", text: "Sending message..." });

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/pamilerinadetoye1@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: name || "Anonymous",
            email,
            message,
            _subject: `Contact from memesite: ${name || "Anonymous"}`,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          text: "Message sent successfully! We will get back to you soon.",
        });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus({
          type: "error",
          text: data.message || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        text: "An error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Support</h1>
      <p className="mb-4 text-sm text-muted">
        For general inquiries or help, fill the form below. We will get back to
        you via email.
      </p>

      {status && (
        <div
          className={`mb-4 p-3 rounded text-sm ${
            status.type === "success"
              ? "bg-green-500/20 text-green-300"
              : status.type === "error"
                ? "bg-red-500/20 text-red-300"
                : "bg-blue-500/20 text-blue-300"
          }`}
        >
          {status.text}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-white/3 p-3 rounded-md"
            rows={6}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setName("");
              setEmail("");
              setMessage("");
              setStatus(null);
            }}
            disabled={loading}
          >
            Reset
          </Button>
        </div>
      </form>
    </section>
  );
}
