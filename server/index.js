const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
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

// Routes
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
      balance: 100, // Starting balance
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

    if (user.balance < 10) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Generate random number between 0-100
    const generatedNumber = Math.floor(Math.random() * 101);
    
    // Game logic: win if number is > 70 and <= 100, lose if <= 70
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

// User routes
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
  const userList = users.map(u => ({
    _id: u.id.toString(),
    id: u.id,
    username: u.username,
    email: u.email,
    phone: u.phone || '',
    role: u.role,
    balance: u.balance,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt || u.createdAt
  }));
  res.json({ users: userList });
});

app.post('/api/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, email, phone, password, role = 'client', balance = 100 } = req.body;
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: nextUserId++,
      username,
      email,
      phone: phone || '',
      password: hashedPassword,
      role,
      balance,
      createdAt: new Date()
    };

    users.push(newUser);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: newUser.id.toString(),
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        balance: newUser.balance,
        createdAt: newUser.createdAt,
        updatedAt: newUser.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { username, email, phone, role, balance } = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    users[userIndex] = {
      ...users[userIndex],
      username: username || users[userIndex].username,
      email: email || users[userIndex].email,
      phone: phone !== undefined ? phone : users[userIndex].phone,
      role: role || users[userIndex].role,
      balance: balance !== undefined ? balance : users[userIndex].balance,
      updatedAt: new Date()
    };

    res.json({
      message: 'User updated successfully',
      user: {
        _id: users[userIndex].id.toString(),
        id: users[userIndex].id,
        username: users[userIndex].username,
        email: users[userIndex].email,
        phone: users[userIndex].phone,
        role: users[userIndex].role,
        balance: users[userIndex].balance,
        createdAt: users[userIndex].createdAt,
        updatedAt: users[userIndex].updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    users.splice(userIndex, 1);
    res.json({ message: 'User deleted successfully' });
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

app.get('/api/history/all', authenticateToken, requireAdmin, (req, res) => {
  const formattedGames = gameHistory.map(game => ({
    _id: game.id.toString(),
    gameId: game.id.toString(),
    userId: game.userId.toString(),
    generatedNumber: game.generatedNumber,
    result: game.result,
    balanceChange: game.balanceChange,
    newBalance: game.newBalance,
    date: game.date || game.createdAt
  }));
  res.json({ history: formattedGames.sort((a, b) => new Date(b.date) - new Date(a.date)) });
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check route
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

// Railway health check
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
    documentation: `http://localhost:${PORT}/api-docs`
  });
});

// Initialize and start server
const startServer = async () => {
  try {
    await createDefaultAdmin();
    
    const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server started on ${HOST}:${PORT}`);
      console.log(`📚 API Documentation: http://${HOST}:${PORT}/api-docs`);
      console.log(`🌐 Frontend URL: http://localhost:3000`);
      console.log('✅ Using in-memory database for demonstration');
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Server startup error:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;