// app/page.tsx
import { Suspense } from "react";
import HomePageContent from "./HomePageContent";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="text-center py-12"><p className="text-muted">Loading memes...</p></div>}>
      <HomePageContent />
    </Suspense>
  );
}
