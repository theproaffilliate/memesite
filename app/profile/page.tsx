"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useBookmarks } from "@/hooks/useBookmarks";
import { supabase } from "@/lib/supabase";
import Button from "@/components/UI/Button";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, stats, loading: profileLoading } = useUserProfile();
  const { bookmarkedMemes, loading: bookmarksLoading } = useBookmarks();
  const [memes, setMemes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"uploads" | "bookmarks">(
    "uploads"
  );

  useEffect(() => {
    // Wait for auth to finish loading before redirecting
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push("/auth");
      return;
    }

    const fetchUserMemes = async () => {
      const { data, error } = await supabase
        .from("memes")
        .select("*")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching memes:", error);
      } else {
        setMemes(data || []);
      }
    };

    if (user) {
      fetchUserMemes();
    }
  }, [user, router, authLoading]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-lg text-white">Loading...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Profile Header Section */}
      <div className="bg-linear-to-b from-blue-600 to-gray-900 pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400 bg-gray-800 shrink-0 shadow-lg">
                <img
                  src={profile.avatar_url || "/placeholders/default-avatar.png"}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => router.push("/profile/settings")}
                className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 rounded-full p-2 shadow-lg transition cursor-pointer opacity-0 group-hover:opacity-100"
                title="Click to edit avatar"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 pt-4">
              <h1
                className="text-4xl text-white mb-2"
                style={{
                  fontWeight: 900,
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                  letterSpacing: "-0.5px",
                }}
              >
                {profile.name}
              </h1>
              <p className="text-blue-300 mb-2">{profile.email}</p>
              <p className="text-gray-300 mb-4">
                Member since{" "}
                {new Date(profile.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
              {profile.bio && (
                <p className="text-gray-300 max-w-2xl mb-6">{profile.bio}</p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                <Button
                  variant="primary"
                  className="flex items-center gap-2"
                  onClick={() => router.push("/profile/settings")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Edit Profile
                </Button>
                <Link href="/upload" className="cursor-pointer">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Upload Meme
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-red-400 hover:text-red-300"
                  onClick={handleSignOut}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Uploads Card */}
          <div className="bg-linear-to-br from-blue-900 to-gray-800 rounded-lg p-6 text-center border border-blue-700/50 hover:border-blue-500 transition shadow-lg cursor-pointer">
            <div className="text-4xl font-bold text-blue-400 mb-2">
              {stats.uploads}
            </div>
            <div className="text-gray-300 text-sm font-medium">Uploads</div>
            <div className="text-gray-500 text-xs mt-2">Memes created</div>
          </div>

          {/* Downloads Card */}
          <div className="bg-linear-to-br from-green-900 to-gray-800 rounded-lg p-6 text-center border border-green-700/50 hover:border-green-500 transition shadow-lg cursor-pointer">
            <div className="text-4xl font-bold text-green-400 mb-2">
              {stats.downloads}
            </div>
            <div className="text-gray-300 text-sm font-medium">Downloads</div>
            <div className="text-gray-500 text-xs mt-2">Total downloads</div>
          </div>

          {/* Views Card */}
          <div className="bg-linear-to-br from-purple-900 to-gray-800 rounded-lg p-6 text-center border border-purple-700/50 hover:border-purple-500 transition shadow-lg cursor-pointer">
            <div className="text-4xl font-bold text-purple-400 mb-2">
              {stats.views}
            </div>
            <div className="text-gray-300 text-sm font-medium">Views</div>
            <div className="text-gray-500 text-xs mt-2">Total views</div>
          </div>

          {/* Bookmarks Card */}
          <div className="bg-linear-to-br from-yellow-900 to-gray-800 rounded-lg p-6 text-center border border-yellow-700/50 hover:border-yellow-500 transition shadow-lg cursor-pointer">
            <div className="text-4xl font-bold text-yellow-400 mb-2">
              {stats.bookmarks}
            </div>
            <div className="text-gray-300 text-sm font-medium">Bookmarks</div>
            <div className="text-gray-500 text-xs mt-2">Saved memes</div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("uploads")}
            className={`px-6 py-3 font-semibold text-sm transition ${
              activeTab === "uploads"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              My Uploads ({stats.uploads})
            </div>
          </button>

          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`px-6 py-3 font-semibold text-sm transition flex items-center gap-2 ${
              activeTab === "bookmarks"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Bookmarks ({stats.bookmarks})
          </button>
        </div>

        {/* Uploads Tab */}
        {activeTab === "uploads" && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">My Uploads</h2>
            {memes.length === 0 ? (
              <div className="bg-gray-800/50 rounded-lg p-12 text-center border border-gray-700">
                <svg
                  className="w-16 h-16 text-gray-600 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p className="text-gray-400 mb-4 text-lg">No uploads yet</p>
                <p className="text-gray-500 mb-6">
                  Start sharing your memes with the community!
                </p>
                <Link href="/upload">
                  <Button variant="primary">Upload Your First Meme</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memes.map((meme) => (
                  <Link key={meme.id} href={`/meme/${meme.id}`}>
                    <div className="bg-gray-800/50 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300 cursor-pointer group border border-gray-700 hover:border-blue-500">
                      {meme.thumbnail_url ? (
                        <div className="aspect-video overflow-hidden bg-gray-900">
                          <img
                            src={meme.thumbnail_url}
                            alt={meme.title}
                            className="w-full h-full object-cover group-hover:opacity-80 transition"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-900 flex items-center justify-center">
                          <div className="text-gray-600 text-center">
                            <svg
                              className="w-12 h-12 mx-auto mb-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            No thumbnail
                          </div>
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition line-clamp-2">
                          {meme.title}
                        </h3>
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                          {meme.description || "No description"}
                        </p>
                        <div className="flex gap-4 mt-3 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            {meme.views || 0}
                          </div>
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                            {meme.downloads || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookmarks Tab */}
        {activeTab === "bookmarks" && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">
              Saved Bookmarks
            </h2>
            {bookmarksLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-400">Loading bookmarks...</div>
              </div>
            ) : bookmarkedMemes.length === 0 ? (
              <div className="bg-gray-800/50 rounded-lg p-12 text-center border border-gray-700">
                <svg
                  className="w-16 h-16 text-gray-600 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                <p className="text-gray-400 mb-4 text-lg">No bookmarks yet</p>
                <p className="text-gray-500 mb-6">
                  Save your favorite memes for quick access
                </p>
                <Link href="/">
                  <Button variant="primary">Explore Memes</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedMemes.map((meme) => (
                  <Link key={meme.id} href={`/meme/${meme.id}`}>
                    <div className="bg-gray-800/50 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300 cursor-pointer group border border-gray-700 hover:border-blue-500">
                      {meme.thumbnail_url ? (
                        <div className="aspect-video overflow-hidden bg-gray-900">
                          <img
                            src={meme.thumbnail_url}
                            alt={meme.title}
                            className="w-full h-full object-cover group-hover:opacity-80 transition"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-900 flex items-center justify-center">
                          <div className="text-gray-600 text-center">
                            <svg
                              className="w-12 h-12 mx-auto mb-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            No thumbnail
                          </div>
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition line-clamp-2">
                          {meme.title}
                        </h3>
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                          {meme.description || "No description"}
                        </p>
                        <div className="flex gap-4 mt-3 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            {meme.views || 0}
                          </div>
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                            {meme.downloads || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
