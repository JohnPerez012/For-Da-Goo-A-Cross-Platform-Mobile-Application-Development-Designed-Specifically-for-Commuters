import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#5E4352', dark: '#1D1D1D' }} 
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')} 
          style={styles.headerLogo}
        />
      }>
      
      {/* GREETING SECTION */}
      <View style={styles.titleContainer}>
        <ThemedText type="title" style={styles.darkText}>Maayong Buntag!</ThemedText>
        <HelloWave />
      </View>
      <ThemedText style={styles.subtitle}>Welcome to FordaGo, CTU Student.</ThemedText>

      {/* PRIMARY ACTION: TRACKING MAP */}
      <View style={styles.mainCard}>
        <ThemedText type="subtitle" style={{ color: '#fff' }}>Live Tracker</ThemedText>
        <ThemedText style={{ color: '#fff', opacity: 0.9, marginBottom: 15 }}>
          Real-time jeepney locations for Daanbantayan.
        </ThemedText>
        <Link href="/explore" asChild>
          <TouchableOpacity style={styles.buttonWhite}>
            <ThemedText style={[styles.buttonTextDark, { color: '#F56476' }]}>Open Map</ThemedText>
          </TouchableOpacity>
        </Link>
      </View>

      {/* NEW FEATURE 1: FARE CALCULATOR (Student Discount) */}
      <View style={styles.sectionContainer}>
        <ThemedText type="subtitle" style={styles.darkText}>Quick Tools</ThemedText>
        <View style={styles.toolCard}>
          <View style={styles.iconCircle}>
            <ThemedText style={{fontSize: 20}}>₱</ThemedText>
          </View>
          <View style={{flex: 1}}>
            <ThemedText type="defaultSemiBold" style={{color: '#5E4352'}}>Fare Calculator</ThemedText>
            <ThemedText style={styles.smallText}>Check 20% Student Discount rates</ThemedText>
          </View>
          <TouchableOpacity style={styles.arrowButton}>
            <ThemedText style={{color: '#fff', fontWeight: 'bold'}}>Go</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* NEW FEATURE 2: SAFETY SHARE */}
      <View style={[styles.mainCard, { backgroundColor: '#BE3E82' }]}>
        <ThemedText type="subtitle" style={{ color: '#fff' }}>Safety Sentry</ThemedText>
        <ThemedText style={{ color: '#fff', opacity: 0.9, marginBottom: 15 }}>
          Share your live trip with family or friends for a safer commute.
        </ThemedText>
        <TouchableOpacity 
          style={styles.buttonWhite} 
          onPress={() => alert("Safety Link Shared with your emergency contacts!")}
        >
          <ThemedText style={[styles.buttonTextDark, { color: '#BE3E82' }]}>Send Safety Link</ThemedText>
        </TouchableOpacity>
      </View>

      {/* COMMUTE STATUS */}
      <View style={styles.sectionContainer}>
        <ThemedText type="subtitle" style={styles.darkText}>Active Routes</ThemedText>
        <View style={styles.infoRow}>
          <View style={[styles.infoCard, { borderLeftColor: '#E43F6F' }]}>
            <ThemedText type="defaultSemiBold" style={{ color: '#BE3E82' }}>Via Kawit</ThemedText>
            <ThemedText style={styles.smallText}>3 mins away</ThemedText>
          </View>
          <View style={[styles.infoCard, { borderLeftColor: '#F56476' }]}>
            <ThemedText type="defaultSemiBold" style={{ color: '#BE3E82' }}>Via Bagay</ThemedText>
            <ThemedText style={styles.smallText}>10 mins away</ThemedText>
          </View>
        </View>
      </View>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 15,
  },
  darkText: { color: '#5E4352' },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 20,
    color: '#5E4352',
  },
  mainCard: {
    backgroundColor: '#F56476', 
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
  },
  sectionContainer: {
    gap: 10,
    marginBottom: 20,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DFBBB1', // Your Nude/Cream
    padding: 15,
    borderRadius: 18,
    gap: 12,
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButton: {
    backgroundColor: '#5E4352',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 15,
    borderRadius: 15,
    borderLeftWidth: 5,
  },
  headerLogo: {
    height: 140,
    width: 240,
    bottom: 30,
    alignSelf: 'center',
    position: 'absolute',
    tintColor: '#fff',
  },
  buttonWhite: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonTextDark: {
    fontWeight: '700',
  },
  smallText: {
    fontSize: 12,
    opacity: 0.6,
    color: '#5E4352',
  },
});