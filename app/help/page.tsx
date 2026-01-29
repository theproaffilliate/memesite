import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Help &amp; Support</h1>
      <p className="mb-3">
        Need help? Here are some resources and ways to contact us.
      </p>

      <h2 className="text-lg font-semibold mt-4">Reporting Abuse</h2>
      <p className="mb-3">
        If you find content that violates our policies, please report it using
        the Report feature on the post. For urgent issues, contact support.
      </p>

      <h2 className="text-lg font-semibold mt-4">Contact</h2>
      <p className="mb-3">
        For support inquiries, please visit our{" "}
        <Link href="/contact" className="text-blue-400 hover:underline">
          Contact page
        </Link>
        .
      </p>

      <h2 className="text-lg font-semibold mt-4">Frequently Asked Questions</h2>
      <ol className="list-decimal pl-5 space-y-2">
        <li>
          How do I upload a video? Use the Upload button in the header and
          follow the prompts.
        </li>
        <li>What file types are supported? MP4 only (max 10MB).</li>
        <li>How do I change my profile? Visit your Profile &gt; Settings.</li>
      </ol>
    </div>
  );
}
