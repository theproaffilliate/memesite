"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userNotFound, setUserNotFound] = useState(false);
  const [userEmailUnconfirmed, setUserEmailUnconfirmed] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user || null);
        setLoading(false);
      } catch (err) {
        console.error("Auth init error:", err);
        setLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);
    setUserNotFound(false);
    setUserEmailUnconfirmed(false);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (err: any) {
      const msg = err.message || err.error_description || JSON.stringify(err) || "Sign in failed";
      setError(msg);
      // Detect common "no such user" / invalid credentials messages
      const lc = String(msg).toLowerCase();
      // Detect unconfirmed email messages
      if (
        lc.includes("email not confirmed") ||
        lc.includes("email not verified") ||
        lc.includes("confirm") ||
        lc.includes("confirmation required") ||
        lc.includes("not confirmed")
      ) {
        setUserEmailUnconfirmed(true);
      }
      if (
        lc.includes("invalid login") ||
        lc.includes("invalid credentials") ||
        lc.includes("user not found") ||
        lc.includes("no user")
      ) {
        setUserNotFound(true);
      }
      throw err;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/`,
        },
      });
      if (error) throw error;

      if (data.user) {
        // Profile creation is handled by useUserProfile hook or database triggers
        // We don't do it here to avoid RLS issues with unconfirmed users
      }
      return data;
    } catch (err: any) {
      const msg = err.message || "Sign up failed";
      setError(msg);
      throw err;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err: any) {
      const msg = err.message || "Sign out failed";
      setError(msg);
      throw err;
    }
  };

  const resetPasswordForEmail = async (email: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/reset-password`,
      });
      if (error) throw error;
    } catch (err: any) {
      const msg = err.message || "Password reset request failed";
      setError(msg);
      throw err;
    }
  };

  const updatePassword = async (newPassword: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    } catch (err: any) {
      const msg = err.message || "Password update failed";
      setError(msg);
      throw err;
    }
  };

  const resendConfirmation = async (email: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/`,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      const msg = err.message || "Failed to resend confirmation email";
      setError(msg);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    userEmailUnconfirmed,
    userNotFound,
    signIn,
    signUp,
    signOut,
    resetPasswordForEmail,
    updatePassword,
    resendConfirmation,
  };
};

export default useSupabaseAuth;
