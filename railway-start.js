#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

console.log('🚀 Starting TrueNumber API on Railway...');
console.log('📊 Environment variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'truenumber-default-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database for demonstration
let users = [];
let gameHistory = [];
let nextUserId = 1;
let nextGameId = 1;

// Create default admin user
const createDefaultAdmin = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  users.push({
    id: nextUserId++,
    username: 'admin',
    email: 'admin@truenumber.com',
    phone: '+237123456789',
    password: hashedPassword,
    role: 'admin',
    balance: 1000,
    createdAt: new Date()
  });
  console.log('👤 Default admin user created');
  console.log('📧 Email: admin@truenumber.com');
  console.log('🔑 Password: admin123');
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: nextUserId++,
      username,
      email,
      phone: phone || '',
      password: hashedPassword,
      role: 'client',
      balance: 0,
      createdAt: new Date()
    };

    users.push(newUser);

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Compte créé avec succès',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        balance: newUser.balance
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        balance: user.balance
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Game routes
app.post('/api/game/play', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const generatedNumber = Math.floor(Math.random() * 101);
    const isWin = generatedNumber > 70;
    const balanceChange = isWin ? 50 : -35;
    
    user.balance += balanceChange;

    const gameRecord = {
      id: nextGameId++,
      userId: user.id,
      generatedNumber,
      result: isWin ? 'gagné' : 'perdu',
      balanceChange,
      newBalance: user.balance,
      date: new Date(),
      createdAt: new Date()
    };

    gameHistory.push(gameRecord);

    res.json({
      message: isWin ? 'You won!' : 'You lost!',
      result: isWin ? 'gagné' : 'perdu',
      generatedNumber,
      balanceChange,
      newBalance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Balance routes
app.get('/api/balance', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ balance: user.balance });
});

// History routes
app.get('/api/history', authenticateToken, (req, res) => {
  const userGames = gameHistory.filter(g => g.userId === req.user.userId);
  const formattedGames = userGames.map(game => ({
    _id: game.id,
    gameId: game.id.toString(),
    userId: game.userId,
    generatedNumber: game.generatedNumber,
    result: game.result,
    balanceChange: game.balanceChange,
    newBalance: game.newBalance,
    date: game.date || game.createdAt
  }));
  res.json({ history: formattedGames.sort((a, b) => new Date(b.date) - new Date(a.date)) });
});

// Health check routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'TrueNumber API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    service: 'truenumber-api'
  });
});

// Base route
app.get('/', (req, res) => {
  res.json({ 
    message: 'TrueNumber API - Server running',
    status: 'operational'
  });
});

// Initialize and start server
const startServer = async () => {
  try {
    await createDefaultAdmin();
    
    const HOST = '0.0.0.0';
    
    const server = app.listen(PORT, HOST, () => {
      console.log(`🚀 Server started on ${HOST}:${PORT}`);
      console.log(`🌐 Railway URL: https://truenumber-production-b8b8.up.railway.app`);
      console.log('✅ Using in-memory database for demonstration');
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Gestion des erreurs
    server.on('error', (err) => {
      console.error('❌ Server error:', err);
      process.exit(1);
    });

    // Gestion de l'arrêt propre
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Server startup error:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;