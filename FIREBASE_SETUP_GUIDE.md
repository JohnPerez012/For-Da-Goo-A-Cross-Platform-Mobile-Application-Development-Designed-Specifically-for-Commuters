# Firebase Setup & Testing Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `fordago-app` (or any name you prefer)
4. Click **Continue**
5. Disable Google Analytics (optional for testing)
6. Click **Create project**
7. Wait for project creation, then click **Continue**

## Step 2: Enable Realtime Database

1. In the left sidebar, click **Build** → **Realtime Database**
2. Click **"Create Database"**
3. Select database location: **Singapore** (closest to Philippines)
4. Choose **"Start in test mode"** (for development)
   - This allows read/write without authentication
   - ⚠️ Change to production rules later!
5. Click **Enable**

## Step 3: Get Firebase Configuration

1. Click the **gear icon** (⚙️) next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **web icon** (`</>`) to add a web app
5. Register app:
   - App nickname: `FordaGo Web`
   - Don't check "Firebase Hosting"
   - Click **"Register app"**
6. Copy the `firebaseConfig` object values

## Step 4: Update .env File

Replace the placeholder values in your `.env` file with the actual values from Firebase:

```env
EXPO_PUBLIC_WEATHER_API_KEY=6ce70dba3258486084f184846260803

# Firebase Configuration - REPLACE WITH YOUR ACTUAL VALUES
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=fordago-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://fordago-app-default-rtdb.asia-southeast1.firebasedatabase.app
EXPO_PUBLIC_FIREBASE_PROJECT_ID=fordago-app
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=fordago-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

**Important Notes:**
- The `DATABASE_URL` format depends on your region:
  - US: `https://PROJECT_ID-default-rtdb.firebaseio.com`
  - Asia: `https://PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app`
  - Europe: `https://PROJECT_ID-default-rtdb.europe-west1.firebasedatabase.app`

## Step 5: Configure Firebase Security Rules

1. In Firebase Console, go to **Realtime Database**
2. Click the **"Rules"** tab
3. Replace the rules with:

```json
{
  "rules": {
    "sharedLocations": {
      ".read": true,
      ".write": true,
      "$userId": {
        ".validate": "newData.hasChildren(['userId', 'latitude', 'longitude', 'timestamp', 'isSharing'])"
      }
    }
  }
}
```

4. Click **"Publish"**

⚠️ **Security Warning:** These rules allow anyone to read/write. For production:
- Implement Firebase Authentication
- Restrict write access to authenticated users only
- Add rate limiting

## Step 6: Test Firebase Connection

### Test 1: Start the App

```bash
# Stop any running servers
# Press Ctrl+C if server is running

# Clear cache and restart
npx expo start --clear
```

### Test 2: Open in Browser

1. Press `w` to open web version
2. Open browser console (F12)
3. Look for these logs:

```
=== EXPLORE SCREEN MOUNTED ===
Generated User ID: user_xxxxxxx
=== useLocationSharing Hook Initialized ===
Setting up Firebase listener for shared locations...
```

**If you see Firebase errors:**
- Check `.env` values are correct
- Verify DATABASE_URL format matches your region
- Ensure Realtime Database is enabled

### Test 3: Share Location

1. Click **"Start Sharing"** button
2. Grant location permission when prompted
3. Check console for:

```
=== START SHARING CALLED ===
Requesting location permissions...
Permission status: granted
Getting initial location...
Initial location: { latitude: xx.xxxx, longitude: xx.xxxx }
Writing initial location to Firebase: {...}
Initial location written successfully
📊 ACTIVE USERS SHARING LOCATION: 1
```

### Test 4: Verify in Firebase Console

1. Go to Firebase Console → Realtime Database
2. You should see data structure:

```
sharedLocations
  └── user_abc123xyz
      ├── userId: "user_abc123xyz"
      ├── latitude: 10.31099
      ├── longitude: 123.92085
      ├── timestamp: 1234567890
      └── isSharing: true
```

### Test 5: Multi-Device Testing

**Option A: Same WiFi Network**

1. On laptop: `npx expo start`
2. On phone: Open Expo Go, scan QR code
3. Both devices start sharing
4. Each should see the other's location

**Option B: Remote Testing (Tunnel)**

1. Install ngrok: `npm install -g @expo/ngrok`
2. Start with tunnel: `npx expo start --tunnel`
3. Share QR code with friend
4. Both start sharing
5. Locations appear on both devices

## Troubleshooting

### Error: "WebSocket connection failed"

**Cause:** Invalid Firebase configuration

**Solution:**
1. Double-check all values in `.env`
2. Ensure `DATABASE_URL` is correct for your region
3. Restart server: `npx expo start --clear`

### Error: "Permission denied"

**Cause:** Firebase rules too restrictive

**Solution:**
1. Go to Firebase Console → Realtime Database → Rules
2. Verify rules allow read/write
3. Publish rules again

### Error: "Location permission denied"

**Cause:** Browser/device location access denied

**Solution:**
- **Web:** Click lock icon in address bar → Allow location
- **Mobile:** Settings → Apps → Expo Go → Permissions → Location → Allow

### No location updates

**Cause:** Interval not running or location service unavailable

**Solution:**
1. Check console for interval messages every 10 seconds
2. Ensure device has GPS/location services enabled
3. On web, location may be less accurate (IP-based)

### Can't see other users

**Cause:** Data not syncing or old data

**Solution:**
1. Check Firebase Console to see if data exists
2. Verify both users are in `sharedLocations` node
3. Check timestamps - old data (>5 min) is filtered out
4. Refresh the app

## Console Log Reference

### Successful Flow:

```
=== EXPLORE SCREEN MOUNTED ===
Generated User ID: user_abc123
📊 Initial active users: 0

=== useLocationSharing Hook Initialized ===
Setting up Firebase listener for shared locations...
No shared locations in database
📊 ACTIVE USERS SHARING LOCATION: 0

[User clicks Start Sharing]

=== TRACK LOCATION BUTTON PRESSED ===
📊 ACTIVE USERS SHARING LOCATION: 0
Starting location sharing...

=== START SHARING CALLED ===
Requesting location permissions...
Permission status: granted
Getting initial location...
Initial location: { latitude: 10.31099, longitude: 123.92085 }
Writing initial location to Firebase: {...}
Initial location written successfully

[Firebase listener receives update]

Firebase data received: { user_abc123: {...} }
Location user_abc123: isSharing=true, age=1s
📊 ACTIVE USERS SHARING LOCATION: 1

=== CebuMap Rendered ===
📊 ACTIVE USERS ON MAP: 1
Rendering marker for user user_abc123: {...}

[Every 10 seconds]

--- Location Update Interval Triggered ---
Updating location: {...}
Location updated successfully
```

## Production Checklist

Before deploying to production:

- [ ] Implement Firebase Authentication
- [ ] Update security rules to require authentication
- [ ] Add rate limiting to prevent abuse
- [ ] Set up Firebase App Check
- [ ] Monitor database usage in Firebase Console
- [ ] Add error reporting (Sentry, etc.)
- [ ] Test with multiple users simultaneously
- [ ] Optimize location update frequency
- [ ] Add battery optimization considerations
- [ ] Implement proper user privacy controls

## Support

If you encounter issues:
1. Check console logs for error messages
2. Verify Firebase Console shows data
3. Test with a fresh browser/incognito window
4. Clear Expo cache: `npx expo start --clear`
5. Check Firebase status: https://status.firebase.google.com/
