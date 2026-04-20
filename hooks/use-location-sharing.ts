import { database } from '@/config/firebase';
import * as Location from 'expo-location';
import { off, onValue, ref, remove, set } from 'firebase/database';
import { useEffect, useState } from 'react';

export interface SharedLocation {
  userId: string;
  userName: string;
  userPhotoURL?: string | null;
  latitude: number;
  longitude: number;
  timestamp: number;
  isSharing: boolean;
}

export function useLocationSharing(userId: string, userName?: string, userPhotoURL?: string | null) {
  const [isSharing, setIsSharing] = useState(false);
  const [sharedLocations, setSharedLocations] = useState<Record<string, SharedLocation>>({});
  const [error, setError] = useState<string | null>(null);

  console.log('=== useLocationSharing Hook Initialized ===');
  console.log('User ID:', userId);
  console.log('User Name:', userName);
  console.log('User Photo:', userPhotoURL);

  // Cleanup function to stop sharing and remove location data
  const cleanupLocationSharing = async (userIdToClean: string) => {
    console.log('=== CLEANUP LOCATION SHARING ===');
    
    // Clear interval
    if ((global as any).locationSharingInterval) {
      console.log('Clearing location update interval');
      clearInterval((global as any).locationSharingInterval);
      (global as any).locationSharingInterval = null;
    }

    // Remove location data from database completely
    try {
      console.log('Removing location data from Firebase for user:', userIdToClean);
      await remove(ref(database, `sharedLocations/${userIdToClean}`));
      console.log('Location data removed successfully');
    } catch (err: any) {
      console.log('Error removing location data:', err.message);
    }
  };

  // Listen to all shared locations
  useEffect(() => {
    console.log('Setting up Firebase listener for shared locations...');
    const locationsRef = ref(database, 'sharedLocations');
    
    const unsubscribe = onValue(locationsRef, async (snapshot) => {
      console.log('Firebase data received:', snapshot.val());
      const data = snapshot.val();
      if (data) {
        // Filter out old locations (older than 5 minutes) and inactive locations
        const now = Date.now();
        const activeLocations: Record<string, SharedLocation> = {};
        
        Object.entries(data).forEach(([key, value]) => {
          const location = value as SharedLocation;
          const age = now - location.timestamp;
          console.log(`Location ${key}: isSharing=${location.isSharing}, age=${Math.round(age/1000)}s`);
          
          // Only show locations that are actively sharing AND recent
          if (location.isSharing === true && age < 5 * 60 * 1000) {
            // Ensure we have default values for missing data
            location.userName = location.userName || 'User';
            location.userPhotoURL = location.userPhotoURL || null;
            activeLocations[key] = location;
          }
        });
        
        console.log('Active locations count:', Object.keys(activeLocations).length);
        console.log('Active locations:', activeLocations);
        console.log('📊 ACTIVE USERS SHARING LOCATION:', Object.keys(activeLocations).length);
        setSharedLocations(activeLocations);
      } else {
        console.log('No shared locations in database');
        console.log('📊 ACTIVE USERS SHARING LOCATION: 0');
        setSharedLocations({});
      }
    }, (error) => {
      console.error('Firebase listener error:', error);
    });

    return () => {
      console.log('Cleaning up Firebase listener');
      off(locationsRef);
    };
  }, []);

  // Cleanup on component unmount or page unload
  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      if (isSharing) {
        console.log('Component unmounting - cleaning up location sharing');
        cleanupLocationSharing(userId);
      }
    };
  }, [isSharing, userId]);

  // Cleanup when browser tab/window closes (web only)
  useEffect(() => {
    // Only run on web platform
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const handleBeforeUnload = () => {
      if (isSharing) {
        console.log('Page unloading - cleaning up location sharing');
        // Use synchronous method for beforeunload
        navigator.sendBeacon(
          `https://fordagooo-default-rtdb.asia-southeast1.firebasedatabase.app/sharedLocations/${userId}.json`,
          JSON.stringify(null)
        );
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && isSharing) {
        console.log('Tab hidden - stopping location sharing');
        stopSharing();
      }
    };

    // Add event listeners for web
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isSharing, userId]);

  // Start sharing location
  const startSharing = async () => {
    console.log('=== START SHARING CALLED ===');
    try {
      console.log('Requesting location permissions...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Permission status:', status);
      
      if (status !== 'granted') {
        console.error('Location permission denied');
        setError('Location permission denied');
        return;
      }

      setIsSharing(true);
      setError(null);
      console.log('Location sharing enabled');

      // Get initial location immediately
      console.log('Getting initial location...');
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        console.log('Initial location:', location.coords);

        const locationData: SharedLocation = {
          userId,
          userName: userName || 'User',
          userPhotoURL: userPhotoURL || null,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: Date.now(),
          isSharing: true,
        };

        console.log('Writing initial location to Firebase:', locationData);
        await set(ref(database, `sharedLocations/${userId}`), locationData);
        console.log('Initial location written successfully');
      } catch (err) {
        console.error('Error getting initial location:', err);
      }

      // Update location every 10 seconds
      console.log('Setting up location update interval (10s)');
      const locationInterval = setInterval(async () => {
        console.log('--- Location Update Interval Triggered ---');
        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          const locationData: SharedLocation = {
            userId,
            userName: userName || 'User',
            userPhotoURL: userPhotoURL || null,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: Date.now(),
            isSharing: true,
          };

          console.log('Updating location:', locationData);
          await set(ref(database, `sharedLocations/${userId}`), locationData);
          console.log('Location updated successfully');
        } catch (err) {
          console.error('Error updating location:', err);
        }
      }, 10000);

      // Store interval ID for cleanup
      (global as any).locationSharingInterval = locationInterval;
      console.log('Location sharing started successfully');

    } catch (err) {
      console.error('Failed to start sharing location:', err);
      setError('Failed to start sharing location');
    }
  };

  // Stop sharing location
  const stopSharing = async () => {
    console.log('=== STOP SHARING CALLED ===');
    setIsSharing(false);
    await cleanupLocationSharing(userId);
  };

  return {
    isSharing,
    sharedLocations,
    error,
    startSharing,
    stopSharing,
  };
}
