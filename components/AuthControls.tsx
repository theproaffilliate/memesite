// components/AuthControls.tsx
"use client";
import { useAuth } from "../hooks/useAuth";
import Avatar from "./UI/Avatar";
import Button from "./UI/Button";
import Link from "next/link";

export default function AuthControls({ onUpload }: { onUpload?: () => void }) {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Button variant="primary" size="md" onClick={() => onUpload?.()}>
          Upload memes
        </Button>
        <div className="flex items-center gap-2">
          <Avatar src={user.avatar} alt={user.name} />
          <div>{user.name}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/auth">
        <Button variant="ghost">Sign in</Button>
      </Link>
    </div>
  );
}
