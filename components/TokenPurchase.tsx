import { useState } from 'react';

export default function TokenPurchase() {
  const [amount, setAmount] = useState('');
  const purchase = () => {
    alert(`Purchased ${amount} tokens (simulated)`);
    setAmount('');
  };
  return (
    <div className="border p-4 rounded space-y-2">
      <h3 className="font-semibold">Purchase Creator Token</h3>
      <input
        className="border rounded p-1 text-black w-full"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        className="bg-green-600 text-white px-3 py-1 rounded w-full"
        onClick={purchase}
      >
        Buy
      </button>
    </div>
  );
}
