// Types for your database
export interface Meme {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  creator_id: string;
  creator_name?: string;
  created_at: string;
  updated_at: string;
  views: number;
  downloads: number;
  tags: string[];
  country?: string;
  language?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
}

export interface UserStats {
  uploads: number;
  downloads: number;
  bookmarks: number;
  views: number;
}

export interface Bookmark {
  id: string;
  user_id: string;
  meme_id: string;
  created_at: string;
}
