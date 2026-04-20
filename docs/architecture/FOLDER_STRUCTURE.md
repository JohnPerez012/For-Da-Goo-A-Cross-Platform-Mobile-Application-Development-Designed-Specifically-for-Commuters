# 📁 For-Da-Goo Folder Structure Guide

**Professional Documentation for Panel Defense**

This document provides a comprehensive explanation of the project's folder structure, designed for easy understanding during panel presentations and code reviews.

---

## 🎯 Overview

The For-Da-Goo project follows a **modular, feature-based architecture** with clear separation of concerns. The structure is organized to support:
- Cross-platform development (Mobile & Web)
- Scalability and maintainability
- Easy navigation for new developers
- Professional presentation standards

---

## 📊 High-Level Structure

```
For-Da-Goo/
├── 📱 Application Layer (app/)
├── 🎨 Presentation Layer (components/, assets/)
├── 🧠 Business Logic Layer (hooks/, config/)
├── 📚 Documentation Layer (docs/)
├── 🔧 Utility Layer (scripts/, constants/)
└── ⚙️ Configuration Layer (root config files)
```

---

## 📱 1. APPLICATION LAYER (`app/`)

**Purpose**: Contains all application screens and routing logic using Expo Router's file-based routing system.

### Structure
```
app/
├── (tabs)/                    # Tab-based navigation group
│   ├── explore.tsx            # Map screen for mobile
│   ├── explore.web.tsx        # Map screen for web
│   ├── profile.tsx            # Profile screen for mobile
│   ├── profile.web.tsx        # Profile screen for web
│   ├── _layout.tsx            # Tab navigation configuration
│   └── _layout.web.tsx        # Web-specific tab layout
├── auth.tsx                   # Authentication/Login screen
├── index.tsx                  # App entry point (splash/redirect)
├── modal.tsx                  # Modal screens
└── _layout.tsx                # Root layout (navigation container)
```

### Key Concepts

**File-Based Routing**
- File names become routes automatically
- `explore.tsx` → `/explore` route
- `(tabs)/` → Grouped routes with shared layout

**Platform-Specific Files**
- `.tsx` → Mobile (React Native)
- `.web.tsx` → Web (React Native Web)
- Allows different implementations per platform

**Layout Files (`_layout.tsx`)**
- Define navigation structure
- Configure tab bars, headers, and navigation options
- Wrap child screens with shared UI

### Panel Defense Points
✅ **Separation of Concerns**: Each screen has a single responsibility  
✅ **Platform Optimization**: Different implementations for mobile/web  
✅ **Scalability**: Easy to add new screens by creating new files  
✅ **Type Safety**: TypeScript ensures correct navigation types

---

## 🎨 2. PRESENTATION LAYER

### 2.1 Components (`components/`)

**Purpose**: Reusable UI components used across multiple screens.

```
components/
├── icons/                     # Custom icon components
│   ├── driver-icon.tsx        # Driver role icon
│   ├── student-icon.tsx       # Student role icon
│   ├── location-icon.tsx      # Location marker icon
│   ├── logout-icon.tsx        # Logout button icon
│   ├── eye-icon.tsx           # Visibility toggle icon
│   └── index.tsx              # Icon exports
│
├── ui/                        # Base UI components
│   ├── collapsible.tsx        # Collapsible sections
│   └── [other UI components]
│
├── cebu-map.tsx               # Map component (mobile)
├── cebu-map.web.tsx           # Map component (web)
├── custom-tab-bar.tsx         # Custom tab navigation bar
├── profile-icon.tsx           # User profile avatar
├── toast.tsx                  # Toast notifications
├── external-link.tsx          # External link handler
├── haptic-tab.tsx             # Tab with haptic feedback
├── hello-wave.tsx             # Animated wave component
├── parallax-scroll-view.tsx   # Parallax scrolling
├── themed-text.tsx            # Theme-aware text
└── themed-view.tsx            # Theme-aware container
```

### Component Categories

**1. Icon Components** (`icons/`)
- SVG-based custom icons
- Consistent sizing and styling
- Role-specific visual indicators

**2. Map Components**
- `cebu-map.tsx`: Uses React Native Maps (mobile)
- `cebu-map.web.tsx`: Uses React Leaflet (web)
- Displays user locations with custom markers
- Real-time position updates

**3. UI Components**
- Reusable across multiple screens
- Theme-aware (light/dark mode support)
- Accessible and responsive

### Panel Defense Points
✅ **Reusability**: Components used in multiple screens  
✅ **Consistency**: Unified design language  
✅ **Platform Adaptation**: Different map libraries per platform  
✅ **Maintainability**: Changes in one place affect all usages

---

### 2.2 Assets (`assets/`)

**Purpose**: Static files like images, fonts, and icons.

