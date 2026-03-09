# Testing Location Sharing (Web + Phone)

## How to Test with Console Logs

### On Web (Laptop):
1. Start the development server:
   ```bash
   npx expo start
   ```

2. Press `w` to open in web browser

3. Open browser console (F12 or Right-click → Inspect → Console)

4. Navigate to the "Explore" tab

5. Look for these console messages:
   ```
   === EXPLORE SCREEN MOUNTED ===
   Generated User ID: user_xxxxxxx
   === useLocationSharing Hook Initialized ===
   Setting up Firebase listener for shared locations...
   ```

6. Click "Start Sharing" button and watch console:
   ```
   === TRACK LOCATION BUTTON PRESSED ===
   === START SHARING CALLED ===
   Requesting location permissions...
   Permission status: granted
   Getting initial location...
   Initial location: { latitude: xx.xxxx, longitude: xx.xxxx }
   Writing initial location to Firebase: {...}
   ```

7. Every 10 seconds you should see:
   ```
   --- Location Update Interval Triggered ---
   Updating location: {...}
   Location updated successfully
   ```

### On Phone (via Expo Go):
1. Start with tunnel mode:
   ```bash
   npx expo start --tunnel
   ```

2. Scan QR code with Expo Go app

3. The phone will share real GPS location

4. Check web browser console - you should see:
   ```
   Firebase data received: { user_xxxxxxx: {...}, user_yyyyyyy: {...} }
   Active locations count: 2
   ```

## What to Check in Console

### ✅ Success Indicators:
- User ID is generated
- Firebase listener is set up
- Location permissions granted
- Initial location retrieved
- Location updates every 10 seconds
- Firebase data received with multiple users
- Markers rendered on map

### ❌ Error Indicators:
- "Location permission denied" - Grant location access
- "Firebase listener error" - Check Firebase config in .env
- "Error updating location" - Check Firebase rules
- No "Firebase data received" - Check internet connection

## Testing Scenarios

### Scenario 1: Single Device (Web Only)
- Open app in browser
- Click "Start Sharing"
- Check console for location updates
- You should see your own location in Firebase
- Active users count should show 1

### Scenario 2: Two Devices (Web + Phone)
- Open web browser on laptop
- Open Expo Go on phone
- Start sharing on phone first
- Check web console - should see phone's location
- Start sharing on web
- Both devices should show 2 active users
- Map should show 2 green markers

### Scenario 3: Simulating Multiple Users (Web Only)
- Open app in 2 different browsers (Chrome + Firefox)
- Each will get a different user ID
- Start sharing in both
- Both should see each other's locations

## Common Issues

### Issue: "Cannot find module firebase"
**Solution:** Run `npm install firebase`

### Issue: No location on web
**Solution:** 
- Web browsers use IP-based geolocation (less accurate)
- Grant location permission when browser asks
- May not work on localhost - try actual IP address

### Issue: Firebase errors
**Solution:**
- Check .env file has correct Firebase credentials
- Verify Firebase Realtime Database is enabled
- Check Firebase rules allow read/write

### Issue: Location not updating
**Solution:**
- Check console for interval messages
- Verify location permissions granted
- Check if interval is being cleared accidentally

## Console Commands for Manual Testing

Open browser console and try:

```javascript
// Check if Firebase is connected
console.log('Firebase config:', process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL);

// Manually trigger location update
// (This won't work directly, but you can see the hook state)
```

## Expected Console Output (Full Flow)

```
=== EXPLORE SCREEN MOUNTED ===
Generated User ID: user_abc123xyz
=== useLocationSharing Hook Initialized ===
User ID: user_abc123xyz
Setting up Firebase listener for shared locations...
No shared locations in database

[User clicks "Start Sharing"]

=== TRACK LOCATION BUTTON PRESSED ===
Current isSharing state: false
User ID: user_abc123xyz
Current shared locations: {}
Starting location sharing...
=== START SHARING CALLED ===
Requesting location permissions...
Permission status: granted
Location sharing enabled
Getting initial location...
Initial location: { latitude: 10.31099, longitude: 123.92085 }
Writing initial location to Firebase: {
  userId: "user_abc123xyz",
  latitude: 10.31099,
  longitude: 123.92085,
  timestamp: 1234567890,
  isSharing: true
}
Initial location written successfully
Setting up location update interval (10s)
Location sharing started successfully

[After 10 seconds]

--- Location Update Interval Triggered ---
Updating location: {...}
Location updated successfully

[Firebase listener receives data]

Firebase data received: { user_abc123xyz: {...} }
Location user_abc123xyz: isSharing=true, age=2s
Active locations count: 1
Active locations: { user_abc123xyz: {...} }
=== CebuMap Rendered ===
Shared locations received: { user_abc123xyz: {...} }
Number of shared locations: 1
Rendering marker for user user_abc123xyz: {...}
```

## Tips

1. Keep console open at all times
2. Filter console by "===" to see major events
3. Use browser's Network tab to see Firebase requests
4. Check Firebase Console to see data in real-time
5. Test with incognito window for second user simulation
