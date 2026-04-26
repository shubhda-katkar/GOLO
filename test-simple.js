// Simple test to check if MongoDB URI is accessible
const fs = require('fs');
const path = require('path');

console.log('🔍 Simple Test');
console.log('==============');

// Read .env file directly
try {
  const envPath = path.join(__dirname, '.env');
  console.log('Reading .env from:', envPath);
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('.env content:\n', envContent);
  
  // Extract MONGODB_URI
  const match = envContent.match(/MONGODB_URI=(.+)/);
  if (match) {
    console.log('✅ MONGODB_URI found:', match[1]);
  } else {
    console.log('❌ MONGODB_URI not found in .env file');
  }
} catch (error) {
  console.error('Error reading .env file:', error.message);
}

// Try to connect to MongoDB
console.log('\nAttempting to connect to MongoDB...');
const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/ads_db';

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });