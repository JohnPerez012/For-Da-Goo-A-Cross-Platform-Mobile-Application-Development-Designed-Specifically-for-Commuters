// Check tunnel mode requirements
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=================================');
console.log('Tunnel Mode Diagnostic');
console.log('=================================\n');

// Check 1: @expo/ngrok in global node_modules
console.log('1. Checking for @expo/ngrok globally...');
try {
  const globalPath = execSync('npm root -g', { encoding: 'utf8' }).trim();
  const ngrokPath = path.join(globalPath, '@expo', 'ngrok');
  
  if (fs.existsSync(ngrokPath)) {
    console.log('   ✅ Found globally at:', ngrokPath);
  } else {
    console.log('   ❌ Not found globally');
    console.log('   Fix: npm install -g @expo/ngrok');
  }
} catch (err) {
  console.log('   ❌ Error checking global modules');
}

// Check 2: @expo/ngrok in local node_modules
console.log('\n2. Checking for @expo/ngrok locally...');
const localNgrokPath = path.join(__dirname, '..', 'node_modules', '@expo', 'ngrok');
if (fs.existsSync(localNgrokPath)) {
  console.log('   ✅ Found locally');
} else {
  console.log('   ❌ Not found locally');
  console.log('   Fix: npm install @expo/ngrok');
}

// Check 3: ngrok binary
console.log('\n3. Checking for ngrok binary...');
try {
  execSync('ngrok version', { encoding: 'utf8', stdio: 'pipe' });
  console.log('   ✅ ngrok is installed and in PATH');
} catch (err) {
  console.log('   ❌ ngrok not found in PATH');
  console.log('   Fix: Download from https://ngrok.com/download');
}

// Check 4: Network connectivity
console.log('\n4. Checking internet connectivity...');
try {
  execSync('ping -n 1 8.8.8.8', { encoding: 'utf8', stdio: 'pipe' });
  console.log('   ✅ Internet connection OK');
} catch (err) {
  console.log('   ⚠️  Internet connection issue');
}

console.log('\n=================================');
console.log('Recommendations:');
console.log('=================================\n');

console.log('For remote friends (different location):');
console.log('  → Install: npm install -g @expo/ngrok');
console.log('  → Then: npx expo start --tunnel\n');

console.log('For nearby friends (same WiFi):');
console.log('  → Just use: npx expo start');
console.log('  → Share QR code\n');

console.log('For same room, no WiFi:');
console.log('  → Use phone hotspot');
console.log('  → Connect both devices to hotspot');
console.log('  → Run: npx expo start\n');
