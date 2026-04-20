# ForDaGoo - Technical Documentation & System Flowcharts

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Authentication Flow](#authentication-flow)
3. [Location Sharing System](#location-sharing-system)
4. [User Presence System](#user-presence-system)
5. [Real-time Data Synchronization](#real-time-data-synchronization)
6. [Database Schema](#database-schema)
7. [Component Architecture](#component-architecture)
8. [State Management Flow](#state-management-flow)

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     ForDaGoo Application                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   Web App    │         │  Mobile App  │                  │
│  │  (React Web) │         │ (React Native)│                 │
│  └──────┬───────┘         └──────┬───────┘                  │
│         │                        │                           │
│         └────────────┬───────────┘                           │
│                      │                                       │
│         ┌────────────▼────────────┐                          │
│         │   Expo Router (v6)      │                          │
│         │   Navigation Layer      │                          │
│         └────────────┬────────────┘                          │
│                      │                                       │
│         ┌────────────▼────────────┐                          │
│         │   React Components      │                          │
│         │   - Auth Screen         │                          │
│         │   - Explore (Map)       │                          │
│         │   - Profile             │                          │
│         └────────────┬────────────┘                          │
│                      │                                       │
│         ┌────────────▼────────────┐                          │
│         │   Custom Hooks          │                          │
│         │   - useAuth             │                          │
│         │   - useLocationSharing  │                          │
│         │   - useUserPresence     │                          │
│         └────────────┬────────────┘                          │
│                      │                                       │
└──────────────────────┼───────────────────────────────────────┘
                       │
         ┌─────────────▼─────────────┐
         │   Firebase Services       │
         ├───────────────────────────┤
         │  • Authentication         │
         │  • Realtime Database      │
         │  • Firestore              │
         │  • Cloud Storage          │
         └───────────────────────────┘
```

---

## Authentication Flow

### 1. User Authentication Process

```
START
  │
  ▼
┌─────────────────┐
│  Auth Screen    │
│  Loads          │
└────────┬────────┘
         │
         ▼
    ┌────────┐
    │ User   │
    │ Choice │
    └───┬────┘
        │
        ├──────────────┬──────────────┬──────────────┐
        │              │              │              │
        ▼              ▼              ▼              ▼
   ┌────────┐    ┌─────────┐   ┌─────────┐   ┌──────────┐
   │ Email  │    │ Google  │   │  Guest  │   │  Sign Up │
   │ Login  │    │  Login  │   │  Login  │   │          │
   └───┬────┘    └────┬────┘   └────┬────┘   └────┬─────┘
       │              │              │              │
       ▼              ▼              ▼              ▼
   ┌────────────────────────────────────────────────────┐
   │         Firebase Authentication                    │
   │  • signInWithEmailAndPassword()                    │
   │  • signInWithPopup(GoogleAuthProvider)             │
   │  • signInAnonymously()                             │
   │  • createUserWithEmailAndPassword()                │
   └────────────────────┬───────────────────────────────┘
                        │
                        ▼
                ┌───────────────┐
                │  Auth Success │
                └───────┬───────┘
                        │
                        ▼
            ┌───────────────────────┐
            │  Save User Data       │
            │  to Firestore         │
            │  /users/{uid}         │
            │  - role               │
            │  - name               │
            │  - photoURL           │
            │  - createdAt          │
            └───────┬───────────────┘
                    │
                    ▼
            ┌───────────────────┐
            │  onAuthStateChanged│
            │  Listener Triggers │
            └───────┬───────────┘
                    │
                    ▼
            ┌───────────────────┐
            │  Update User State│
            │  in useAuth Hook  │
            └───────┬───────────┘
                    │
                    ▼
            ┌───────────────────┐
            │  Navigate to      │
            │  /(tabs)/explore  │
            └───────────────────┘
                    │
                    ▼
                   END
```

### 2. Authentication Code Flow

```typescript
// hooks/useAuth.ts

┌─────────────────────────────────────────────────────┐
│  useAuth Hook Initialization                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. useState: user, isLoading                       │
│  2. useEffect: onAuthStateChanged listener          │
│     │                                               │
│     ├─→ User signed in?                             │
│     │   ├─→ YES: Fetch user role from Firestore    │
│     │   │   └─→ setUser({ uid, email, role, ... }) │
│     │   │                                           │
│     │   └─→ NO: setUser(null)                       │
│     │                                               │
│     └─→ setIsLoading(false)                         │
│                                                     │
│  3. Return authentication functions:                │
│     • signUpWithEmail()                             │
│     • signInWithEmail()                             │
│     • signInAnonymous()                             │
│     • signInWithGoogle()                            │
│     • signOut()                                     │
│     • linkWithEmail()                               │
│     • linkWithGoogle()                              │
└─────────────────────────────────────────────────────┘
```

---

## Location Sharing System

### 1. Location Sharing Flow

```
START (User clicks "Start Sharing")
  │
  ▼
┌──────────────────────────┐
│ Request Location         │
│ Permission               │
└────────┬─────────────────┘
         │
         ▼
    ┌─────────┐
    │Permission│
    │ Granted? │
    └────┬─────┘
         │
    ┌────┴────┐
    │         │
   YES       NO
    │         │
    │         └─→ Show Error → END
    │
    ▼
┌──────────────────────────┐
│ Get Current Position     │
│ (GPS Coordinates)        │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Create Location Data:    │
│ {                        │
│   userId,                │
│   userName,              │
│   userPhotoURL,          │
│   latitude,              │
│   longitude,             │
│   timestamp,             │
│   isSharing: true        │
│ }                        │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Write to Firebase        │
│ Realtime Database:       │
│ /sharedLocations/{uid}   │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Start Interval Timer     │
│ (Update every 10 sec)    │
└────────┬─────────────────┘
         │
         ▼
    ┌────────────┐
    │  Location  │
    │  Updates   │◄──────┐
    │  Loop      │       │
    └────┬───────┘       │
         │               │
         ├───────────────┘
         │ (Every 10 seconds)
         │
         ▼
┌──────────────────────────┐
│ User Stops Sharing?      │
└────────┬─────────────────┘
         │
    ┌────┴────┐
    │         │
   YES       NO
    │         │
    │         └─→ Continue Loop
    │
    ▼
┌──────────────────────────┐
│ Clear Interval           │
│ Remove from Database     │
│ /sharedLocations/{uid}   │
└────────┬─────────────────┘
         │
         ▼
        END
```

### 2. Location Sharing Code Structure

```typescript
// hooks/use-location-sharing.ts

┌─────────────────────────────────────────────────────┐
│  useLocationSharing Hook                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  STATE:                                             │
│  • isSharing: boolean                               │
│  • sharedLocations: Record<string, SharedLocation>  │
│  • error: string | null                             │
│                                                     │
│  EFFECTS:                                           │
│  1. Listen to /sharedLocations                      │
│     └─→ onValue() → Filter active locations         │
│         └─→ setSharedLocations()                    │
│                                                     │
│  2. Cleanup on unmount                              │
│     └─→ Stop sharing if active                      │
│                                                     │
│  3. Web-only: beforeunload cleanup                  │
│     └─→ navigator.sendBeacon()                      │
│                                                     │
│  FUNCTIONS:                                         │
│  • startSharing()                                   │
│    ├─→ Request permission                           │
│    ├─→ Get current position                         │
│    ├─→ Write to database                            │
│    └─→ Start 10s interval                           │
│                                                     │
│  • stopSharing()                                    │
│    ├─→ Clear interval                               │
│    └─→ Remove from database                         │
│                                                     │
│  • cleanupLocationSharing()                         │
│    └─→ Internal cleanup function                    │
└─────────────────────────────────────────────────────┘
```

---

## User Presence System

### 1. Presence Management Flow

```
START (User Logs In)
  │
  ▼
┌──────────────────────────┐
│ Check if Anonymous       │
└────────┬─────────────────┘
         │
    ┌────┴────┐
    │         │
   YES       NO
    │         │
    │         └─→ Continue
    │
    └─→ Skip Presence → END
         │
         ▼
┌──────────────────────────┐
│ Create Presence Data:    │
│ {                        │
│   userId,                │
│   userName,              │
│   userPhotoURL,          │
│   status: 'online',      │
│   lastSeen: timestamp    │
│ }                        │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Set onDisconnect()       │
│ Auto-remove on           │
│ connection loss          │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Write to Firebase:       │
│ /presence/{uid}          │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Start Heartbeat Timer    │
│ (Update every 30 sec)    │
└────────┬─────────────────┘
         │
         ▼
    ┌────────────┐
    │  Heartbeat │
    │  Updates   │◄──────┐
    │  Loop      │       │
    └────┬───────┘       │
         │               │
         ├───────────────┘
         │ (Every 30 seconds)
         │
         ▼
┌──────────────────────────┐
│ User Logs Out or         │
│ Connection Lost?         │
└────────┬─────────────────┘
         │
    ┌────┴────┐
    │         │
   YES       NO
    │         │
    │         └─→ Continue Loop
    │
    ▼
┌──────────────────────────┐
│ Clear Heartbeat          │
│ Remove from Database     │
│ /presence/{uid}          │
└────────┬─────────────────┘
         │
         ▼
        END
```

### 2. Presence Listener Flow

```
┌─────────────────────────────────────────────────────┐
│  Presence Listener (All Users)                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  onValue(/presence) triggers                        │
│    │                                               │
│    ▼                                               │
│  Get all presence data                              │
│    │                                               │
│    ▼                                               │
│  For each user:                                     │
│    ├─→ Calculate time since lastSeen               │
│    │                                               │
│    ├─→ If < 2 minutes:                             │
│    │   └─→ Add to activeUsers                      │
│    │                                               │
│    └─→ If >= 2 minutes:                            │
│        └─→ Consider offline (skip)                 │
│                                                     │
│  setOnlineUsers(activeUsers)                        │
│    │                                               │
│    ▼                                               │
│  UI Updates (show online count)                     │
└─────────────────────────────────────────────────────┘
```

---

## Real-time Data Synchronization

### 1. Firebase Realtime Database Structure

```
firebase-realtime-database/
│
├── presence/
│   ├── {userId1}/
│   │   ├── userId: "abc123"
│   │   ├── userName: "John Doe"
│   │   ├── userPhotoURL: "https://..."
│   │   ├── status: "online"
│   │   └── lastSeen: 1776508675531
│   │
│   └── {userId2}/
│       ├── userId: "xyz789"
│       ├── userName: "Jane Smith"
│       ├── userPhotoURL: null
│       ├── status: "online"
│       └── lastSeen: 1776508680000
│
└── sharedLocations/
    ├── {userId1}/
    │   ├── userId: "abc123"
    │   ├── userName: "John Doe"
    │   ├── userPhotoURL: "https://..."
    │   ├── latitude: 11.086464
    │   ├── longitude: 123.970345
    │   ├── timestamp: 1776508675531
    │   └── isSharing: true
    │
    └── {userId2}/
        ├── userId: "xyz789"
        ├── userName: "Jane Smith"
        ├── userPhotoURL: null
        ├── latitude: 11.043076
        ├── longitude: 124.006545
        ├── timestamp: 1776508683819
        └── isSharing: true
```

### 2. Firestore Database Structure

```
firestore/
│
└── users/
    ├── {userId1}/
    │   ├── role: "student"
    │   ├── name: "John Doe"
    │   ├── photoURL: "https://..."
    │   ├── email: "john@example.com"
    │   ├── createdAt: Timestamp
    │   └── updatedAt: Timestamp
    │
    └── {userId2}/
        ├── role: "driver"
        ├── name: "Jane Smith"
        ├── photoURL: null
        ├── email: null (anonymous)
        ├── createdAt: Timestamp
        └── updatedAt: Timestamp
```

---

## Component Architecture

### 1. Screen Components Hierarchy

```
App Root
│
├── _layout.tsx (Root Layout)
│   │
│   ├── auth.tsx (Authentication Screen)
│   │   ├── Email/Password Form
│   │   ├── Google Sign-In Button
│   │   ├── Guest Login Button
│   │   └── Terms Modal
│   │
│   └── (tabs)/_layout.tsx (Tab Navigator)
│       │
│       ├── explore.tsx / explore.web.tsx
│       │   ├── CebuMap Component
│       │   │   ├── MapView (Mobile)
│       │   │   ├── MapContainer (Web - Leaflet)
│       │   │   ├── Route Polylines
│       │   │   ├── Boundary Polygon
│       │   │   └── User Markers
│       │   │
│       │   ├── Floating Header
│       │   │   ├── Route Dropdown
│       │   │   └── Status Display
│       │   │
│       │   └── Bottom Sheet (Mobile)
│       │       ├── Control Buttons
│       │       └── Status Info
│       │
│       └── profile.tsx / profile.web.tsx
│           ├── User Avatar
│           ├── Account Info Cards
│           ├── Link Account Button
│           ├── Logout Button
│           ├── Link Account Modal
│           └── Logout Warning Modal
```

### 2. Custom Hooks Architecture

```
┌─────────────────────────────────────────────────────┐
│  Custom Hooks Layer                                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  useAuth()                                          │
│  ├─→ Manages authentication state                   │
│  ├─→ Provides auth functions                        │
│  └─→ Listens to onAuthStateChanged                  │
│                                                     │
│  useLocationSharing(userId, userName, photoURL)     │
│  ├─→ Manages location sharing state                 │
│  ├─→ Provides start/stop functions                  │
│  ├─→ Listens to /sharedLocations                    │
│  └─→ Updates location every 10s                     │
│                                                     │
│  useUserPresence(userId, userName, photoURL)        │
│  ├─→ Manages presence state                         │
│  ├─→ Sets user online/offline                       │
│  ├─→ Listens to /presence                           │
│  └─→ Heartbeat every 30s                            │
│                                                     │
│  useColorScheme()                                   │
│  └─→ Manages theme (light/dark)                     │
└─────────────────────────────────────────────────────┘
```

---

## State Management Flow

### 1. Authentication State Flow

```
┌─────────────────────────────────────────────────────┐
│  Authentication State Management                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Firebase Auth                                      │
│       │                                             │
│       ▼                                             │
│  onAuthStateChanged()                               │
│       │                                             │
│       ▼                                             │
│  useAuth Hook                                       │
│       │                                             │
│       ├─→ user: User | null                         │
│       ├─→ isLoading: boolean                        │
│       │                                             │
│       ▼                                             │
│  React Context (implicit)                           │
│       │                                             │
│       ▼                                             │
│  All Components                                     │
│  ├─→ auth.tsx                                       │
│  ├─→ explore.tsx                                    │
│  ├─→ profile.tsx                                    │
│  └─→ _layout.tsx                                    │
└─────────────────────────────────────────────────────┘
```

### 2. Location State Flow

```
┌─────────────────────────────────────────────────────┐
│  Location State Management                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Device GPS                                         │
│       │                                             │
│       ▼                                             │
│  expo-location                                      │
│       │                                             │
│       ▼                                             │
│  useLocationSharing Hook                            │
│       │                                             │
│       ├─→ isSharing: boolean                        │
│       ├─→ sharedLocations: Record<string, Location> │
│       ├─→ error: string | null                      │
│       │                                             │
│       ▼                                             │
│  Firebase Realtime Database                         │
│  /sharedLocations/{userId}                          │
│       │                                             │
│       ▼                                             │
│  onValue() Listener                                 │
│       │                                             │
│       ▼                                             │
│  All Connected Clients                              │
│  (Real-time sync)                                   │
│       │                                             │
│       ▼                                             │
│  CebuMap Component                                  │
│  └─→ Renders markers on map                         │
└─────────────────────────────────────────────────────┘
```

### 3. Presence State Flow

```
┌─────────────────────────────────────────────────────┐
│  Presence State Management                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  User Login                                         │
│       │                                             │
│       ▼                                             │
│  useUserPresence Hook                               │
│       │                                             │
│       ├─→ onlineUsers: Record<string, UserPresence> │
│       │                                             │
│       ▼                                             │
│  Firebase Realtime Database                         │
│  /presence/{userId}                                 │
│       │                                             │
│       ├─→ Write: set() every 30s                    │
│       ├─→ Read: onValue() listener                  │
│       └─→ Auto-cleanup: onDisconnect()              │
│       │                                             │
│       ▼                                             │
│  All Connected Clients                              │
│  (Real-time sync)                                   │
│       │                                             │
│       ▼                                             │
│  UI Components                                      │
│  └─→ Display "X Online" count                       │
└─────────────────────────────────────────────────────┘
```

---

## Database Security Rules

### 1. Realtime Database Rules

```json
{
  "rules": {
    "locations": {
      "$userId": {
        ".read": true,
        ".write": "$userId === auth.uid"
      }
    },
    "presence": {
      ".read": true,
      "$userId": {
        ".write": "$userId === auth.uid"
      }
    },
    "sharedLocations": {
      ".read": true,
      "$userId": {
        ".write": "$userId === auth.uid"
      }
    }
  }
}
```

**Rule Explanation:**
- **Read Access**: Anyone can read all locations and presence data (public tracking)
- **Write Access**: Users can only write their own data (authenticated by Firebase Auth)
- **Security**: Prevents users from modifying other users' data

### 2. Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Rule Explanation:**
- **Users Collection**: Anyone can read user profiles, but only owners can write
- **Default Deny**: All other collections are denied by default

---

## Key Technical Decisions

### 1. Why Realtime Database for Location/Presence?

```
Realtime Database vs Firestore

Realtime Database:
✓ Lower latency (<100ms)
✓ Better for frequent updates
✓ Simpler data structure
✓ Built-in presence system
✓ Automatic cleanup (onDisconnect)

Firestore:
✗ Higher latency (~200ms)
✗ More expensive for frequent writes
✓ Better querying capabilities
✓ Better for complex data

Decision: Use Realtime Database for real-time features
```

### 2. Update Intervals

```
Location Updates: Every 10 seconds
├─→ Balance between accuracy and battery
├─→ Sufficient for bus tracking
└─→ Reduces database writes

Presence Heartbeat: Every 30 seconds
├─→ Keeps connection alive
├─→ Minimal overhead
└─→ 2-minute timeout for offline detection
```

### 3. Platform-Specific Implementations

```
Web vs Mobile Differences:

Maps:
├─→ Web: Leaflet (react-leaflet)
├─→ Mobile: React Native Maps

Authentication:
├─→ Web: signInWithPopup()
├─→ Mobile: Not implemented (requires expo-auth-session)

Cleanup:
├─→ Web: beforeunload + visibilitychange events
├─→ Mobile: Component unmount only
```

---

## Performance Optimizations

### 1. Data Filtering

```typescript
// Filter old locations (>5 minutes)
const activeLocations = Object.entries(data)
  .filter(([_, location]) => {
    const age = Date.now() - location.timestamp;
    return location.isSharing && age < 5 * 60 * 1000;
  });
```

### 2. Listener Cleanup

```typescript
// Always cleanup listeners
useEffect(() => {
  const unsubscribe = onValue(ref, callback);
  return () => unsubscribe();
}, []);
```

### 3. Debouncing Updates

```typescript
// Update location every 10s (not on every GPS change)
setInterval(updateLocation, 10000);
```

---

## Error Handling Strategy

### 1. Permission Errors

```
Location Permission Denied
├─→ Show user-friendly error message
├─→ Provide instructions to enable
└─→ Don't crash the app

Firebase Permission Denied
├─→ Log error (don't throw)
├─→ Continue with degraded functionality
└─→ Retry on next operation
```

### 2. Network Errors

```
Connection Lost
├─→ Firebase handles reconnection automatically
├─→ onDisconnect() triggers cleanup
└─→ Data syncs when reconnected

Write Failures
├─→ Catch and log errors
├─→ Don't block user flow
└─→ Retry on next interval
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│  Deployment Pipeline                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Development                                        │
│       │                                             │
│       ├─→ expo start (local dev)                    │
│       └─→ Hot reload enabled                        │
│                                                     │
│  Web Deployment                                     │
│       │                                             │
│       ├─→ expo export:web                           │
│       ├─→ Firebase Hosting                          │
│       └─→ URL: https://fordagoo.web.app             │
│                                                     │
│  Mobile Deployment                                  │
│       │                                             │
│       ├─→ EAS Build (cloud)                         │
│       ├─→ APK for Android                           │
│       └─→ OTA Updates (expo-updates)                │
│           ├─→ JavaScript changes                    │
│           └─→ No reinstall needed                   │
└─────────────────────────────────────────────────────┘
```

---

## Future Enhancements

### Planned Features

1. **Push Notifications**
   - Notify students when bus is nearby
   - Driver arrival alerts

2. **Route Optimization**
   - Calculate ETA based on current location
   - Traffic-aware routing

3. **Historical Data**
   - Trip history
   - Analytics dashboard

4. **Chat System**
   - Driver-student communication
   - Announcements

5. **Offline Support**
   - Cache map data
   - Queue location updates

---

## Troubleshooting Guide

### Common Issues

**Issue: "Permission Denied" errors**
```
Solution:
1. Check Firebase rules are deployed
2. Verify user is authenticated
3. Check userId matches auth.uid
```

**Issue: Markers not appearing**
```
Solution:
1. Check isSharing === true
2. Verify timestamp is recent (<5 min)
3. Check Firebase listener is active
```

**Issue: Guest login crashes**
```
Solution:
1. Check Firestore rules allow anonymous writes
2. Verify error handling in saveUserRole()
3. Check console for specific error
```

---

## Conclusion

This technical documentation provides a comprehensive overview of the ForDaGoo application architecture, data flows, and implementation details. Use this as a reference for:

- Understanding system behavior
- Debugging issues
- Planning new features
- Onboarding new developers

For questions or clarifications, refer to the inline code comments or contact the development team.

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-18  
**Maintained By:** ForDaGoo Development Team