```
assets/
└── images/
    ├── fordagoo.png                    # App logo
    ├── default_System_Profile.jpg      # Default profile picture
    ├── adaptive-icon.png               # Android adaptive icon
    ├── icon.png                        # App icon
    ├── splash-icon.png                 # Splash screen icon
    ├── android-adaptive-background.png # Android background
    └── android-adaptive-foreground.png # Android foreground
```

### Asset Management
- **Optimized Images**: Compressed for performance
- **Multiple Resolutions**: Support for various screen densities
- **Platform-Specific**: Android adaptive icons

---

## 🧠 3. BUSINESS LOGIC LAYER

### 3.1 Hooks (`hooks/`)

**Purpose**: Custom React hooks containing business logic and state management.

```
hooks/
├── useAuth.ts                 # Authentication logic
├── use-location-sharing.ts    # Location sharing logic
├── use-user-presence.ts       # User presence tracking
├── use-color-scheme.ts        # Theme management
├── use-color-scheme.web.ts    # Web-specific theme
└── use-theme-color.ts         # Color utilities
```

### Hook Descriptions

**`useAuth.ts`** - Authentication Management
- Google Sign-In (mobile & web)
- Guest login
- Account linking (guest → permanent)
- Logout with cleanup
- User state management

**`use-location-sharing.ts`** - Location Sharing
- GPS location tracking (every 10 seconds)
- Share location to Firebase Realtime Database
- Fetch other users' locations
- Filter active locations (< 5 minutes old)
- Privacy controls (toggle sharing on/off)

**`use-user-presence.ts`** - Presence System
- Online/offline status tracking
- Heartbeat updates (every 30 seconds)
- Automatic cleanup on disconnect
- Filter online users (< 2 minutes since last seen)

**`use-color-scheme.ts`** - Theme Management
- Light/dark mode detection
- System theme synchronization
- Theme persistence

### Panel Defense Points
✅ **Separation of Logic**: Business logic separated from UI  
✅ **Reusability**: Hooks used across multiple components  
✅ **Testability**: Logic can be tested independently  
✅ **Real-Time Sync**: Firebase integration for live updates

---

### 3.2 Configuration (`config/`)

**Purpose**: Application configuration and third-party service initialization.

```
config/
└── firebase.ts                # Firebase initialization
```

**`firebase.ts`** - Firebase Setup
- Initialize Firebase app
- Configure Realtime Database
- Configure Authentication
- Configure Firestore
- Export Firebase instances

---

## 📚 4. DOCUMENTATION LAYER (`docs/`)

**Purpose**: Professional documentation for development, setup, and presentation.

```
docs/
├── architecture/              # Architecture documentation
│   └── FOLDER_STRUCTURE.md    # This file
│
├── setup/                     # Setup and configuration guides
│   ├── GOOGLE_SIGNIN_SETUP.md # Google Sign-In configuration
│   ├── SETUP_SUMMARY.md       # Quick setup checklist
│   ├── GOOGLE_SIGNIN_CHECKLIST.txt
│   ├── GET_WEB_CLIENT_ID.txt
│   └── YOUR_SHA1_CERTIFICATE.txt
│
└── technical/                 # Technical documentation
    └── TECHNICAL_DOCUMENTATION.md  # System architecture & flowcharts
```

### Documentation Categories

**Architecture Documentation**
- Folder structure explanation
- Design patterns used
- Code organization principles

**Setup Documentation**
- Step-by-step setup guides
- Configuration instructions
- Troubleshooting tips

**Technical Documentation**
- System architecture diagrams
- Data flow diagrams
- Authentication flow
- Mermaid flowcharts for presentations

### Panel Defense Points
✅ **Professional Presentation**: Well-organized documentation  
✅ **Easy Onboarding**: New developers can understand quickly  
✅ **Comprehensive**: Covers all aspects of the system  
✅ **Visual Aids**: Flowcharts and diagrams for clarity

---

## 🔧 5. UTILITY LAYER

### 5.1 Scripts (`scripts/`)

**Purpose**: Utility scripts for development and testing.

```
scripts/
├── reset-project.js           # Reset project to clean state
├── test-firebase.js           # Test Firebase connection
└── check-tunnel.js            # Check network tunnel status
```

### Script Purposes

**`reset-project.js`**
- Cleans build artifacts
- Resets to initial state
- Useful for troubleshooting

**`test-firebase.js`**
- Verifies Firebase connection
- Tests database read/write
- Validates configuration

**`check-tunnel.js`**
- Checks Expo tunnel status
- Network connectivity test

---

### 5.2 Constants (`constants/`)

**Purpose**: Application-wide constants and configuration values.

```
constants/
└── theme.ts                   # Theme colors and styles
```

