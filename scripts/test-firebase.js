// Quick Firebase Connection Test
// Run with: node scripts/test-firebase.js

require('dotenv').config();

console.log('=================================');
console.log('Firebase Configuration Test');
console.log('=================================\n');

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

console.log('Checking .env configuration...\n');

let hasErrors = false;

Object.entries(config).forEach(([key, value]) => {
  const status = value && !value.includes('your_') && !value.includes('_here') ? '✅' : '❌';
  console.log(`${status} ${key}: ${value || 'MISSING'}`);
  
  if (status === '❌') {
    hasErrors = true;
  }
});

console.log('\n=================================');

if (hasErrors) {
  console.log('❌ Configuration incomplete!');
  console.log('\nPlease update your .env file with actual Firebase values.');
  console.log('Follow the guide: FIREBASE_SETUP_GUIDE.md');
  process.exit(1);
} else {
  console.log('✅ Configuration looks good!');
  console.log('\nNext steps:');
  console.log('1. Run: npx expo start --clear');
  console.log('2. Press "w" to open in browser');
  console.log('3. Open console (F12) and test location sharing');
  process.exit(0);
}
