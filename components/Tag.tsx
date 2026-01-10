// components/Tag.tsx
export default function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs px-2 py-1 rounded-md bg-pill text-white/90">
      {children}
    </span>
  );
}
