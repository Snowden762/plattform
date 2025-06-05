'use client';
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: number;
  text: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io('http://localhost:4000');
    setSocket(s);
    s.on('chat:message', (msg: string) => {
      setMessages(prev => [...prev, { id: Date.now(), text: msg }]);
    });
    return () => {
      s.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    socket.emit('chat:message', input);
    setInput('');
  };

  return (
    <div className="border rounded-md p-4 h-80 flex flex-col">
      <div className="flex-1 overflow-y-auto mb-2 space-y-1">
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          className="flex-1 border rounded p-1 text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message"
        />
        <button
          className="bg-purple-600 text-white px-3 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
