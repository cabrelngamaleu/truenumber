#!/usr/bin/env node

console.log('🔍 Railway Debug Script Starting...');
console.log('📊 Environment variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);
console.log('- PWD:', process.cwd());

try {
  console.log('📦 Checking dependencies...');
  
  // Test basic Node.js
  console.log('✅ Node.js version:', process.version);
  
  // Test express import
  const express = require('express');
  console.log('✅ Express loaded successfully');
  
  // Test cors import
  const cors = require('cors');
  console.log('✅ CORS loaded successfully');
  
  // Create simple app
  const app = express();
  const PORT = process.env.PORT || 3000;
  
  app.use(cors());
  app.use(express.json());
  
  app.get('/', (req, res) => {
    res.json({
      message: 'Railway Debug Server',
      status: 'OK',
      timestamp: new Date().toISOString(),
      port: PORT,
      env: process.env.NODE_ENV || 'development'
    });
  });
  
  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      message: 'Debug server is running',
      timestamp: new Date().toISOString()
    });
  });
  
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Debug server running on http://0.0.0.0:${PORT}`);
    console.log('✅ Server started successfully');
  });
  
  server.on('error', (err) => {
    console.error('❌ Server error:', err);
    process.exit(1);
  });
  
} catch (error) {
  console.error('❌ Error during startup:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}