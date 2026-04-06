import { CebuMap } from '@/components/cebu-map';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocationSharing } from '@/hooks/use-location-sharing';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  PanResponder,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

export default function ExploreScreen() {
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);
  const { isSharing, sharedLocations, startSharing, stopSharing } = useLocationSharing(userId);

  // --- 1. DROPDOWN & MAP STATE ---
  const [showBoundary, setShowBoundary] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState("Select Route");
  
  const menuOptions = [
    { label: "Via Kawit", type: "route" },
    { label: "Via Bagay", type: "route" },
    { label: "Both", type: "route" },
    { label: "None", type: "route" },
    { label: "Toggle Boundary", type: "action" },
  ];

  // --- 2. SLIDING SHEET LOGIC (PanResponder) ---
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      // Do not grab the touch immediately so the button can be pressed
      onStartShouldSetPanResponder: () => false,
      // Only start sliding if the user moves their finger more than 10 pixels vertically
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (event, gestureState) => {
        // Only allow dragging downwards (positive dy)
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 100) {
          // Snap down to a "Mini" state (showing just the handle and title)
          Animated.spring(translateY, {
            toValue: 130, 
            useNativeDriver: true,
            friction: 8,
          }).start();
        } else {
          // Snap back up to full view
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

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
        <CebuMap 
          sharedLocations={sharedLocations} 
          activeRoute={selectedRoute} 
          showBoundary={showBoundary}
        />
      </View>

      {/* LAYER 2: FLOATING TOP HEADER */}
      <SafeAreaView style={styles.floatingHeader}>
        <View style={styles.headerRow}>
          
          {/* COMPACT DROPDOWN */}
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity 
              style={styles.dropdownHeader} 
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <ThemedText style={styles.chevron}>
                {isDropdownOpen ? "▲" : "▼"}
              </ThemedText>
            </TouchableOpacity>

            {isDropdownOpen && (
              <View style={styles.dropdownList}>
                {menuOptions.map((option) => (
                  <TouchableOpacity 
                    key={option.label} 
                    style={[
                      styles.dropdownItem, 
                      selectedRoute === option.label && styles.dropdownItemActive
                    ]}
                    onPress={() => {
                      if (option.type === "route") setSelectedRoute(option.label);
                      else if (option.label === "Toggle Boundary") setShowBoundary(!showBoundary);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <ThemedText style={[
                      styles.dropdownItemText, 
                      selectedRoute === option.label && styles.dropdownItemTextActive
                    ]}>
                      {option.label === "Toggle Boundary" 
                        ? (showBoundary ? "Hide Boundary" : "Show Boundary") 
                        : option.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* HEADER INFO CARD */}
          <View style={styles.headerCard}>
            <ThemedText style={styles.titleText}>FordaGo Tracker</ThemedText>
            <ThemedText style={styles.activeUsers}>
              🟢 {Object.keys(sharedLocations || {}).length} Active Now
            </ThemedText>
          </View>
        </View>
      </SafeAreaView>

      {/* LAYER 3: SLIDING BOTTOM SHEET */}
      <Animated.View 
        style={[
          styles.bottomSheet, 
          { transform: [{ translateY: translateY }] } 
        ]}
        {...panResponder.panHandlers} 
      >
        <View style={styles.sheetHandle} />
        
        <ThemedText style={styles.sheetTitle}>Trip Overview</ThemedText>

        <View style={styles.sheetContent}>
          <TouchableOpacity 
            style={[styles.mainButton, isSharing && styles.buttonActive]}
            onPress={handleTrackLocation}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.buttonText}>
              {isSharing ? 'STOP SHARING' : 'START MY LOCATION'}
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.statusRow}>
            <ThemedText style={styles.statusLabel}>Status:</ThemedText>
            <ThemedText style={isSharing ? styles.statusActive : styles.statusInactive}>
              {isSharing ? " ● Live Tracking" : " ○ Offline"}
            </ThemedText>
          </View>
        </View>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#F2F2F7' 
  },
  mapWrapper: { 
    ...StyleSheet.absoluteFillObject 
  },
  floatingHeader: {
    position: 'absolute',
    top: 50, 
    left: 20,
    right: 20,
    zIndex: 20,
  },
  headerRow: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  headerCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginLeft: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleText: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: '#1C1C1E' 
  },
  activeUsers: { 
    fontSize: 11, 
    fontWeight: '600',
    color: '#34A853',
  },
  dropdownWrapper: {
    zIndex: 30,
  },
  dropdownHeader: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chevron: {
    color: '#007AFF',
    fontSize: 12,
  },
  dropdownList: {
    position: 'absolute',
    top: 55,
    left: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 160,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  dropdownItem: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  dropdownItemActive: {
    backgroundColor: '#007AFF',
  },
  dropdownItemText: {
    color: '#3A3A3C',
    fontSize: 14,
    fontWeight: '500',
  },
  dropdownItemTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 12,
    paddingBottom: 40,
    zIndex: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#D1D1D6',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 15,
  },
  sheetContent: {
    alignItems: 'center',
    width: '100%',
  },
  mainButton: {
    backgroundColor: '#F56476',
    width: '100%',
    height: 54, 
    borderRadius: 16, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonActive: { 
    backgroundColor: '#34A853',
  },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16,
    letterSpacing: 0.5 
  },
  statusRow: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 13,
    color: '#8E8E93',
    marginRight: 5,
  },
  statusActive: {
    fontSize: 13,
    color: '#34A853',
    fontWeight: '700',
  },
  statusInactive: {
    fontSize: 13,
    color: '#8E8E93',
  },
});