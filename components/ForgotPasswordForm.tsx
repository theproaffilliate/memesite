"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "./UI/Button";
import Input from "./UI/Input";
import useAuth from "@/hooks/useAuth";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { resetPasswordForEmail, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPasswordForEmail(email);
      setSubmitted(true);
      setEmail("");
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto p-6 rounded-lg border border-white/10 bg-white/3">
        <h2 className="text-2xl font-bold mb-6">Check Your Email</h2>
        <p className="text-muted mb-6">
          We've sent a password reset link to your email. Click the link in the
          email to reset your password.
        </p>
        <p className="text-sm text-muted mb-4">
          The link will expire in 1 hour.
        </p>
        <Link href="/auth">
          <Button variant="primary" className="w-full">
            Back to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-lg border border-white/10 bg-white/3">
      <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
      <p className="text-muted mb-6 text-sm">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-500/20 text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Link
          href="/auth"
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
