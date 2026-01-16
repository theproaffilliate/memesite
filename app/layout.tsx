// app/layout.tsx
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Providers from "./(auth)/providers";

export const metadata = {
  title: "MEMEiD - Video Meme Downloads",
  description: "Discover and download trending video memes",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="container">
            <Header />
            <main className="mt-8">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
