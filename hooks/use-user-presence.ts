import { database } from '@/config/firebase';
import { onDisconnect, onValue, ref, remove, set } from 'firebase/database';
import { useEffect, useRef, useState } from 'react';

export interface UserPresence {
  userId: string;
  userName: string;
  userPhotoURL?: string | null;
  status: 'online' | 'offline';
  lastSeen: number;
}

export function useUserPresence(userId: string, userName?: string, userPhotoURL?: string | null) {
  const [onlineUsers, setOnlineUsers] = useState<Record<string, UserPresence>>({});
  const currentUserIdRef = useRef<string | null>(null);
  const presenceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set user as online when component mounts
  useEffect(() => {
    if (!userId || userId === 'anonymous') {
      // Clean up previous user's presence if switching from authenticated to anonymous
      if (currentUserIdRef.current && currentUserIdRef.current !== 'anonymous') {
        const oldUserRef = ref(database, `presence/${currentUserIdRef.current}`);
        remove(oldUserRef).catch(err => {
          console.log('Could not remove old presence (expected if user changed):', err.message);
        });
      }
      currentUserIdRef.current = null;
      return;
    }

    // If userId changed, clean up old presence
    if (currentUserIdRef.current && currentUserIdRef.current !== userId) {
      console.log('User changed, cleaning up old presence:', currentUserIdRef.current);
      const oldUserRef = ref(database, `presence/${currentUserIdRef.current}`);
      remove(oldUserRef).catch(err => {
        console.log('Could not remove old presence (expected if user changed):', err.message);
      });
      
      // Clear old interval
      if (presenceIntervalRef.current) {
        clearInterval(presenceIntervalRef.current);
        presenceIntervalRef.current = null;
      }
    }

    currentUserIdRef.current = userId;
    console.log('=== Setting user presence as ONLINE ===');
    const userPresenceRef = ref(database, `presence/${userId}`);

    // Set user as online
    const setOnline = async () => {
      try {
        const presenceData = {
          userId,
          userName: userName || 'User',
          userPhotoURL: userPhotoURL || null,
          status: 'online',
          lastSeen: Date.now(),
        };

        // Set up automatic removal on disconnect
        await onDisconnect(userPresenceRef).remove();
        
        // Set user as online
        await set(userPresenceRef, presenceData);
        console.log('✅ Presence set with auto-cleanup on disconnect');
      } catch (err: any) {
        console.error('Error setting presence:', err.message);
      }
    };

    setOnline();

    // Update presence every 30 seconds to show user is still active
    presenceIntervalRef.current = setInterval(() => {
      set(userPresenceRef, {
        userId,
        userName: userName || 'User',
        userPhotoURL: userPhotoURL || null,
        status: 'online',
        lastSeen: Date.now(),
      }).catch(err => console.error('Error updating presence:', err));
    }, 30000); // Update every 30 seconds

    // Cleanup: Set user as offline when component unmounts
    return () => {
      console.log('=== Cleaning up presence for user:', userId, '===');
      
      if (presenceIntervalRef.current) {
        clearInterval(presenceIntervalRef.current);
        presenceIntervalRef.current = null;
      }
      
      // Only try to remove if this is still the current user
      if (currentUserIdRef.current === userId) {
        remove(userPresenceRef).catch(err => {
          console.log('Error removing presence on cleanup:', err.message);
        });
      }
    };
  }, [userId, userName, userPhotoURL]);

  // Listen to all online users
  useEffect(() => {
    console.log('=== Listening to user presence ===');
    const presenceRef = ref(database, 'presence');

    const unsubscribe = onValue(presenceRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Raw presence data:', data);
      if (data) {
        const now = Date.now();
        const activeUsers: Record<string, UserPresence> = {};

        Object.entries(data).forEach(([key, value]) => {
          const presence = value as UserPresence;
          const timeSinceLastSeen = now - presence.lastSeen;
          console.log(`User ${key}: status=${presence.status}, timeSince=${Math.round(timeSinceLastSeen/1000)}s`);

          // Consider user online if last seen within 2 minutes
          if (timeSinceLastSeen < 2 * 60 * 1000) {
            activeUsers[key] = presence;
          }
        });

        console.log('📱 ONLINE USERS:', Object.keys(activeUsers).length);
        console.log('Active users:', activeUsers);
        setOnlineUsers(activeUsers);
      } else {
        console.log('📱 ONLINE USERS: 0 (no data)');
        setOnlineUsers({});
      }
    }, (error) => {
      console.error('Presence listener error:', error);
    });

    return () => {
      console.log('Cleaning up presence listener');
      unsubscribe();
    };
  }, []);

  return { onlineUsers };
}
