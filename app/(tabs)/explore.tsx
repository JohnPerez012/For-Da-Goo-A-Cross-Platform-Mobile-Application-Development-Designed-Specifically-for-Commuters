import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

import { CebuMap } from '@/components/cebu-map';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useLocationSharing } from '@/hooks/use-location-sharing';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';

interface WeatherData {
  current: {
    temp_c: number;
    condition: {
      text: string;
    };
    humidity: number;
  };
  location: {
    name: string;
  };
}

export default function TabTwoScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Generate a unique user ID (in production, use proper authentication)
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);
  
  // Use location sharing hook
  const { isSharing, sharedLocations, startSharing, stopSharing } = useLocationSharing(userId);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
        const city = 'Baguio';
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather');
        }

        const data = await response.json();
        setWeather(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage + ' (Note: Weather API works on mobile, not web due to CORS)');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    console.log('=== EXPLORE SCREEN MOUNTED ===');
    console.log('Generated User ID:', userId);
    console.log('📊 Initial active users:', Object.keys(sharedLocations).length);
  }, [userId]);

  const handleTrackLocation = () => {
    console.log('=== TRACK LOCATION BUTTON PRESSED ===');
    console.log('Current isSharing state:', isSharing);
    console.log('User ID:', userId);
    console.log('Current shared locations:', sharedLocations);
    console.log('📊 ACTIVE USERS SHARING LOCATION:', Object.keys(sharedLocations).length);
    
    if (isSharing) {
      console.log('Stopping location sharing...');
      stopSharing();
      Alert.alert('Location Sharing', 'You stopped sharing your location');
    } else {
      console.log('Starting location sharing...');
      startSharing();
      Alert.alert('Location Sharing', 'You are now sharing your location with all users');
    }
  }; 



  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#1e1717ff', dark: '#010909ff' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={[styles.titleContainer,{ justifyContent: 'center'}]}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          FordaGo app 
        </ThemedText>
      </ThemedView>

      <ThemedText>
        Brief Prototype Introduction to the Public Transportation Tracing Application
      </ThemedText>
      <Collapsible title = "About Us" >
           <ThemedText style={{textAlign: 'justify'}}>
            We are a group of{' '}
              <ThemedText style={{fontWeight: '600', color: '#f4b300ff'}}>
                Cebu Technological University
              </ThemedText>
            {' '}students trying to solve main problems of public transportation
            </ThemedText>

      </Collapsible>
      <Collapsible title = "Our Goals">
      <ThemedView style  = {{flexDirection: 'row' , gap: 8, marginBottom: 4}}>
        <ThemedText>•</ThemedText>
        <ThemedText style = {{flex: 1 , textAlign: 'justify'}}>To make public transportation easier and safer</ThemedText>
      </ThemedView>
      <ThemedView style  = {{flexDirection: 'row' , gap: 8, marginBottom: 4}}>
      
            <ThemedText>•</ThemedText>
            <ThemedText style = {{flex: 1 , textAlign: 'justify'}}>  Implement Tracking for Public Vehicles to ensure proper time management </ThemedText>
      
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <Link href="/modal" asChild>
          <TouchableOpacity
            style={styles.buttonGreen}
            activeOpacity={0.8}>
            <ThemedText style={styles.buttonText}>Sign In</ThemedText>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          style={styles.button}
          onPress={() => console.log("Button is Pressed")}
          activeOpacity={0.8}>
          <ThemedText style={styles.buttonText}>Contact Us</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      </Collapsible>
      <Collapsible title="Track My Location">
        <ThemedText style={{marginBottom: 10, textAlign: 'justify'}}>
          {isSharing 
            ? 'You are currently sharing your location with all users. Press the button below to stop sharing.' 
            : 'Share your real-time location with all users of this app. Your location will be visible on the map.'}
        </ThemedText>
        <TouchableOpacity 
          style={[styles.buttonTracker, isSharing && styles.buttonTrackerActive]}
          onPress={handleTrackLocation}
          activeOpacity={0.8}>
          <ThemedText style={styles.buttonText}>
            {isSharing ? 'Stop Sharing' : 'Start Sharing'}
          </ThemedText>
        </TouchableOpacity>
        <ThemedText style={{marginTop: 10, fontSize: 12, opacity: 0.7}}>
          Active users: {Object.keys(sharedLocations).length}
        </ThemedText>
        <ThemedText style={{marginTop: 5, fontSize: 10, opacity: 0.5, fontFamily: 'monospace'}}>
          Your ID: {userId}
        </ThemedText>
        <ThemedText style={{marginTop: 5, fontSize: 10, opacity: 0.5}}>
          Check browser console (F12) for detailed logs
        </ThemedText>
      </Collapsible>
      <Collapsible title="Map - Northern Cebu">
        <ThemedText style={{marginBottom: 10}}>
          Track public transportation routes in Northern Cebu
        </ThemedText>
        <CebuMap sharedLocations={sharedLocations} />
      </Collapsible>
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    alignSelf: 'center'
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
    width: 100,
    alignSelf: 'center',
    zIndex: 1,
  },
  buttonGreen: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
    width: 100,
    alignSelf: 'center',
    zIndex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Sans-Serif',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-start',
  },
  buttonTracker: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
    width: 150,
    alignSelf: 'center',
    zIndex: 1,
  },
  buttonTrackerActive: {
    backgroundColor: '#34A853',
  },
});
