# 🚀 Google Sign-In Setup - What You Need to Do

## ✅ What's Already Done (By Me)

1. ✅ Installed `@react-native-google-signin/google-signin` package
2. ✅ Updated `useAuth.ts` with Google Sign-In SDK integration
3. ✅ Added mobile-specific Google Sign-In flow
4. ✅ Re-enabled Google button in auth screen
5. ✅ Created `.env.example` template
6. ✅ Created comprehensive setup guide (`GOOGLE_SIGNIN_SETUP.md`)
7. ✅ Fixed all import errors

---

## 📝 What You Need to Do (5 Steps)

### Step 1: Get Web Client ID
1. Go to https://console.firebase.google.com
2. Select your ForDaGoo project
3. Click **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Copy the **Web client ID** (looks like: `123456-abc.apps.googleusercontent.com`)

---

### Step 2: Generate SHA-1 Certificate
Open terminal in your project folder and run:

```bash
cd android
./gradlew signingReport
```

Look for the **SHA1** line in the output (looks like: `AA:BB:CC:DD:...`)

---

### Step 3: Add SHA-1 to Firebase
1. Go to Firebase Console → **Project Settings**
2. Scroll to **Your apps** section
3. Find your Android app
4. Click **Add fingerprint**
5. Paste your SHA-1
6. Click **Save**

---

### Step 4: Download & Place google-services.json
1. Download the updated `google-services.json` from Firebase
2. Place it in **TWO** locations:
   - Project root: `google-services.json`
   - Android folder: `android/app/google-services.json`

**Quick copy command:**
```bash
# Windows
copy google-services.json android\app\google-services.json

# Mac/Linux
cp google-services.json android/app/google-services.json
```

---

### Step 5: Create .env File
1. Copy the template:
   ```bash
   copy .env.example .env
   ```

2. Open `.env` and add your Web Client ID:
   ```env
   EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com
   ```

3. Replace `YOUR_WEB_CLIENT_ID_HERE` with the actual ID from Step 1

---

## 🏗️ Step 6: Rebuild the App

```bash
eas build --platform android --profile preview
```

Wait for the build to complete, then download and install the new APK on your device.

---

## ✅ Testing

1. Open the app
2. Click **Google** button
3. Select your Google account
4. You should be logged in!

---

## 🐛 Common Issues

### "Developer Error" or "Error 10"
- **Fix:** Make sure SHA-1 is added to Firebase and you downloaded the updated `google-services.json`

### "Sign in failed"
- **Fix:** Check that Web Client ID in `.env` is correct

### "Platform is not defined"
- **Fix:** This was already fixed! Just rebuild the app.

### Button doesn't work
- **Fix:** Make sure you rebuilt the app after creating `.env` file

---

## 📁 Files You Need

- ✅ `.env` (create from `.env.example`)
- ✅ `google-services.json` (download from Firebase)
- ✅ `android/app/google-services.json` (copy from root)

---

## 🔒 Security Reminder

**NEVER commit these files to Git:**
- ❌ `.env`
- ❌ `google-services.json`

They contain sensitive keys!

---

## 📚 Full Documentation

For detailed explanations, see: `GOOGLE_SIGNIN_SETUP.md`

---

## 🎉 That's It!

Once you complete these 6 steps, Google Sign-In will work perfectly on your mobile app, just like it does on web!

**Need help?** Check the troubleshooting section in `GOOGLE_SIGNIN_SETUP.md`
