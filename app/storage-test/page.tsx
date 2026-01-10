"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function StorageTestPage() {
  const [status, setStatus] = useState<{
    bucketsAccessible: boolean;
    memesBucketExists: boolean;
    testUploadPossible: boolean;
    errors: string[];
  }>({
    bucketsAccessible: false,
    memesBucketExists: false,
    testUploadPossible: false,
    errors: [],
  });

  useEffect(() => {
    const testStorage = async () => {
      const errors: string[] = [];

      try {
        // List all buckets to check if storage is accessible
        const { data: buckets, error: bucketsError } =
          await supabase.storage.listBuckets();

        if (bucketsError) {
          errors.push(`Failed to list buckets: ${bucketsError.message}`);
          setStatus((prev) => ({ ...prev, errors }));
          return;
        }

        setStatus((prev) => ({ ...prev, bucketsAccessible: true }));

        // Check if memes bucket exists
        const memesBucket = buckets?.find((b) => b.name === "memes");
        if (!memesBucket) {
          errors.push(
            'The "memes" bucket does not exist. Please create it in Supabase Storage.'
          );
        } else {
          setStatus((prev) => ({ ...prev, memesBucketExists: true }));
        }

        setStatus((prev) => ({ ...prev, errors }));
      } catch (err: any) {
        errors.push(`Storage error: ${err.message}`);
        setStatus((prev) => ({ ...prev, errors }));
      }
    };

    testStorage();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 pt-20">
      <h1 className="text-3xl font-bold mb-6">Storage Configuration Test</h1>

      <div className="space-y-4">
        <div className="p-4 rounded-lg border">
          <h2 className="font-semibold mb-2">
            {status.bucketsAccessible ? "✅" : "❌"} Storage Accessible
          </h2>
          <p className="text-sm text-gray-400">
            {status.bucketsAccessible
              ? "Your Supabase storage is accessible"
              : "Cannot connect to Supabase storage"}
          </p>
        </div>

        <div className="p-4 rounded-lg border">
          <h2 className="font-semibold mb-2">
            {status.memesBucketExists ? "✅" : "❌"} Memes Bucket Exists
          </h2>
          <p className="text-sm text-gray-400">
            {status.memesBucketExists
              ? 'The "memes" bucket is configured'
              : 'The "memes" bucket is missing - you need to create it'}
          </p>
        </div>

        {status.errors.length > 0 && (
          <div className="p-4 rounded-lg border border-red-500/50 bg-red-500/10">
            <h2 className="font-semibold mb-2 text-red-400">Errors Found</h2>
            <ul className="text-sm text-red-300 space-y-1">
              {status.errors.map((err, i) => (
                <li key={i}>• {err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-4 rounded-lg border border-blue-500/50 bg-blue-500/10 mt-6">
          <h3 className="font-semibold mb-2 text-blue-400">
            How to create the memes bucket:
          </h3>
          <ol className="text-sm text-blue-300 space-y-2 list-decimal list-inside">
            <li>Go to Supabase Dashboard → Storage</li>
            <li>Click "Create a new bucket"</li>
            <li>
              Name it:{" "}
              <code className="bg-black/50 px-2 py-1 rounded">memes</code>
            </li>
            <li>
              Make it public (or configure RLS policies to allow authenticated
              uploads)
            </li>
            <li>Click "Create bucket"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
