'use client';

import { useState } from 'react';
import LiveStream from '../../components/LiveStream';
import Chat from '../../components/Chat';
import ChallengeList from '../../components/ChallengeList';
import ChallengeForm, { Challenge } from '../../components/ChallengeForm';
import TokenPurchase from '../../components/TokenPurchase';

export default function ViewerPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  const addChallenge = (c: Challenge) => {
    setChallenges((prev) => [...prev, c]);
  };

  const handleLike = (id: number) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Viewer Page</h1>
      <LiveStream />
      <TokenPurchase />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Chat />
        <ChallengeForm onAdd={addChallenge} />
      </div>
      <ChallengeList challenges={challenges} onLike={handleLike} />
    </div>
  );
}
