# ForDaGoo - Project Folder Structure Documentation

## 📁 Complete Directory Overview

This document explains every folder and file in the ForDaGoo project. Even if you've never seen the code, you'll understand what everything does.

---

## 🌳 Root Directory Structure

```
fordagoo/
├── 📱 app/                    # Main application screens
├── 🎨 assets/                 # Images, icons, fonts
├── 🧩 components/             # Reusable UI components
├── ⚙️ config/                 # Configuration files
├── 🎯 constants/              # App-wide constants
├── 🪝 hooks/                  # Custom React hooks
├── 📜 scripts/                # Utility scripts
├── 🌐 web/                    # Web-specific files
├── 📦 node_modules/           # Dependencies (auto-generated)
├── 🔥 Firebase files          # Firebase configuration
├── 📋 Configuration files     # Project setup files
└── 📖 Documentation files     # README, guides, etc.
```

---

## 📱 `/app` - Application Screens

**Purpose:** Contains all the screens/pages of your app using Expo Router's file-based routing.

```
app/
├── (tabs)/                    # Tab navigation screens
│   ├── explore.tsx           # 🗺️ Map screen (mobile)
│   ├── explore.web.tsx       # 🗺️ Map screen (web version)
│   ├── profile.tsx           # 👤 User profile (mobile)
│   ├── profile.web.tsx       # 👤 User profile (web version)
│   ├── _layout.tsx           # Tab bar layout (mobile)
│   └── _layout.web.tsx       # Tab bar layout (web)
│
├── auth.tsx                  # 🔐 Login/signup screen
├── index.tsx                 # 🏠 Landing/splash screen
├── modal.tsx                 # 📋 Example modal screen
└── _layout.tsx               # 🎯 Root layout (navigation setup)
```

### Key Files Explained:

**`auth.tsx`**
- Login screen with email, Google, and guest options
- Sign up form with role selection (Student/Driver)
- Terms & conditions modal

**`explore.tsx` / `explore.web.tsx`**
- Main map screen showing bus locations
- Route selection dropdown
- Start/stop location sharing button
- Real-time location updates

**`profile.tsx` / `profile.web.tsx`**
- User profile information
- Account linking for guest users
- Logout functionality
- App information

**`_layout.tsx`**
- Sets up navigation structure
- Handles authentication state
- Redirects unauthenticated users to login

---

## 🎨 `/assets` - Media Files

**Purpose:** Stores all images, icons, and static assets.

```
assets/
└── images/
    ├── fordagoo.png                    # 🚌 App logo
    ├── icon.png                        # 📱 App icon (general)
    ├── splash-icon.png                 # 🌟 Splash screen icon
    ├── favicon.png                     # 🌐 Website favicon
    ├── default_System_Profile.jpg      # 👤 Default profile picture
    │
    ├── android-icon-background.png     # 🤖 Android adaptive icon (background)
    ├── android-icon-foreground.png     # 🤖 Android adaptive icon (foreground)
    ├── android-icon-monochrome.png     # 🤖 Android monochrome icon
    │
    └── react-logo*.png                 # ⚛️ React logos (example assets)
```

### When to Use:

- **fordagoo.png**: Main app branding
- **default_System_Profile.jpg**: When user has no profile picture
- **Android icons**: For Android app installation
- **favicon.png**: For web browser tab icon

---

## 🧩 `/components` - Reusable UI Components

**Purpose:** Shared components used across multiple screens.

```
components/
├── icons/                           # Custom icon components
│   ├── driver-icon.tsx             # 🚗 Driver role icon
│   ├── student-icon.tsx            # 🎓 Student role icon
│   ├── location-icon.tsx           # 📍 Location pin icon
│   ├── logout-icon.tsx             # 🚪 Logout icon
│   ├── eye-icon.tsx                # 👁️ Show/hide password icon
│   └── index.tsx                   # Export all icons
│
├── ui/                              # UI utility components
│   └── collapsible.tsx             # Expandable/collapsible section
│
├── cebu-map.tsx                    # 🗺️ Map component (mobile)
├── cebu-map.web.tsx                # 🗺️ Map component (web - Leaflet)
├── custom-tab-bar.tsx              # 📊 Custom bottom tab bar
├── profile-icon.tsx                # 👤 Profile avatar component
├── themed-text.tsx                 # 📝 Text with theme support
├── themed-view.tsx                 # 📦 View with theme support
├── toast.tsx                       # 🔔 Toast notification component
├── external-link.tsx               # 🔗 External link component
├── haptic-tab.tsx                  # 📳 Tab with haptic feedback
├── hello-wave.tsx                  # 👋 Animated wave component
└── parallax-scroll-view.tsx        # 📜 Parallax scrolling view
```

