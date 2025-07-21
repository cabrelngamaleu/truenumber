#!/usr/bin/env node

const express = require('express');
const cors = require('cors');

console.log('🚀 Starting TrueNumber API on Railway from root...');
console.log('📊 Environment variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route de santé simple
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'TrueNumber API is running on Railway',
    timestamp: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV || 'development'
  });
});

// Route racine
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'TrueNumber API - Railway Deployment',
    status: 'active',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// Route API de base
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'TrueNumber API v1.0',
    status: 'operational'
  });
});

// Démarrage du serveur
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TrueNumber API running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Railway URL: https://truenumber-production.up.railway.app`);
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

module.exports = app;