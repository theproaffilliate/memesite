"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/lib/supabase";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(
    "/placeholders/default-avatar.svg"
  );
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    // Wait for auth to finish loading before redirecting
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push("/auth");
      return;
    }

    if (profile) {
      setName(profile.name || "");
      setBio(profile.bio || "");
      setAvatarPreview(
        profile.avatar_url || "/placeholders/default-avatar.svg"
      );
    }
  }, [user, profile, router, authLoading]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "Image must be less than 5MB",
        });
        return;
      }

      setAvatar(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatar || !user) return;

    setUploadingAvatar(true);
    setMessage(null);

    try {
      // Upload to Supabase Storage
      const fileExt = avatar.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatar);

      if (uploadError) {
        // Handle bucket not found error
        if (uploadError.message.includes("Bucket not found")) {
          throw new Error(
            "Avatar storage not configured. Please contact support or check the setup documentation."
          );
        }
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const avatarUrl = data.publicUrl;

      // Update user profile
      const { error: updateError } = await supabase
        .from("users")
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setMessage({ type: "success", text: "Avatar uploaded successfully!" });
      setAvatar(null);
      // Refresh profile after successful upload
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      console.error("Avatar upload error:", err);
      setMessage({
        type: "error",
        text: err.message || "Failed to upload avatar",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload avatar if selected
    if (avatar) {
      await uploadAvatar();
      return;
    }

    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from("users")
        .update({
          name,
          bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => router.push("/profile"), 2000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-500/20 text-green-300 border border-green-500/50"
                  : "bg-red-500/20 text-red-300 border border-red-500/50"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Avatar Section */}
            <div className="border-b border-gray-700 pb-6">
              <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400 bg-gray-700 shrink-0 shadow-lg">
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Upload New Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      JPG, PNG or GIF (Max 5MB)
                    </p>
                  </div>
                  {avatar && (
                    <Button
                      variant="primary"
                      type="button"
                      onClick={uploadAvatar}
                      disabled={uploadingAvatar}
                    >
                      {uploadingAvatar ? "Uploading..." : "Upload Avatar"}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Email and Profile Fields */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-gray-700"
              />
              <p className="text-xs text-gray-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="primary"
                type="submit"
                disabled={saving || uploadingAvatar}
              >
                {saving
                  ? "Saving..."
                  : uploadingAvatar
                  ? "Uploading..."
                  : "Save Changes"}
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={() => router.push("/profile")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