### Key Components:

**`cebu-map.tsx` / `cebu-map.web.tsx`**
- Displays the map with routes
- Shows user location markers
- Handles route selection
- Different implementations for mobile (React Native Maps) and web (Leaflet)

**`toast.tsx`**
- Shows temporary notifications
- Success, error, and info messages
- Auto-dismisses after 3 seconds

**`themed-text.tsx` / `themed-view.tsx`**
- Automatically adapts to light/dark theme
- Consistent styling across the app

**`icons/`**
- Custom SVG icons as React components
- Scalable and customizable
- Used throughout the app

---

## ⚙️ `/config` - Configuration Files

**Purpose:** App configuration and service initialization.

```
config/
└── firebase.ts                     # 🔥 Firebase initialization
```

### `firebase.ts` Explained:

```typescript
// Initializes Firebase services:
- Authentication (for login/signup)
- Firestore (for user data storage)
- Realtime Database (for location/presence tracking)

// Exports:
- auth: Firebase Authentication instance
- firestore: Firestore database instance
- database: Realtime Database instance
```

**Important:** This file reads from `.env` for API keys (never commit `.env` to Git!)

---

## 🎯 `/constants` - App Constants

**Purpose:** Stores values that don't change throughout the app.

```
constants/
└── theme.ts                        # 🎨 Color scheme and styling
```

### `theme.ts` Contains:

- Color palette (primary, secondary, background colors)
- Font sizes and weights
- Spacing values
- Border radius values
- Shadow styles

**Why separate?** Easy to update app-wide styling in one place.

---

## 🪝 `/hooks` - Custom React Hooks

**Purpose:** Reusable logic that can be shared across components.

```
hooks/
├── useAuth.ts                      # 🔐 Authentication logic
├── use-location-sharing.ts         # 📍 Location sharing logic
├── use-user-presence.ts            # 👥 Online/offline status
├── use-color-scheme.ts             # 🎨 Theme detection (mobile)
├── use-color-scheme.web.ts         # 🎨 Theme detection (web)
└── use-theme-color.ts              # 🌈 Theme color management
```

### Key Hooks Explained:

**`useAuth.ts`** - Authentication Management
```typescript
// Provides:
- user: Current logged-in user info
- isLoading: Loading state
- signUpWithEmail(): Create account with email
- signInWithEmail(): Login with email
- signInAnonymous(): Login as guest
- signInWithGoogle(): Login with Google
- signOut(): Logout
- linkWithEmail(): Convert guest to registered user
```

**`use-location-sharing.ts`** - GPS Location Tracking
```typescript
// Provides:
- isSharing: Whether user is sharing location
- sharedLocations: All users currently sharing
- startSharing(): Start broadcasting GPS location
- stopSharing(): Stop broadcasting
- error: Any error messages

// Updates location every 10 seconds
// Removes location when user stops sharing
```

**`use-user-presence.ts`** - Online Status
```typescript
// Provides:
- onlineUsers: List of users currently online

// Automatically:
- Sets user as "online" when logged in
- Updates status every 30 seconds (heartbeat)
- Removes user when they logout or disconnect
- Shows who's online in the app
```

**`use-color-scheme.ts`** - Theme Detection
```typescript
// Detects if user prefers light or dark mode
// Returns: 'light' | 'dark'
// Automatically updates when system theme changes
```

---

## 📜 `/scripts` - Utility Scripts

**Purpose:** Helper scripts for development and testing.

```
scripts/
├── check-tunnel.js                 # 🌐 Check Expo tunnel connection
├── reset-project.js                # 🔄 Reset project to clean state
└── test-firebase.js                # 🔥 Test Firebase connection
```

### When to Use:

**`check-tunnel.js`**
- Run when Expo tunnel isn't working
- Checks network connectivity

