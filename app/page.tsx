import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Meme Token Streaming Platform</h1>
      <p className="text-lg">Choose your role to continue</p>
      <div className="space-x-4">
        <Link href="/creator" className="bg-purple-600 text-white px-4 py-2 rounded">
          Creator Page
        </Link>
        <Link href="/viewer" className="bg-blue-600 text-white px-4 py-2 rounded">
          Viewer Page
        </Link>
      </div>
    </main>
  );
}
