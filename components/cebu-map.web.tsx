import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';

export function CebuMap() {
  const openGoogleMaps = () => {
    // Northern Cebu coordinates
    const url = 'https://www.google.com/maps/@10.5195,124.0253,11z';
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <ThemedText style={styles.text}>
          📍 Map view is available on mobile app
        </ThemedText>
        <TouchableOpacity style={styles.button} onPress={openGoogleMaps}>
          <ThemedText style={styles.buttonText}>
            Open in Google Maps
          </ThemedText>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#f0f0f0',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
