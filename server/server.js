const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const prisma = require('./lib/prisma');
const { login, verify } = require('./auth');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Auth routes
app.post('/api/auth/nonce', login);
app.post('/api/auth/verify', verify);

// Token creation
app.post('/api/creator/token', async (req, res) => {
  const { name, symbol, supply, creatorPublicKey } = req.body;
  if (!name || !symbol || !supply || !creatorPublicKey) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  const creator = await prisma.user.findUnique({ where: { publicKey: creatorPublicKey } });
  if (!creator) return res.status(404).json({ error: 'Creator not found' });
  const token = await prisma.token.create({ data: { name, symbol, supply: parseInt(supply, 10), creatorId: creator.id } });
  res.json(token);
});

// List tokens
app.get('/api/creator/token', async (_req, res) => {
  const tokens = await prisma.token.findMany();
  res.json(tokens);
});

// Create challenge
app.post('/api/challenge', async (req, res) => {
  const { text, amount, creatorPublicKey } = req.body;
  if (!text || !amount || !creatorPublicKey) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  const creator = await prisma.user.findUnique({ where: { publicKey: creatorPublicKey } });
  if (!creator) return res.status(404).json({ error: 'Creator not found' });
  const challenge = await prisma.challenge.create({ data: { text, amount: parseFloat(amount), creatorId: creator.id } });
  io.emit('challenge:new', challenge);
  res.json(challenge);
});

// Like challenge
app.post('/api/challenge/:id/like', async (req, res) => {
  const challenge = await prisma.challenge.update({ where: { id: parseInt(req.params.id, 10) }, data: { likes: { increment: 1 } } });
  io.emit('challenge:update', challenge);
  res.json(challenge);
});

// List challenges
app.get('/api/challenge', async (_req, res) => {
  const challenges = await prisma.challenge.findMany();
  res.json(challenges);
});

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
