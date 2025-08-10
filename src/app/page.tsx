import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Welcome to MerchHound</h1>
      <p>Your one-stop shop for all things merchandise.</p>
      <Link href="/dashboard" className="text-blue-500 hover:underline">
        Go to Dashboard
      </Link>
    </main>
  );
}
