"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "./UI/Button";
import Input from "./UI/Input";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updatePassword } = useAuth();

  useEffect(() => {
    // Check if user has a valid session (came from email reset link)
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setIsValidToken(true);
      } else {
        setError("Invalid or expired reset link. Please try again.");
        setTimeout(() => router.push("/forgot-password"), 3000);
      }
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await updatePassword(password);
      alert("Password reset successful! Redirecting to sign in...");
      await supabase.auth.signOut();
      router.push("/auth");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="w-full max-w-md mx-auto p-6 rounded-lg border border-white/10 bg-white/3">
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        {error && (
          <div className="p-3 rounded bg-red-500/20 text-red-300 text-sm">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-lg border border-white/10 bg-white/3">
      <h2 className="text-2xl font-bold mb-6">Create New Password</h2>
      <p className="text-muted mb-6 text-sm">
        Enter a new password to regain access to your account.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-500/20 text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">New Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
