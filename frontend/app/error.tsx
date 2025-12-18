"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-10 px-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="rounded-2xl bg-white px-6 py-8 shadow-sm">
          <div className="flex flex-col items-center justify-center gap-6 text-center py-12">
            <div className="rounded-full bg-red-100 p-4">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-gray-900">
                Something went wrong
              </h1>
              <p className="text-gray-600 max-w-md">
                We encountered an error while loading your expense data. Please try again.
              </p>
              {error.message && (
                <p className="text-sm text-gray-500 mt-2 font-mono">
                  {error.message}
                </p>
              )}
            </div>
            <Button
              onClick={reset}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Try again
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
