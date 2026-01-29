// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-20 border-t border-white/10 bg-black/20 pt-16 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 text-center md:text-left">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <img src="/REACTiONS.svg" alt="MEMEiD" className="h-7" />
            </Link>
            <p className="text-sm text-gray-400 max-w-sm mx-auto md:mx-0 leading-relaxed">
              The best place to find and share video reactions for your memes
              and content. Join our community of creators today.
            </p>
            <div className="text-sm text-gray-500 pt-2">
              © {currentYear} REACTiONS. All rights reserved.
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">
              Company
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">
              Support
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/report"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Report Abuse
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
