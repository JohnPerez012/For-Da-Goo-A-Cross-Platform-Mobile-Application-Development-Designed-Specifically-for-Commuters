import { CebuMap } from '@/components/cebu-map';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocationSharing } from '@/hooks/use-location-sharing';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ExploreScreen() {
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);
  const { isSharing, sharedLocations, startSharing, stopSharing } = useLocationSharing(userId);

  const handleTrackLocation = () => {
    if (isSharing) {
      stopSharing();
      Alert.alert('FordaGo', 'Tracking stopped.');
    } else {
      startSharing();
      Alert.alert('FordaGo', 'You are now live on the map!');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* LAYER 1: FULL SCREEN MAP */}
      <View style={styles.mapWrapper}>
        <CebuMap sharedLocations={sharedLocations} />
      </View>

      {/* LAYER 2: FLOATING TOP HEADER */}
      <SafeAreaView style={styles.floatingHeader}>
        <View style={styles.headerCard}>
          <ThemedText style={styles.titleText}>FordaGo Tracker</ThemedText>
          <ThemedText style={styles.activeUsers}>
            🟢 {Object.keys(sharedLocations || {}).length} Active Now
          </ThemedText>
        </View>
      </SafeAreaView>

      {/* LAYER 3: FLOATING BOTTOM ACTION */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.mainButton, isSharing && styles.buttonActive]}
          onPress={handleTrackLocation}
          activeOpacity={0.85}>
          <ThemedText style={styles.buttonText}>
            {isSharing ? 'STOP SHARING' : 'START MY LOCATION'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#000' // Visual safety for Map loading
  },
  mapWrapper: { 
    ...StyleSheet.absoluteFillObject 
  },
  floatingHeader: {
    position: 'absolute',
    top: 40, // More breathing room for the notch
    left: 20,
    right: 20,
    zIndex: 10,
  },
  headerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    // Improved Shadow for "Floating" Look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  titleText: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#333' 
  },
  activeUsers: { 
    fontSize: 12, 
    fontWeight: '600',
    color: '#34A853',
    marginTop: 2 
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 70, // Adjust this based on your Tab Bar height
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  mainButton: {
    backgroundColor: '#F56476',
    width: '80%', // Makes it more touchable across different screens
    height: 56, // Standard mobile action button height
    borderRadius: 28, // Makes it a perfect pill shape
    justifyContent: 'center',
    alignItems: 'center',
    // Stronger "Action" Shadow
    shadowColor: '#F56476',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonActive: { 
    backgroundColor: '#34A853',
    shadowColor: '#34A853', 
  },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16,
    letterSpacing: 0.5 
  },
});