**`reset-project.js`**
- Clears cache and temporary files
- Useful when app behaves strangely

**`test-firebase.js`**
- Verifies Firebase is configured correctly
- Tests database connection

---

## 🌐 `/web` - Web Build Output

**Purpose:** Generated files for web deployment (auto-created by Expo).

```
web/
└── entry-*.js                      # Bundled JavaScript for web
```

**Note:** This folder is auto-generated. Don't edit manually!

---

## 🔥 Firebase Configuration Files

```
├── .firebaserc                     # Firebase project ID
├── firebase.json                   # Firebase hosting config
├── firestore.rules                 # Firestore security rules
├── firestore.indexes.json          # Firestore database indexes
├── database.rules.json             # Realtime Database security rules
└── google-services.json.example    # Android Firebase config (example)
```

### Key Files:

**`database.rules.json`** - Who Can Access What
```json
{
  "presence": {
    ".read": true,              // Anyone can see who's online
    "$userId": {
      ".write": "$userId === auth.uid"  // Only you can update your status
    }
  },
  "sharedLocations": {
    ".read": true,              // Anyone can see locations
    "$userId": {
      ".write": "$userId === auth.uid"  // Only you can update your location
    }
  }
}
```

**`firestore.rules`** - User Data Security
```
- Anyone can read user profiles
- Only you can edit your own profile
- All other data is denied by default
```

---

## 📋 Configuration Files (Root)

```
├── .env.example                    # Environment variables template
├── .gitignore                      # Files to ignore in Git
├── app.json                        # Expo app configuration
├── eas.json                        # EAS Build configuration
├── expo-env.d.ts                   # TypeScript definitions
├── eslint.config.js                # Code linting rules
├── package.json                    # Dependencies and scripts
├── package-lock.json               # Locked dependency versions
└── tsconfig.json                   # TypeScript configuration
```

### Important Files:

**`app.json`** - App Metadata
```json
{
  "name": "ForDaGoo",              // App name
  "version": "1.0.0",              // Version number
  "icon": "./assets/images/...",   // App icon path
  "android": { ... },              // Android-specific config
  "ios": { ... },                  // iOS-specific config
  "web": { ... }                   // Web-specific config
}
```

**`package.json`** - Dependencies
```json
{
  "dependencies": {
    "expo": "~54.0.33",            // Expo framework
    "firebase": "^12.10.0",        // Firebase SDK
    "react": "19.1.0",             // React library
    "react-native-maps": "1.20.1", // Maps for mobile
    // ... and more
  },
  "scripts": {
    "start": "expo start",         // Start development server
    "android": "expo start --android",  // Run on Android
    "web": "expo start --web"      // Run on web
  }
}
```

**`eas.json`** - Build Configuration
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"         // Build APK for testing
      }
    },
    "production": {
      "autoIncrement": true        // Auto-increment version
    }
  }
}
```

**`.env.example`** - Environment Variables Template
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain_here
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
# ... more Firebase config
```

**To use:** Copy to `.env` and fill in your actual values.

---

## 📖 Documentation Files

```
├── README.md                       # Project overview
├── FIREBASE_SETUP_GUIDE.md        # Firebase setup instructions
├── TESTING_GUIDE.md               # How to test the app
├── TECHNICAL_DOCUMENTATION.md     # Technical details (this doc!)
├── FLOWCHART_DESCRIPTIONS.md      # Flowchart descriptions
├── MERMAID_FLOWCHARTS.md          # Mermaid flowchart code
└── FOLDER_STRUCTURE.md            # This file!
```

---

## 🚀 Quick Reference: What Goes Where?

### Adding a New Screen?
→ Put it in `/app/`

### Adding a New Component?
→ Put it in `/components/`

### Adding a New Hook?
→ Put it in `/hooks/`

### Adding Images/Icons?
→ Put them in `/assets/images/`

### Changing Colors/Styles?
→ Edit `/constants/theme.ts`

### Changing Firebase Rules?
→ Edit `database.rules.json` or `firestore.rules`

### Adding a New Dependency?
→ Run `npm install package-name` (updates `package.json`)

---

## 🔍 File Naming Conventions

### Screens (in `/app/`)
- `screen-name.tsx` - Mobile version
- `screen-name.web.tsx` - Web version
- `_layout.tsx` - Layout/navigation file

