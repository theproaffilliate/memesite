// lib/apiPlaceholders.ts
import { sampleMemes } from "./placeholderData";

export async function fetchMemes() {
  // TODO: integrate with Supabase: supabase.from('memes').select('*')
  // Return sample data for now
  return sampleMemes;
}

export async function fetchMemeById(id: string) {
  // TODO: Supabase or DB fetch
  return sampleMemes.find(m => m.id === id) ?? null;
}

export async function uploadPlaceholder(file: File, metadata?: any) {
  // TODO: Upload to Supabase storage and return file URL
  return "/placeholders/thumb1.jpg";
}
