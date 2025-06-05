const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory stores
const tokens = [];
const challenges = [];

// Token creation
app.post('/api/creator/token', (req, res) => {
  const { name, symbol, supply } = req.body;
  if (!name || !symbol || !supply) return res.status(400).json({ error: 'Invalid input' });
  const token = { id: uuidv4(), name, symbol, supply };
  tokens.push(token);
  res.json(token);
});

// List tokens
app.get('/api/creator/token', (req, res) => {
  res.json(tokens);
});

// Create challenge
app.post('/api/challenge', (req, res) => {
  const { text, amount } = req.body;
  if (!text || !amount) return res.status(400).json({ error: 'Invalid input' });
  const challenge = { id: uuidv4(), text, amount, likes: 0, tips: [] };
  challenges.push(challenge);
  io.emit('challenge:new', challenge);
  res.json(challenge);
});

// Like challenge
app.post('/api/challenge/:id/like', (req, res) => {
  const challenge = challenges.find(c => c.id === req.params.id);
  if (!challenge) return res.status(404).json({ error: 'Not found' });
  challenge.likes += 1;
  io.emit('challenge:update', challenge);
  res.json(challenge);
});

// Tip challenge
app.post('/api/challenge/:id/tip', (req, res) => {
  const { amount } = req.body;
  const challenge = challenges.find(c => c.id === req.params.id);
  if (!challenge || !amount) return res.status(404).json({ error: 'Not found' });
  challenge.tips.push(amount);
  challenge.total = challenge.tips.reduce((a, b) => a + b, challenge.amount);
  io.emit('challenge:update', challenge);
  res.json(challenge);
});

// List challenges
app.get('/api/challenge', (req, res) => {
  res.json(challenges);
});

// Basic chat via WebSocket
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', socket => {
  socket.on('chat:message', msg => {
    io.emit('chat:message', msg);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Backend listening on ${PORT}`);
});
