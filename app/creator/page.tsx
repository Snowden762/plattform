'use client';

import { useState } from 'react';
import LiveStream from '../../components/LiveStream';
import Chat from '../../components/Chat';
import ChallengeList from '../../components/ChallengeList';
import { Challenge } from '../../components/ChallengeForm';

export default function CreatorPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [supply, setSupply] = useState('');

  const createToken = () => {
    alert(`Token ${tokenName} (${tokenSymbol}) created with supply ${supply} (simulated)`);
    setTokenName('');
    setTokenSymbol('');
    setSupply('');
  };

  const handleLike = (id: number) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Creator Dashboard</h1>

      <div className="border p-4 rounded space-y-2 max-w-md">
        <h2 className="font-semibold">Create Token</h2>
        <input
          className="border rounded p-1 text-black w-full"
          placeholder="Token Name"
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
        />
        <input
          className="border rounded p-1 text-black w-full"
          placeholder="Token Symbol"
          value={tokenSymbol}
          onChange={(e) => setTokenSymbol(e.target.value)}
        />
        <input
          className="border rounded p-1 text-black w-full"
          placeholder="Supply"
          value={supply}
          onChange={(e) => setSupply(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-3 py-1 rounded w-full"
          onClick={createToken}
        >
          Launch Token
        </button>
      </div>

      <LiveStream />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Chat />
        <ChallengeList challenges={challenges} onLike={handleLike} />
      </div>
    </div>
  );
}
