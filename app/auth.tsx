import { ThemedText } from '@/components/themed-text';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function AuthScreen() {
  const { mockLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true); // Toggle state
  const [hasAgreed, setHasAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAuth = () => {
    if (!hasAgreed) {
      Alert.alert("Agreement Required", "Please accept the Terms & Privacy Policy.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    // Success!
    // mockLogin(); 
    // router.replace('/(tabs)'); 
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title" style={styles.headerText}>FordaGo</ThemedText>
      <ThemedText style={styles.subtitle}>
        {isLogin ? 'Welcome back, Student!' : 'Join the Daanbantayan Community'}
      </ThemedText>
      
      <View style={styles.form}>
        <TextInput 
          style={styles.input} 
          placeholder="CTU Email" 
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#5E435280" 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          secureTextEntry 
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#5E435280" 
        />

        {!isLogin && (
          <TextInput 
            style={styles.input} 
            placeholder="Confirm Password" 
            secureTextEntry 
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="#5E435280" 
          />
        )}

        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.checkbox, hasAgreed && {backgroundColor: '#F56476'}]} 
            onPress={() => setHasAgreed(!hasAgreed)} 
          />
          <ThemedText style={{fontSize: 12, color: '#5E4352'}}>
            I accept the <ThemedText style={styles.link} onPress={() => setShowTerms(true)}>Terms & Privacy Policy</ThemedText>
          </ThemedText>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleAuth}>
          <ThemedText style={styles.btnText}>{isLogin ? 'Login' : 'Sign Up'}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={{marginTop: 15}}>
          <ThemedText style={styles.toggleText}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <Modal visible={showTerms} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <ThemedText type="subtitle">Terms of Use</ThemedText>
            <ThemedText style={styles.termsBody}>
              By using FordaGo, you agree to share your location for commuter tracking at CTU-Daanbantayan. 
              Data is handled per the PH Data Privacy Act.
            </ThemedText>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowTerms(false)}>
              <ThemedText style={{color: '#fff'}}>Close</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 40, justifyContent: 'center', backgroundColor: '#fff' },
  headerText: { color: '#5E4352', textAlign: 'center', fontSize: 36 },
  subtitle: { textAlign: 'center', color: '#5E4352', opacity: 0.6, marginBottom: 20 },
  form: { gap: 12 },
  input: { backgroundColor: '#FAFAFA', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#DFBBB1' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#F56476' },
  link: { color: '#E43F6F', textDecorationLine: 'underline', fontWeight: 'bold' },
  btn: { backgroundColor: '#F56476', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  toggleText: { textAlign: 'center', color: '#BE3E82', fontWeight: '600' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 25 },
  modal: { backgroundColor: '#fff', padding: 25, borderRadius: 20, gap: 15 },
  termsBody: { color: '#5E4352', fontSize: 13, lineHeight: 18 },
  closeBtn: { backgroundColor: '#5E4352', padding: 12, borderRadius: 10, alignItems: 'center' }
});