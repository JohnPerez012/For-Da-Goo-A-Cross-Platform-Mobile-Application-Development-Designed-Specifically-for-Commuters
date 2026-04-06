import { Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

// Custom components
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '../../hooks/useAuth';

export default function TabLayout() {
  const { user, isLoading } = useAuth(); 

  // 1. While Firebase is checking for a user, show a loading spinner
  // This uses your palette's Coral Pink (#F56476)
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#F56476" />
      </View>
    );
  }

  // 2. If no user is logged in, redirect them to the Auth/Login screen
  // if (!user) {
  //   return <Redirect href="/auth" />;
  // }

  // 3. If user IS logged in, show the tab bar
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#E43F6F', // Your Deep Pink from the palette
        headerShown: false,
        tabBarButton: HapticTab, // Keeps the nice vibration feedback
      }}>
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Tracking', // Renamed from Explore to fit your project
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
};