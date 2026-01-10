import { supabase } from "@/lib/supabase";
import { Meme } from "@/lib/types";

// Get all memes with creator names
export const getMemes = async (limit = 20, offset = 0) => {
  const { data, error } = await supabase
    .from("memes")
    .select(
      `
      id,
      title,
      description,
      video_url,
      thumbnail_url,
      creator_id,
      created_at,
      updated_at,
      views,
      downloads,
      tags,
      country,
      language,
      creator:creator_id (name)
    `
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  // Transform to include creator_name
  return (data as any[]).map((meme: any) => ({
    ...meme,
    creator_name: meme.creator?.name || "User",
  })) as Meme[];
};

// Search memes with creator names
export const searchMemes = async (
  query: string,
  country?: string,
  language?: string
) => {
  let q = supabase
    .from("memes")
    .select(
      `
      id,
      title,
      description,
      video_url,
      thumbnail_url,
      creator_id,
      created_at,
      updated_at,
      views,
      downloads,
      tags,
      country,
      language,
      creator:creator_id (name)
    `
    )
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

  if (country && country !== "All") {
    q = q.eq("country", country);
  }
  if (language && language !== "All") {
    q = q.eq("language", language);
  }

  const { data, error } = await q.order("created_at", { ascending: false });

  if (error) throw error;

  // Transform to include creator_name
  return (data as any[]).map((meme: any) => ({
    ...meme,
    creator_name: meme.creator?.name || "User",
  })) as Meme[];
};

// Get meme by ID with creator name
export const getMemeById = async (id: string) => {
  const { data, error } = await supabase
    .from("memes")
    .select(
      `
      id,
      title,
      description,
      video_url,
      thumbnail_url,
      creator_id,
      created_at,
      updated_at,
      views,
      downloads,
      tags,
      country,
      language,
      creator:creator_id (name)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  // Transform to include creator_name
  const meme = data as any;
  return {
    ...meme,
    creator_name: meme.creator?.name || "User",
  } as Meme;
};

// Create meme
export const createMeme = async (meme: {
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  tags: string[];
  country?: string;
  language?: string;
  creator_id: string;
}) => {
  const { data, error } = await supabase.from("memes").insert([meme]).select();

  if (error) throw error;
  return data?.[0] as Meme;
};

// Update meme views
export const incrementMemeViews = async (id: string) => {
  const { error } = await supabase.rpc("increment_views", { meme_id: id });

  if (error) throw error;
};

// Update meme downloads
export const incrementMemeDownloads = async (id: string) => {
  const { error } = await supabase.rpc("increment_downloads", {
    meme_id: id,
  });

  if (error) throw error;
};

// Get trending memes
export const getTrendingMemes = async (limit = 10) => {
  const { data, error } = await supabase
    .from("memes")
    .select("*")
    .order("views", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Meme[];
};
