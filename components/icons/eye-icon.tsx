import React from 'react';
import { StyleSheet, View } from 'react-native';

interface EyeIconProps {
  size?: number;
  color?: string;
  closed?: boolean;
}

export function EyeIcon({ size = 20, color = '#8E8E93', closed = false }: EyeIconProps) {
  const scale = size / 20;
  
  if (closed) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        {/* Closed eye line */}
        <View style={[
          styles.closedLine,
          {
            width: 16 * scale,
            height: 2 * scale,
            borderRadius: 1 * scale,
            backgroundColor: color,
          }
        ]} />
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Eye outline */}
      <View style={[
        styles.eyeOutline,
        {
          width: 18 * scale,
          height: 12 * scale,
          borderRadius: 9 * scale,
          borderWidth: 2 * scale,
          borderColor: color,
        }
      ]} />
      {/* Pupil */}
      <View style={[
        styles.pupil,
        {
          width: 6 * scale,
          height: 6 * scale,
          borderRadius: 3 * scale,
          backgroundColor: color,
        }
      ]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeOutline: {
    position: 'absolute',
  },
  pupil: {
    position: 'absolute',
  },
  closedLine: {
    position: 'absolute',
  },
});
