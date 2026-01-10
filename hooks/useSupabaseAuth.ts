"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (err: any) {
      const msg = err.message || "Sign in failed";
      setError(msg);
      throw err;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      if (data.user) {
        // Try to create user profile - use upsert in case it exists
        const { error: profileError } = await supabase.from("users").upsert(
          {
            id: data.user.id,
            email,
            name,
            avatar_url: null,
            bio: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Don't throw - user is created in auth, just profile creation failed
          // This can happen due to RLS, but the user is still signed up
        }
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

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPasswordForEmail,
    updatePassword,
  };
};

export default useSupabaseAuth;