### Components (in `/components/`)
- `component-name.tsx` - Kebab-case
- `ComponentName.tsx` - PascalCase (for class components)

### Hooks (in `/hooks/`)
- `use-hook-name.ts` - Always start with "use"
- `use-hook-name.web.ts` - Web-specific version

### Constants (in `/constants/`)
- `constant-name.ts` - Lowercase with hyphens

---

## 📊 File Size Guidelines

| Type | Typical Size | Max Recommended |
|------|-------------|-----------------|
| Screen | 200-500 lines | 800 lines |
| Component | 50-200 lines | 400 lines |
| Hook | 100-300 lines | 500 lines |
| Config | 20-50 lines | 100 lines |

**If a file is too large:** Consider splitting into smaller components or hooks.

---

## 🎯 Common Tasks

### 1. Add a New Screen
```
1. Create file in /app/
2. Export default function
3. Add to navigation in _layout.tsx
```

### 2. Add a New Component
```
1. Create file in /components/
2. Export component
3. Import where needed
```

### 3. Add a New Hook
```
1. Create file in /hooks/
2. Name it use-something.ts
3. Export the hook function
```

### 4. Update Firebase Rules
```
1. Edit database.rules.json or firestore.rules
2. Run: firebase deploy --only database
   or: firebase deploy --only firestore
```

### 5. Add Environment Variable
```
1. Add to .env file
2. Prefix with EXPO_PUBLIC_
3. Access via process.env.EXPO_PUBLIC_VAR_NAME
```

---

## 🔒 Security Notes

### Never Commit These Files:
- `.env` (contains API keys)
- `google-services.json` (Android Firebase config)
- `node_modules/` (too large, auto-generated)
- `.expo/` (temporary files)

### Always Commit These Files:
- `.env.example` (template without real keys)
- `google-services.json.example` (template)
- All source code files
- Configuration files

---

## 🐛 Troubleshooting

### "Module not found" error?
→ Check if file path is correct
→ Run `npm install` to install dependencies

### "Permission denied" in Firebase?
→ Check `database.rules.json` or `firestore.rules`
→ Make sure user is authenticated

### App won't start?
→ Run `npm install` to update dependencies
→ Clear cache: `npx expo start -c`

### Changes not showing?
→ Reload app (shake device → Reload)
→ Clear cache and restart

---

## 📚 Learning Resources

### To Understand:
- **React**: https://react.dev
- **React Native**: https://reactnative.dev
- **Expo**: https://docs.expo.dev
- **Firebase**: https://firebase.google.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

### To Learn More About:
- **Expo Router**: https://docs.expo.dev/router/introduction/
- **React Native Maps**: https://github.com/react-native-maps/react-native-maps
- **Firebase Auth**: https://firebase.google.com/docs/auth
- **Firestore**: https://firebase.google.com/docs/firestore

---

## 🎓 For New Developers

### Start Here:
1. Read `README.md` - Project overview
2. Read this file - Understand structure
3. Read `FIREBASE_SETUP_GUIDE.md` - Set up Firebase
4. Run `npm install` - Install dependencies
5. Run `npm start` - Start the app
6. Explore `/app/auth.tsx` - See how login works
7. Explore `/app/(tabs)/explore.tsx` - See the main screen

### Then:
- Modify a component to see changes
- Add a new screen
- Create a custom hook
- Read the technical documentation

---

## 📞 Need Help?

### Check These First:
1. This documentation
2. `TECHNICAL_DOCUMENTATION.md`
3. Code comments in files
4. Console error messages

### Still Stuck?
- Check the GitHub issues
- Ask the development team
- Review Firebase console for errors

---

## ✅ Checklist for New Features

Before adding a new feature:
- [ ] Understand the folder structure
- [ ] Know where to put new files
- [ ] Follow naming conventions
- [ ] Add comments to complex code
- [ ] Test on both mobile and web
- [ ] Update documentation if needed
- [ ] Check Firebase rules if using database

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-19  
**Maintained By:** ForDaGoo Development Team

---

## 🎉 You're Ready!

You now understand the complete folder structure of ForDaGoo. Whether you're a developer, designer, or project manager, you know where everything is and what it does.

Happy coding! 🚀
