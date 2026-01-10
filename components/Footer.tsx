// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="mt-12 py-8 text-sm text-muted">
      <div className="flex items-center justify-between">
        <div>© {new Date().getFullYear()} MEMEiD</div>
        <div className="flex items-center gap-4">
          <a>Terms</a>
          <a>Privacy</a>
          <a>Help</a>
        </div>
      </div>
    </footer>
  );
}