**`theme.ts`** - Theme Configuration
- Color palette
- Typography settings
- Spacing values
- Consistent design tokens

---

## ⚙️ 6. CONFIGURATION LAYER (Root Files)

### Firebase Configuration

```
├── firebase.json              # Firebase project configuration
├── .firebaserc                # Firebase project aliases
├── database.rules.json        # Realtime Database security rules
├── firestore.rules            # Firestore security rules
└── firestore.indexes.json     # Firestore query indexes
```

**Security Rules** (`database.rules.json`)
```json
{
  "rules": {
    "sharedLocations": {
      ".read": true,
      "$userId": {
        ".write": "$userId === auth.uid"
      }
    },
    "presence": {
      ".read": true,
      "$userId": {
        ".write": "$userId === auth.uid"
      }
    }
  }
}
```

### Build Configuration

```
├── app.json                   # Expo app configuration
├── eas.json                   # EAS Build profiles
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── eslint.config.js           # Code linting rules
```

**`app.json`** - Expo Configuration
- App name, version, and metadata
- Platform-specific settings
- Permissions and capabilities
- Splash screen and icons

**`eas.json`** - Build Profiles
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

**`package.json`** - Dependencies
- React Native and Expo packages
- Firebase SDK
- Map libraries (react-native-maps, react-leaflet)
- Navigation libraries
- Build scripts

---

## 🔐 7. ENVIRONMENT & SECRETS (Not in Repository)

```
├── .env                       # Environment variables
├── google-services.json       # Firebase Android config
└── .gitignore                 # Excluded files
```

**`.env`** - Environment Variables
```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_DATABASE_URL=...
EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID=...
```

**Security Note**: These files are excluded from Git for security.

---

## 🏗️ Architecture Patterns

### 1. **Layered Architecture**
```
Presentation Layer (UI)
        ↓
Business Logic Layer (Hooks)
        ↓
Data Layer (Firebase)
```

### 2. **Platform-Specific Implementation**
```
Component.tsx (Mobile)  →  React Native Components
Component.web.tsx (Web) →  React Native Web Components
```

### 3. **Custom Hooks Pattern**
- Encapsulate complex logic
- Reusable across components
- Testable independently

### 4. **Real-Time Data Flow**
```
User Action → Hook → Firebase → Real-Time Update → UI Update
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   User UI   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Custom Hook │ (useAuth, use-location-sharing, use-user-presence)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Firebase   │ (Realtime DB, Auth, Firestore)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Other Users │ (Real-time sync)
└─────────────┘
```

---

## 🎓 Panel Defense Key Points

### 1. **Professional Organization**
- Clear folder structure
- Logical grouping of files
- Easy to navigate and understand

### 2. **Scalability**
- Modular architecture
- Easy to add new features
- Separation of concerns

### 3. **Cross-Platform Support**
- Single codebase for mobile and web
- Platform-specific optimizations
- Consistent user experience

### 4. **Real-Time Capabilities**
- Firebase Realtime Database
- Automatic synchronization
- Low latency updates

### 5. **Security**
- Firebase security rules
- Environment variable protection
- Authentication and authorization

### 6. **Maintainability**
- TypeScript for type safety
- ESLint for code quality
- Comprehensive documentation

---

## 📝 File Naming Conventions

### Screens (app/)
- `kebab-case.tsx` for mobile
- `kebab-case.web.tsx` for web
- `_layout.tsx` for layouts

### Components (components/)
- `kebab-case.tsx` for components
- `PascalCase` for component names

### Hooks (hooks/)
- `use-kebab-case.ts` for hooks
- `useCamelCase` for hook names

### Configuration
- `lowercase.json` for config files
- `lowercase.ts` for TypeScript configs

---

## 🚀 Quick Navigation Guide

| Need to... | Go to... |
|------------|----------|
| Add a new screen | `app/` |
| Create a reusable component | `components/` |
| Add business logic | `hooks/` |
| Configure Firebase | `config/firebase.ts` |
| Update app settings | `app.json` |
| Modify security rules | `database.rules.json` |
| Read documentation | `docs/` |
| Run utility scripts | `scripts/` |

---

## 🎯 Summary

The For-Da-Goo project structure is designed with **professionalism, scalability, and maintainability** in mind. Each folder serves a specific purpose, and the organization follows industry best practices for React Native and Expo applications.

**Key Strengths**:
✅ Clear separation of concerns  
✅ Platform-specific optimizations  
✅ Comprehensive documentation  
✅ Real-time capabilities  
✅ Security-first approach  
✅ Easy to understand and navigate  

This structure demonstrates a **production-ready application** suitable for academic presentation and real-world deployment.

---

**Last Updated**: April 2026  
**For**: Panel Defense Presentation  
**Project**: For-Da-Goo - Public Transportation Tracking Application
