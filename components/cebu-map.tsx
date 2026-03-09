import * as Location from 'expo-location';
import { useRef, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polygon, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { ThemedText } from './themed-text';

export function CebuMap({ sharedLocations }: { sharedLocations?: Record<string, SharedLocation> }) {
  const mapRef = useRef<MapView>(null);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showBoundary, setShowBoundary] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<'kawit' | 'bagay' | 'both' | null>('both');

  // Square boundary with 4 adjustable corners
  // You can modify these values to adjust each corner independently
  const BOUNDARY_CORNERS = {
    topLeft: {
      latitude: 11.30107,   // North latitude
      longitude: 123.49031, // West longitude
    },
    topRight: {
      latitude: 11.24181,   // North latitude
      longitude: 124.54687, // East longitude
    },
    bottomLeft: {
      latitude: 10.10010,    // South latitude
      longitude: 123.19611, // West longitude
    },
    bottomRight: {
      latitude: 10.13795,    // South latitude
      longitude: 124.22894, // East longitude
    },
  };

  // Calculate bounds from corners for constraint logic
  const DAANBANTAYAN_BOUNDS = {
    northEast: {
      latitude: Math.max(BOUNDARY_CORNERS.topLeft.latitude, BOUNDARY_CORNERS.topRight.latitude),
      longitude: Math.max(BOUNDARY_CORNERS.topRight.longitude, BOUNDARY_CORNERS.bottomRight.longitude),
    },
    southWest: {
      latitude: Math.min(BOUNDARY_CORNERS.bottomLeft.latitude, BOUNDARY_CORNERS.bottomRight.latitude),
      longitude: Math.min(BOUNDARY_CORNERS.topLeft.longitude, BOUNDARY_CORNERS.bottomLeft.longitude),
    },
  };

  // Public Transportation Routes
  // Via Kawit Route - Adjust these coordinates based on actual route waypoints
  const ROUTE_VIA_KAWIT = [
    { latitude: 10.31099, longitude: 123.92085 }, // Cebu North Terminal (start)
    { latitude: 10.32573, longitude: 123.93788 }, 
    { latitude: 10.33863, longitude: 123.95499 }, 
    { latitude: 10.38729, longitude: 124.00120 }, 
    { latitude: 10.52128, longitude: 124.02924 }, 
    { latitude: 10.52128, longitude: 124.02924 }, 
    { latitude: 10.72555, longitude: 124.01415 },
    { latitude: 10.95713, longitude: 123.96174 }, // Route waypoint 4
    { latitude: 11.04627, longitude: 124.00156 }, 
    { latitude: 11.06294, longitude: 123.97032 }, 
    { latitude: 11.0800, longitude: 123.97457 }, //Dayhagon
    { latitude: 11.09339, longitude: 123.96564 }, 
    { latitude: 11.18564, longitude: 123.94558 }, //Kawit Waypoint
    { latitude: 11.21172, longitude: 123.96893 }, 
    { latitude: 11.22440, longitude: 123.99091 }, //PayPay
    { latitude: 11.24673, longitude: 124.00167 }, // CTU Daanbantayan (end)
  ];

  // Via Bagay Route - Adjust these coordinates based on actual route waypoints
  const ROUTE_VIA_BAGAY = [
    { latitude: 10.31099, longitude: 123.92085 }, // Cebu North Terminal (start)
    { latitude: 10.35000, longitude: 123.93000 }, // Route waypoint 1
    { latitude: 10.45000, longitude: 123.94000 }, // Route waypoint 2
    { latitude: 10.60000, longitude: 123.96000 }, // Bagay area
    { latitude: 10.80000, longitude: 123.98000 }, // Route waypoint 3
    { latitude: 11.10000, longitude: 124.00000 }, // Route waypoint 4
    { latitude: 11.26656, longitude: 124.00854 }, // CTU Daanbantayan (end)
  ];

  // Custom map style to hide all default POI markers
  const customMapStyle = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "transit",
      elementType: "labels.icon",
      stylers: [{ visibility: "on" }]
    }
  ];

  // Center of Daanbantayan (calculated from boundary corners)
  const initialRegion = {
    latitude: 11.24955,  // Center latitude
    longitude: 125.05286, // Center longitude
    latitudeDelta: 0.25,
    longitudeDelta: 0.20,
  };

  // Enforce boundary constraints
  const handleRegionChangeComplete = (region: Region) => {
    if (isAdjusting) return; // Prevent infinite loop

    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

    // Prevent zooming out too far (max zoom out to show full municipality)
    const maxLatitudeDelta = 1.5;
    const maxLongitudeDelta = 1.5;
    
    // Prevent zooming in too close
    const minLatitudeDelta = 0.01;
    const minLongitudeDelta = 0.01;

    let adjustedLatitudeDelta = latitudeDelta;
    let adjustedLongitudeDelta = longitudeDelta;
    let needsAdjustment = false;

    // Constrain zoom level
    if (latitudeDelta > maxLatitudeDelta) {
      adjustedLatitudeDelta = maxLatitudeDelta;
      needsAdjustment = true;
    } else if (latitudeDelta < minLatitudeDelta) {
      adjustedLatitudeDelta = minLatitudeDelta;
      needsAdjustment = true;
    }

    if (longitudeDelta > maxLongitudeDelta) {
      adjustedLongitudeDelta = maxLongitudeDelta;
      needsAdjustment = true;
    } else if (longitudeDelta < minLongitudeDelta) {
      adjustedLongitudeDelta = minLongitudeDelta;
      needsAdjustment = true;
    }

    // Calculate the edges of the current view
    const northEdge = latitude + adjustedLatitudeDelta / 2;
    const southEdge = latitude - adjustedLatitudeDelta / 2;
    const eastEdge = longitude + adjustedLongitudeDelta / 2;
    const westEdge = longitude - adjustedLongitudeDelta / 2;

    // Check if view exceeds boundaries
    let newLatitude = latitude;
    let newLongitude = longitude;

    // Add tolerance to prevent jittering
    const tolerance = 0.001;

    // Constrain latitude
    if (northEdge > DAANBANTAYAN_BOUNDS.northEast.latitude + tolerance) {
      newLatitude = DAANBANTAYAN_BOUNDS.northEast.latitude - adjustedLatitudeDelta / 2;
      needsAdjustment = true;
    } else if (southEdge < DAANBANTAYAN_BOUNDS.southWest.latitude - tolerance) {
      newLatitude = DAANBANTAYAN_BOUNDS.southWest.latitude + adjustedLatitudeDelta / 2;
      needsAdjustment = true;
    }

    // Constrain longitude
    if (eastEdge > DAANBANTAYAN_BOUNDS.northEast.longitude + tolerance) {
      newLongitude = DAANBANTAYAN_BOUNDS.northEast.longitude - adjustedLongitudeDelta / 2;
      needsAdjustment = true;
    } else if (westEdge < DAANBANTAYAN_BOUNDS.southWest.longitude - tolerance) {
      newLongitude = DAANBANTAYAN_BOUNDS.southWest.longitude + adjustedLongitudeDelta / 2;
      needsAdjustment = true;
    }

    // Animate back to constrained region if needed
    if (needsAdjustment) {
      setIsAdjusting(true);
      mapRef.current?.animateToRegion(
        {
          latitude: newLatitude,
          longitude: newLongitude,
          latitudeDelta: adjustedLatitudeDelta,
          longitudeDelta: adjustedLongitudeDelta,
        },
        200
      );
      
      // Reset flag after animation
      setTimeout(() => setIsAdjusting(false), 250);
    }
  };

  // Get user's current location
  const handleGetLocation = async () => {
    try {
      setIsLoadingLocation(true);

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please enable location permissions to use this feature.'
        );
        setIsLoadingLocation(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      // Animate map to user's location
      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );

      setIsLoadingLocation(false);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location. Please try again.');
      setIsLoadingLocation(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        provider={PROVIDER_GOOGLE}
        onRegionChangeComplete={handleRegionChangeComplete}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {/* Daanbantayan Town Center */}
        <Marker
          coordinate={{ latitude: 11.26656, longitude: 124.00854 }}
          title="Cebu Technological University"
          description="Daanbantayan Campus"
        />
        
        {/* Malapascua Island (part of Daanbantayan) */}
        <Marker
          coordinate={{ latitude: 10.31099, longitude: 123.92085 }}
          title="Cebu North Terminal"
          description="Bus Terminal"
        />

        {/* User location marker */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You are here"
            pinColor="blue"
          />
        )}

        {/* Shared locations from other users */}
        {sharedLocations && Object.entries(sharedLocations).map(([userId, location]) => (
          location.isSharing && (
            <Marker
              key={userId}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={`User: ${userId}`}
              description="Sharing location"
              pinColor="green"
            />
          )
        ))}

        {/* Boundary overlay - red transparent rectangle with 4 adjustable corners */}
        {showBoundary && (
          <Polygon
            coordinates={[
              BOUNDARY_CORNERS.topLeft,
              BOUNDARY_CORNERS.topRight,
              BOUNDARY_CORNERS.bottomRight,
              BOUNDARY_CORNERS.bottomLeft,
            ]}
            fillColor="rgba(255, 0, 0, 0.15)"
            strokeColor="rgba(255, 0, 0, 0.5)"
            strokeWidth={2}
          />
        )}

        {/* Via Kawit Route */}
        {(selectedRoute === 'kawit' || selectedRoute === 'both') && (
          <Polyline
            coordinates={ROUTE_VIA_KAWIT}
            strokeColor="#4285F4"
            strokeWidth={4}
            lineDashPattern={[1]}
          />
        )}

        {/* Via Bagay Route */}
        {(selectedRoute === 'bagay' || selectedRoute === 'both') && (
          <Polyline
            coordinates={ROUTE_VIA_BAGAY}
            strokeColor="#34A853"
            strokeWidth={4}
            lineDashPattern={[1]}
          />
        )}
      </MapView>

      {/* Route selector buttons */}
      <View style={styles.routeSelector}>
        <TouchableOpacity 
          style={[
            styles.routeButton,
            selectedRoute === 'kawit' && styles.routeButtonActive
          ]}
          onPress={() => setSelectedRoute(selectedRoute === 'kawit' ? 'both' : 'kawit')}
        >
          <ThemedText style={[
            styles.routeButtonText,
            selectedRoute === 'kawit' && styles.routeButtonTextActive
          ]}>
            Via Kawit
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.routeButton,
            selectedRoute === 'bagay' && styles.routeButtonActive
          ]}
          onPress={() => setSelectedRoute(selectedRoute === 'bagay' ? 'both' : 'bagay')}
        >
          <ThemedText style={[
            styles.routeButtonText,
            selectedRoute === 'bagay' && styles.routeButtonTextActive
          ]}>
            Via Bagay
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.routeButton,
            selectedRoute === 'both' && styles.routeButtonActive
          ]}
          onPress={() => setSelectedRoute('both')}
        >
          <ThemedText style={[
            styles.routeButtonText,
            selectedRoute === 'both' && styles.routeButtonTextActive
          ]}>
            Both
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Button overlay */}
      <TouchableOpacity 
        style={styles.button}
        onPress={handleGetLocation}
        disabled={isLoadingLocation}
      >
        <ThemedText style={styles.buttonText}>
          {isLoadingLocation ? 'Loading...' : 'My Location'}
        </ThemedText>
      </TouchableOpacity>

      {/* Toggle boundary button */}
      <TouchableOpacity 
        style={styles.boundaryButton}
        onPress={() => setShowBoundary(!showBoundary)}
      >
        <ThemedText style={styles.buttonText}>
          {showBoundary ? 'Hide Boundary' : 'Show Boundary'}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 10,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  boundaryButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#EA4335',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  routeSelector: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  routeButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  routeButtonActive: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  routeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  routeButtonTextActive: {
    color: 'white',
  },
});
