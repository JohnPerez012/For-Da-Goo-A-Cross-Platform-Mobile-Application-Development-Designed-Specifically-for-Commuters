import React from 'react';
import { StyleSheet, View } from 'react-native';

interface LocationIconProps {
  size?: number;
  color?: string;
}

export function LocationIcon({ size = 24, color = '#8E8E93' }: LocationIconProps) {
  const scale = size / 24;
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Pin circle */}
      <View style={[
        styles.pinCircle,
        {
          width: 10 * scale,
          height: 10 * scale,
          borderRadius: 5 * scale,
          backgroundColor: color,
          top: 3 * scale,
        }
      ]} />
      {/* Pin point */}
      <View style={[
        styles.pinPoint,
        {
          width: 0,
          height: 0,
          borderLeftWidth: 4 * scale,
          borderRightWidth: 4 * scale,
          borderTopWidth: 8 * scale,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
          top: 12 * scale,
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
  pinCircle: {
    position: 'absolute',
  },
  pinPoint: {
    position: 'absolute',
  },
});
