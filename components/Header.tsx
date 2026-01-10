// components/Header.tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import Button from "./UI/Button";
import Avatar from "./UI/Avatar";
import { useState } from "react";
import UploadModal from "./UploadModal";
import useAuth from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  return (
    <>
      <header className="header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Link href="/" className="cursor-pointer shrink-0">
            <img
              src="/reactions.svg"
              alt="MEMEiD"
              className="h-6 sm:h-7 md:h-8 shrink-0"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <SearchBar />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {loading || profileLoading ? (
            <div className="text-sm text-muted">Loading...</div>
          ) : user ? (
            <>
              <Button
                variant="primary"
                onClick={() => setOpen(true)}
                className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm"
              >
                <img
                  src="/upload-icon.svg"
                  alt=""
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"
                />
                <span className="hidden sm:inline">Upload reactions</span>
                <span className="sm:hidden">Upload</span>
              </Button>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => router.push("/profile")}
                  className="hover:opacity-80 transition cursor-pointer shrink-0"
                >
                  <Avatar
                    src={
                      profile?.avatar_url || "/placeholders/default-avatar.svg"
                    }
                    alt={profile?.name || user.email || "User"}
                  />
                </button>
                <button
                  onClick={() => router.push("/profile")}
                  className="text-xs sm:text-sm hover:opacity-80 transition hidden sm:block cursor-pointer"
                >
                  {profile?.name || "User"}
                </button>
              </div>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                onClick={() => setOpen(true)}
                className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm"
              >
                <img
                  src="/upload-icon.svg"
                  alt=""
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"
                />
                <span className="hidden sm:inline">Upload reactions</span>
                <span className="sm:hidden">Upload</span>
              </Button>
              <Button
                variant="ghost"
                style={{ background: "#0FFF75" }}
                onClick={() => router.push("/auth")}
              >
                Sign in
              </Button>
            </>
          )}
        </div>
      </header>

      {open && <UploadModal onClose={() => setOpen(false)} />}
    </>
  );
}


