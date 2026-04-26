const fs = require('fs');
const path = require('path');

console.log('🔍 Simple Environment Debug Script');
console.log('==================================');

// Check current working directory
console.log('Current working directory:', process.cwd());

// Check if .env file exists in current directory
const envPath = path.join(process.cwd(), '.env');
console.log('Looking for .env at:', envPath);
console.log('.env exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  // Read and display .env file content (masking sensitive data)
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('\n.env file content (masked):');
  console.log('----------------------------');
  
  const lines = envContent.split('\n');
  lines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        // Mask sensitive values
        if (key.includes('PASSWORD') || key.includes('SECRET') || key.includes('KEY')) {
          console.log(`${key}=********`);
        } else {
          console.log(line);
        }
      } else {
        console.log(line);
      }
    } else {
      console.log(line);
    }
  });
}

// Check process.env for key variables
console.log('\nProcess environment variables:');
console.log('-------------------------------');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Found' : '❌ Not found');
console.log('KAFKA_BROKERS:', process.env.KAFKA_BROKERS ? '✅ Found' : '❌ Not found');
console.log('NODE_ENV:', process.env.NODE_ENV || '❌ Not found');
console.log('PORT:', process.env.PORT || '❌ Not found');

// Try to manually load .env file
console.log('\nAttempting to manually set environment variables:');
console.log('------------------------------------------------');
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const equalsIndex = line.indexOf('=');
      if (equalsIndex > 0) {
        const key = line.substring(0, equalsIndex).trim();
        const value = line.substring(equalsIndex + 1).trim();
        process.env[key] = value;
        console.log(`Set ${key}=${value.substring(0, 10)}...`);
      }
    }
  });
  
  console.log('\n✅ Manual environment loading complete');
  console.log('MONGODB_URI is now:', process.env.MONGODB_URI ? '✅ Set' : '❌ Still not set');
} catch (error) {
  console.log('❌ Failed to read .env file:', error.message);
}