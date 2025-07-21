#!/usr/bin/env node

// Railway startup script for TrueNumber API
console.log('🚀 Starting TrueNumber API on Railway...');
console.log('📊 Environment variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);

// Load environment variables
require('dotenv').config();

// Start the main server
require('./index.js');