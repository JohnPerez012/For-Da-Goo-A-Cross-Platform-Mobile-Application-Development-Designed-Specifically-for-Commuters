import React from 'react';
import { StyleSheet, View } from 'react-native';

interface LogoutIconProps {
  size?: number;
  color?: string;
}

export function LogoutIcon({ size = 20, color = '#FFFFFF' }: LogoutIconProps) {
  const scale = size / 20;
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Door frame */}
      <View style={[
        styles.doorFrame,
        {
          width: 10 * scale,
          height: 14 * scale,
          borderRadius: 2 * scale,
          borderWidth: 2 * scale,
          borderColor: color,
          left: 0,
        }
      ]} />
      {/* Arrow line */}
      <View style={[
        styles.arrowLine,
        {
          width: 8 * scale,
          height: 2 * scale,
          backgroundColor: color,
          right: 0,
        }
      ]} />
      {/* Arrow head top */}
      <View style={[
        styles.arrowTop,
        {
          width: 0,
          height: 0,
          borderLeftWidth: 4 * scale,
          borderTopWidth: 3 * scale,
          borderBottomWidth: 3 * scale,
          borderLeftColor: color,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          right: 0,
          top: 7 * scale,
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
  doorFrame: {
    position: 'absolute',
  },
  arrowLine: {
    position: 'absolute',
  },
  arrowTop: {
    position: 'absolute',
  },
});
