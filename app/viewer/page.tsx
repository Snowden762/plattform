'use client';
import { useState, useEffect } from 'react';
import LiveStream from '../../components/LiveStream';
import Chat from '../../components/Chat';
import ChallengeList from '../../components/ChallengeList';
import ChallengeForm, { Challenge } from '../../components/ChallengeForm';
import TokenPurchase from '../../components/TokenPurchase';

const CREATOR_PUBKEY = 'CreatorPublicKey';

export default function ViewerPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [tokenId, setTokenId] = useState<number | null>(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/creator/token')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) setTokenId(data[0].id);
      });
    fetch('http://localhost:4000/api/challenge')
      .then(res => res.json())
      .then(setChallenges);
  }, []);

  const addChallenge = (c: Challenge) => {
    setChallenges((prev) => [...prev, c]);
  };

  const handleLike = (c: Challenge) => {
    setChallenges(prev => prev.map(ch => ch.id === c.id ? c : ch));
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Viewer Page</h1>
      <LiveStream />
      {tokenId && <TokenPurchase tokenId={tokenId} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Chat />
        <ChallengeForm onAdd={addChallenge} creatorPublicKey={CREATOR_PUBKEY} />
      </div>
      <ChallengeList challenges={challenges} onLike={handleLike} />
    </div>
  );
}
