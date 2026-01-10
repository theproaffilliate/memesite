"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import useAuth from "@/hooks/useAuth";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  uploads: number;
  downloads: number;
  bookmarks: number;
  views: number;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    uploads: 0,
    downloads: 0,
    bookmarks: 0,
    views: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .maybeSingle(); // Use maybeSingle instead of single to handle missing rows

        if (profileError) throw profileError;

        // If no profile exists, create one
        if (!profileData) {
          console.log("Profile not found, creating one...");
          const { data: newProfile, error: insertError } = await supabase
            .from("users")
            .insert({
              id: user.id,
              email: user.email || "",
              name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
              avatar_url: user.user_metadata?.avatar_url || null,
              bio: null,
            })
            .select()
            .maybeSingle();

          if (insertError) {
            console.error("Error creating profile:", insertError);
            throw insertError;
          }

          setProfile(newProfile);
        } else {
          setProfile(profileData);
        }

        // Fetch user stats
        const { data: memesData, error: memesError } = await supabase
          .from("memes")
          .select("views, downloads")
          .eq("creator_id", user.id);

        if (memesError) throw memesError;

        // Fetch bookmarks count
        const { data: bookmarksData, error: bookmarksError } = await supabase
          .from("bookmarks")
          .select("id", { count: "exact" })
          .eq("user_id", user.id);

        if (bookmarksError) throw bookmarksError;

        const uploads = memesData?.length || 0;
        const downloads = memesData?.reduce((sum, m) => sum + (m.downloads || 0), 0) || 0;
        const views = memesData?.reduce((sum, m) => sum + (m.views || 0), 0) || 0;
        const bookmarks = bookmarksData?.length || 0;

        setStats({
          uploads,
          downloads,
          bookmarks,
          views,
        });
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profile, stats, loading, error };
};
