import { Receipt } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-10 px-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="rounded-2xl bg-white px-6 py-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 text-indigo-600">
                <Receipt className="h-6 w-6 animate-pulse" />
                <span className="font-semibold tracking-wide uppercase text-xs">
                  Group Expense Splitter
                </span>
              </div>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900">
                Track expenses and split them fairly
              </h1>
              <p className="mt-1 text-gray-600">
                Loading your expense data...
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 animate-pulse">
                Loading...
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm animate-pulse">
            <div className="h-64 bg-gray-100 rounded"></div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm animate-pulse">
            <div className="h-64 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
