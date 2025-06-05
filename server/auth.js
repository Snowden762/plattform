const { PublicKey } = require('@solana/web3.js');
const nacl = require('tweetnacl');
const prisma = require('./lib/prisma');
const jwt = require('jsonwebtoken');

function generateNonce() {
  return Math.random().toString(36).substring(2);
}

async function getNonce(pubkey) {
  let user = await prisma.user.findUnique({ where: { publicKey: pubkey } });
  if (!user) {
    user = await prisma.user.create({ data: { publicKey: pubkey } });
  }
  const nonce = generateNonce();
  await prisma.user.update({ where: { id: user.id }, data: { nonce } });
  return nonce;
}

async function verifySignature(pubkey, message, signature) {
  const msgBuffer = Buffer.from(message);
  const sigBuffer = Buffer.from(signature, 'base64');
  const pk = new PublicKey(pubkey).toBytes();
  return nacl.sign.detached.verify(msgBuffer, sigBuffer, pk);
}

async function login(req, res) {
  const { publicKey } = req.body;
  if (!publicKey) return res.status(400).json({ error: 'Missing publicKey' });
  const nonce = await getNonce(publicKey);
  res.json({ nonce });
}

async function verify(req, res) {
  const { publicKey, signature, message } = req.body;
  if (!publicKey || !signature || !message)
    return res.status(400).json({ error: 'Invalid input' });
  const valid = await verifySignature(publicKey, message, signature);
  if (!valid) return res.status(401).json({ error: 'Invalid signature' });
  const token = jwt.sign({ publicKey }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
}

module.exports = { login, verify };
