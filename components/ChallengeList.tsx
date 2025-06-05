'use client';
import { Challenge } from './ChallengeForm';

interface Props {
  challenges: Challenge[];
  onLike: (c: Challenge) => void;
}

export default function ChallengeList({ challenges, onLike }: Props) {
  const like = async (id: number) => {
    const res = await fetch(`http://localhost:4000/api/challenge/${id}/like`, {
      method: 'POST'
    });
    const data = await res.json();
    onLike(data);
  };

  return (
    <div className="border p-4 rounded space-y-2">
      <h3 className="font-semibold">Requested Challenges</h3>
      {challenges.length === 0 && <div>No challenges yet.</div>}
      {challenges.map((c) => (
        <div key={c.id} className="flex justify-between items-center border-b py-1">
          <div>
            <div>{c.text}</div>
            <div className="text-sm text-gray-500">{c.amount} SOL - {c.likes} likes</div>
          </div>
          <button
            className="text-sm bg-gray-200 px-2 rounded"
            onClick={() => like(c.id)}
          >
            Like
          </button>
        </div>
      ))}
    </div>
  );
}
