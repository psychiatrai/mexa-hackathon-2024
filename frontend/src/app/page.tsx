'use client'
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-between p-8 pb-20 sm:p-20">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Natural Language Interface
        </h1>
        <p className="text-gray-600">
          Choose your preferred input method to start.
        </p>
      </header>

      {/* Main Section */}
      <main className="w-full max-w-4xl bg-white shadow-md p-6 rounded-lg">
        <div className="flex flex-col items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold text-black">Select Input Type:</h2>
          <div className="flex gap-4">
            <button
              className="btn btn-primary"
              onClick={() => router.push("/textinput")}
            >
              Text
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => router.push("/audioinput")}
            >
              Audio
            </button>
            <button
              className="btn btn-accent"
              onClick={() => router.push("/videoinput")}
            >
              Video
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex gap-6 items-center justify-center text-sm text-gray-600">
        <a
          className="hover:underline"
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read our docs
        </a>
        <a
          className="hover:underline"
          href="https://vercel.com/templates"
          target="_blank"
          rel="noopener noreferrer"
        >
          Examples
        </a>
        <a
          className="hover:underline"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Next.js
        </a>
      </footer>
    </div>
  );
}
