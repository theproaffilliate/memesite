"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./UI/Button";
import Input from "./UI/Input";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export default function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);
  const { signIn, signUp, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, name);
        // Show confirmation email message instead of redirecting immediately
        setConfirmationEmailSent(true);
      } else {
        await signIn(email, password);
        router.push("/");
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      alert("Google sign-in failed: " + (err.message || String(err)));
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-lg border border-white/10 bg-white/3">
      <h2 className="text-2xl font-bold mb-6">
        {isSignUp ? "Create Account" : "Sign In"}
      </h2>

      {confirmationEmailSent ? (
        <div className="text-center space-y-4">
          <div className="p-4 rounded bg-green-500/20 text-green-300">
            <p className="font-medium mb-2">Confirmation Email Sent!</p>
            <p className="text-sm">
              Please check your email at <strong>{email}</strong> and click the
              confirmation link to activate your account.
            </p>
            <p className="text-xs mt-2 text-green-400">
              You can then sign in with your email and password.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              setConfirmationEmailSent(false);
              setIsSignUp(false);
              setEmail("");
              setPassword("");
              setName("");
            }}
            className="w-full"
          >
            Back to Sign In
          </Button>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 p-3 rounded bg-red-500/20 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-muted">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <Button
            variant="ghost"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-white/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setEmail("");
                setPassword("");
                setName("");
              }}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>

          {!isSignUp && (
            <div className="mt-2 text-center">
              <a
                href="/forgot-password"
                style={{ color: "#f87171" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fca5a5")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#f87171")}
                className="text-xs"
              >
                Forgot your password?
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
