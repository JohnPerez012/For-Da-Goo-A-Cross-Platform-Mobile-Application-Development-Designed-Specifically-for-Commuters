import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ProfileIconProps {
  size?: number;
  color?: string;
}

export function ProfileIcon({ size = 24, color = '#8E8E93' }: ProfileIconProps) {
  const scale = size / 24;
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Head circle */}
      <View style={[
        styles.head, 
        { 
          backgroundColor: color,
          width: 9 * scale,
          height: 9 * scale,
          borderRadius: 4.5 * scale,  
          top: 2 * scale,
        }
      ]} />
      
      {/* Body/shoulders */}
      <View style={[
        styles.body,
        {
          backgroundColor: color,
          width: 18 * scale,
          height: 11 * scale,
          borderTopLeftRadius: 9 * scale,
          borderTopRightRadius: 9 * scale,
          bottom: 0,
        }
      ]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  head: {
    position: 'absolute',
  },
  body: {
    position: 'absolute',
  },
});
