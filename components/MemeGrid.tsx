// components/MemeGrid.tsx
import MemeCard from "./MemeCard";

export default function MemeGrid({ memes }: { memes: any[] }) {
  return (
    <>
      {memes.map((m) => (
        <MemeCard key={m.id} meme={m} />
      ))}
    </>
  );
}
