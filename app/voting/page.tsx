"use client";

import { useState } from "react";
import Link from "next/link";

export default function Voting() {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const candidates = [
    { id: 1, name: "Candidate A", votes: 42 },
    { id: 2, name: "Candidate B", votes: 38 },
    { id: 3, name: "Candidate C", votes: 19 },
  ];

  const handleVote = async () => {
    if (!selectedCandidate) {
      setMessage("Please select a candidate first.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Simulate transaction / contract call using environment config
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setMessage(`Successfully voted for ${selectedCandidate}!`);
    } catch (error) {
      setMessage("Voting failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-6 font-sans">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Active Voting Session
          </h1>
          <Link
            href="/"
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
          >
            &larr; Back Home
          </Link>
        </div>

        <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
          Contract Address: <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 p-1 rounded">0xD7AC...771B</span>
        </p>

        <div className="space-y-4 mb-6">
          {candidates.map((candidate) => (
            <label
              key={candidate.id}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                selectedCandidate === candidate.name
                  ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                  : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="candidate"
                  value={candidate.name}
                  checked={selectedCandidate === candidate.name}
                  onChange={() => setSelectedCandidate(candidate.name)}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {candidate.name}
                </span>
              </div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {candidate.votes} votes
              </span>
            </label>
          ))}
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm">
            {message}
          </div>
        )}

        <button
          onClick={handleVote}
          disabled={loading || !selectedCandidate}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white font-semibold rounded-xl transition shadow-md disabled:cursor-not-allowed"
        >
          {loading ? "Processing Transaction..." : "Submit Vote"}
        </button>
      </div>
    </div>
  );
}