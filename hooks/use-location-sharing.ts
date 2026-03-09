import { database } from '@/config/firebase';
import * as Location from 'expo-location';
import { off, onValue, ref, set } from 'firebase/database';
import { useEffect, useState } from 'react';

export interface SharedLocation {
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  isSharing: boolean;
}

export function useLocationSharing(userId: string) {
  const [isSharing, setIsSharing] = useState(false);
  const [sharedLocations, setSharedLocations] = useState<Record<string, SharedLocation>>({});
  const [error, setError] = useState<string | null>(null);

  console.log('=== useLocationSharing Hook Initialized ===');
  console.log('User ID:', userId);

  // Listen to all shared locations
  useEffect(() => {
    console.log('Setting up Firebase listener for shared locations...');
    const locationsRef = ref(database, 'sharedLocations');
    
    const unsubscribe = onValue(locationsRef, (snapshot) => {
      console.log('Firebase data received:', snapshot.val());
      const data = snapshot.val();
      if (data) {
        // Filter out old locations (older than 5 minutes)
        const now = Date.now();
        const activeLocations: Record<string, SharedLocation> = {};
        
        Object.entries(data).forEach(([key, value]) => {
          const location = value as SharedLocation;
          const age = now - location.timestamp;
          console.log(`Location ${key}: isSharing=${location.isSharing}, age=${Math.round(age/1000)}s`);
          
          if (location.isSharing && age < 5 * 60 * 1000) {
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
    
    // Clear interval
    if ((global as any).locationSharingInterval) {
      console.log('Clearing location update interval');
      clearInterval((global as any).locationSharingInterval);
      (global as any).locationSharingInterval = null;
    }

    // Update database to mark as not sharing
    try {
      console.log('Updating Firebase to mark as not sharing');
      await set(ref(database, `sharedLocations/${userId}`), {
        userId,
        latitude: 0,
        longitude: 0,
        timestamp: Date.now(),
        isSharing: false,
      });
      console.log('Successfully stopped sharing location');
    } catch (err) {
      console.error('Error stopping location share:', err);
    }
  };

  return {
    isSharing,
    sharedLocations,
    error,
    startSharing,
    stopSharing,
  };
}
