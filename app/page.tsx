import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <h1 className="mx-auto font-bold text-3xl mb-8 text-zinc-900 dark:text-zinc-100">
          Breakout Room 5 - Voting dApp
        </h1>
        
        <div className="flex flex-wrap gap-6 justify-center">
          <Link
            href="/deposit"
            className="px-6 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition font-medium text-lg"
          >
            Deposit
          </Link>
          <Link
            href="/withdraw"
            className="px-6 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition font-medium text-lg"
          >
            Withdraw
          </Link>
          <Link
            href="/voting"
            className="px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition font-medium text-lg shadow-md"
          >
            Vote
          </Link>
          <Link
            href="/test"
            className="px-6 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition font-medium text-lg"
          >
            Test
          </Link>
        </div>
      </main>
    </div>
  );
}