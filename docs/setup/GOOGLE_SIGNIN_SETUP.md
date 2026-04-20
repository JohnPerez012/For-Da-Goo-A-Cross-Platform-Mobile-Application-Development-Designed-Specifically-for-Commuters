# Google Sign-In Setup Guide for Mobile

This guide will help you configure Google Sign-In for your ForDaGoo mobile app.

---

## ⚡ Quick Start (5 Steps)

1. **Get Web Client ID** from Firebase Console → Authentication → Google provider
2. **Generate SHA-1** certificate: `cd android && ./gradlew signingReport`
3. **Add SHA-1** to Firebase Console → Project Settings → Your Android app
4. **Download** updated `google-services.json` and place in project root + `android/app/`
5. **Create `.env`** file with your Web Client ID, then rebuild: `eas build --platform android --profile preview`

---

## 📋 Prerequisites

- Firebase project already set up
- Android app registered in Firebase
- `google-services.json` file downloaded

---

## 🔧 Step 1: Get Your Web Client ID

### 1.1 Go to Firebase Console
1. Open https://console.firebase.google.com
2. Select your **ForDaGoo** project
3. Click **Authentication** in the left sidebar
4. Click **Sign-in method** tab
5. Find **Google** in the providers list

### 1.2 Enable Google Sign-In (if not already enabled)
1. Click on **Google**
2. Toggle **Enable** switch
3. Enter your **Project support email**
4. Click **Save**

### 1.3 Get the Web Client ID
1. In the Google provider settings, you'll see **Web SDK configuration**
2. Copy the **Web client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
3. Keep this for Step 3

**Screenshot location:** It's in the expanded Google provider section, labeled "Web SDK configuration"

---

## 🔑 Step 2: Add SHA-1 Certificate to Firebase

### 2.1 Generate Debug SHA-1 (for testing)

**On Windows:**
```bash
cd android
./gradlew signingReport
```

**On Mac/Linux:**
```bash
cd android
./gradlew signingReport
```

### 2.2 Find Your SHA-1
Look for output like this:
```
Variant: debug
Config: debug
Store: C:\Users\YourName\.android\debug.keystore
Alias: androiddebugkey
MD5: XX:XX:XX:...
SHA1: AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:00:AA:BB:CC:DD
SHA-256: ...
```

Copy the **SHA1** value (the long string with colons)

### 2.3 Add SHA-1 to Firebase
1. Go to Firebase Console > Project Settings
2. Scroll down to **Your apps** section
3. Find your Android app
4. Click **Add fingerprint**
5. Paste your SHA-1
6. Click **Save**

### 2.4 Download Updated google-services.json
1. After adding SHA-1, download the updated `google-services.json`
2. **CRITICAL:** Place the file in TWO locations:
   - Project root: `google-services.json`
   - Android app folder: `android/app/google-services.json`
3. You can copy it with this command:
   ```bash
   # Windows
   copy google-services.json android\app\google-services.json
   
   # Mac/Linux
   cp google-services.json android/app/google-services.json
   ```

---

## 📝 Step 3: Configure Environment Variables

### 3.1 Create .env File
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Web Client ID:
   ```env
   EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com
   ```

3. Replace `YOUR_WEB_CLIENT_ID_HERE` with the actual Web Client ID from Step 1.3

### 3.2 Example .env File
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyAbc123...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=fordagoo-12345.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=fordagoo-12345
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=fordagoo-12345.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:android:abc123
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://fordagoo-12345.firebasedatabase.app
EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

---

## 🏗️ Step 4: Build the App

### 4.1 Clean Build
```bash
# Clear cache
npx expo start -c

# Or rebuild with EAS
eas build --platform android --profile preview
```

### 4.2 Install on Device
1. Download the new APK
2. Install on your Android device
3. Test Google Sign-In

---

## ✅ Step 5: Test Google Sign-In

### 5.1 Test Flow
1. Open the app
2. Click **Google** button
3. Select your Google account
4. Grant permissions
5. You should be logged in!

### 5.2 Expected Behavior
- ✅ Google account picker appears
- ✅ After selection, you're logged in
- ✅ Profile picture and name are displayed
- ✅ User data is saved to Firestore

---

## 🐛 Troubleshooting

### Error: "Developer Error" or "Error 10"
**Cause:** SHA-1 certificate not added to Firebase

**Solution:**
1. Generate SHA-1 again: `cd android && ./gradlew signingReport`
2. Add to Firebase Console
3. Download updated `google-services.json`
4. Rebuild the app

---

### Error: "Sign in failed"
**Cause:** Wrong Web Client ID

**Solution:**
1. Double-check Web Client ID in `.env`
2. Make sure it ends with `.apps.googleusercontent.com`
3. Restart the app

---

### Error: "Network error"
**Cause:** Device not connected to internet

**Solution:**
1. Check internet connection
2. Try again

---

### Error: "Play Services not available"
**Cause:** Testing on emulator without Google Play Services

**Solution:**
1. Use a real Android device
2. Or use an emulator with Google Play Services installed

---

## 🔒 Security Notes

### Never Commit These Files:
- ❌ `.env` (contains your actual keys)
- ❌ `google-services.json` (contains sensitive data)

### Always Commit These Files:
- ✅ `.env.example` (template without real keys)
- ✅ `google-services.json.example` (template)

---

## 📱 For Production Release

### 1. Generate Release SHA-1
```bash
keytool -list -v -keystore your-release-key.keystore -alias your-key-alias
```

### 2. Add Release SHA-1 to Firebase
- Follow same steps as debug SHA-1
- Add the release SHA-1 fingerprint

### 3. Update google-services.json
- Download the updated file
- Include in your production build

---

## 🎯 Quick Checklist

Before testing, make sure:
- [ ] Google Sign-In enabled in Firebase Console
- [ ] Web Client ID copied from Firebase
- [ ] SHA-1 certificate generated and added to Firebase
- [ ] Updated `google-services.json` downloaded and placed in:
  - [ ] Project root folder
  - [ ] `android/app/` folder
- [ ] `.env` file created with Web Client ID (copy from `.env.example`)
- [ ] App rebuilt with new configuration: `eas build --platform android --profile preview`
- [ ] New APK installed on real device (not emulator)

---

## 📞 Need Help?

### Check These:
1. Firebase Console > Authentication > Sign-in method > Google (should be enabled)
2. Firebase Console > Project Settings > Your apps > Android app (SHA-1 should be listed)
3. `.env` file (Web Client ID should be present)
4. `google-services.json` (should be in project root and `android/app/`)

### Common Issues:
- **"Developer Error"** → Add SHA-1 to Firebase
- **"Sign in failed"** → Check Web Client ID
- **"Network error"** → Check internet connection
- **Button doesn't work** → Rebuild the app

---

## 🎉 Success!

Once configured correctly, users can:
- ✅ Sign in with their Google account
- ✅ See their Google profile picture
- ✅ Have their name auto-filled
- ✅ Link guest accounts to Google
- ✅ Sign in on any device with the same account

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-19  
**For:** ForDaGoo Mobile App

---

## 📚 Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Google Sign-In for Android](https://developers.google.com/identity/sign-in/android/start)
- [React Native Google Sign-In](https://github.com/react-native-google-signin/google-signin)
- [Expo Authentication Guide](https://docs.expo.dev/guides/authentication/)

Good luck! 🚀
