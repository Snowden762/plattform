'use client';
import { useState } from 'react';

export interface Challenge {
  id: number;
  text: string;
  amount: number;
  likes: number;
}

export default function ChallengeForm({ onAdd, creatorPublicKey }: { onAdd: (c: Challenge) => void; creatorPublicKey: string }) {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');

  const submit = async () => {
    if (!text.trim() || !amount) return;
    const res = await fetch('http://localhost:4000/api/challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, amount: parseFloat(amount), creatorPublicKey })
    });
    const data = await res.json();
    onAdd(data);
    setText('');
    setAmount('');
  };

  return (
    <div className="border p-4 rounded space-y-2">
      <h3 className="font-semibold">Submit Challenge</h3>
      <input
        className="border rounded p-1 text-black w-full"
        placeholder="Challenge"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        className="border rounded p-1 text-black w-full"
        placeholder="Amount (SOL)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-3 py-1 rounded w-full"
        onClick={submit}
      >
        Submit
      </button>
    </div>
  );
}
