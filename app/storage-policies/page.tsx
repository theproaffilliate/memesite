"use client";

export default function StoragePoliciesGuidePage() {
  return (
    <div className="max-w-3xl mx-auto p-6 pt-20 text-white">
      <h1 className="text-3xl font-bold mb-6">Storage RLS Policies Setup</h1>

      <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">
          If uploads are failing with connection errors:
        </h2>
        <p className="mb-4">
          You need to configure Row-Level Security (RLS) policies for the memes
          bucket to allow authenticated users to upload files.
        </p>
      </div>

      <div className="space-y-6">
        <div className="border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Step 1: Go to Storage Policies
          </h3>
          <ol className="space-y-2 list-decimal list-inside text-gray-300">
            <li>Open Supabase Dashboard</li>
            <li>
              Click{" "}
              <code className="bg-black/50 px-2 py-1 rounded">Storage</code>
            </li>
            <li>
              Click on the{" "}
              <code className="bg-black/50 px-2 py-1 rounded">memes</code>{" "}
              bucket
            </li>
            <li>
              Click the{" "}
              <code className="bg-black/50 px-2 py-1 rounded">Policies</code>{" "}
              tab
            </li>
          </ol>
        </div>

        <div className="border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Step 2: Create Upload Policy
          </h3>
          <p className="mb-4 text-gray-300">
            Click{" "}
            <code className="bg-black/50 px-2 py-1 rounded">
              Create policy for uploads
            </code>{" "}
            and use this SQL:
          </p>
          <pre className="bg-black/50 p-4 rounded overflow-x-auto text-sm">
            {`-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'memes' AND
  (auth.role() = 'authenticated')
);`}
          </pre>
        </div>

        <div className="border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Step 3: Create Read Policy
          </h3>
          <p className="mb-4 text-gray-300">
            Also create a read policy so anyone can access the files:
          </p>
          <pre className="bg-black/50 p-4 rounded overflow-x-auto text-sm">
            {`-- Allow public read access
CREATE POLICY "Allow public read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'memes');`}
          </pre>
        </div>

        <div className="border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Alternative: Use the Dashboard UI
          </h3>
          <ol className="space-y-2 list-decimal list-inside text-gray-300">
            <li>
              In the Policies tab, click{" "}
              <code className="bg-black/50 px-2 py-1 rounded">New policy</code>
            </li>
            <li>
              Select{" "}
              <code className="bg-black/50 px-2 py-1 rounded">For uploads</code>
            </li>
            <li>
              Grant to:{" "}
              <code className="bg-black/50 px-2 py-1 rounded">
                Authenticated users
              </code>
            </li>
            <li>
              Click{" "}
              <code className="bg-black/50 px-2 py-1 rounded">Save policy</code>
            </li>
          </ol>
        </div>

        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-green-400">
            ✓ After setting up policies
          </h3>
          <p className="text-gray-300">
            Go back to your app and try uploading again. The files should upload
            successfully to the storage bucket.
          </p>
        </div>
      </div>
    </div>
  );
}
