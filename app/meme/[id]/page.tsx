// app/meme/[id]/page.tsx
"use server";
import { notFound } from "next/navigation";
import DownloadMenu from "../../../components/DownloadMenu";
import { supabase } from "@/lib/supabase";
import { sampleMemes } from "@/lib/placeholderData";

export default async function MemePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Try to fetch from Supabase first
  let dbMeme = null;
  let dbMemeError = null;

  try {
    const result = await supabase
      .from("memes")
      .select("*")
      .eq("id", id)
      .single();
    dbMeme = result.data;
    dbMemeError = result.error;
  } catch (error) {
    dbMemeError = error;
  }

  // Fall back to sample data for testing
  let meme = dbMeme || sampleMemes.find((m) => m.id === id);

  if (!meme) {
    return notFound();
  }

  // Fetch related memes
  let relatedMemes = [];
  try {
    const result = await supabase
      .from("memes")
      .select("id, title, thumbnail_url")
      .neq("id", id)
      .limit(3);
    relatedMemes = result.data || [];
  } catch (error) {
    relatedMemes = [];
  }

  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-black rounded-lg overflow-hidden">
            {/* Video from Supabase Storage */}
            <video
              controls
              src={meme.video_url}
              className="w-full h-[440px] object-cover bg-black"
            />
          </div>
          <h1 className="text-2xl font-semibold mt-4">{meme.title}</h1>
          <div className="text-muted mt-2">
            {meme.tags &&
              Array.isArray(meme.tags) &&
              meme.tags.map((t: string) => `#${t} `)}
          </div>
          <div className="mt-4 text-sm text-muted">
            Country: {meme.country || "Unknown"} • Language:{" "}
            {meme.language || "Unknown"}
          </div>
          {meme.description && (
            <p className="mt-4 text-sm text-white">{meme.description}</p>
          )}
        </div>

        <aside className="space-y-4">
          <div className="bg-card p-4 rounded-md">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted">Stats</div>
              <div className="text-sm">
                {(meme.views || 0).toLocaleString()} views
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-muted">
              <span>{(meme.downloads || 0).toLocaleString()} downloads</span>
            </div>
            <div className="mt-3">
              <DownloadMenu memeId={meme.id} />
            </div>
          </div>

          <div className="bg-card p-4 rounded-md">
            <div className="text-sm text-muted">Related</div>
            <div className="mt-2 space-y-2">
              {relatedMemes && relatedMemes.length > 0 ? (
                relatedMemes.map((r: any) => (
                  <div key={r.id} className="flex items-center gap-3">
                    {r.thumbnail_url && (
                      <img
                        src={r.thumbnail_url}
                        className="w-14 h-10 object-cover rounded"
                      />
                    )}
                    <div className="text-sm">{r.title}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted">No related memes</div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
