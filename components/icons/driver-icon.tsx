import React from 'react';
import { StyleSheet, View } from 'react-native';

interface DriverIconProps {
  size?: number;
  color?: string;
}

export function DriverIcon({ size = 24, color = '#5E4352' }: DriverIconProps) {
  const scale = size / 24;
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Bus body */}
      <View style={[
        styles.busBody,
        {
          width: 18 * scale,
          height: 14 * scale,
          borderRadius: 3 * scale,
          backgroundColor: color,
          top: 3 * scale,
        }
      ]} />
      {/* Left window */}
      <View style={[
        styles.window,
        {
          width: 6 * scale,
          height: 5 * scale,
          borderRadius: 1 * scale,
          backgroundColor: '#FFFFFF',
          top: 5 * scale,
          left: 3 * scale,
        }
      ]} />
      {/* Right window */}
      <View style={[
        styles.window,
        {
          width: 6 * scale,
          height: 5 * scale,
          borderRadius: 1 * scale,
          backgroundColor: '#FFFFFF',
          top: 5 * scale,
          right: 3 * scale,
        }
      ]} />
      {/* Left wheel */}
      <View style={[
        styles.wheel,
        {
          width: 4 * scale,
          height: 4 * scale,
          borderRadius: 2 * scale,
          backgroundColor: color,
          bottom: 1 * scale,
          left: 2 * scale,
        }
      ]} />
      {/* Right wheel */}
      <View style={[
        styles.wheel,
        {
          width: 4 * scale,
          height: 4 * scale,
          borderRadius: 2 * scale,
          backgroundColor: color,
          bottom: 1 * scale,
          right: 2 * scale,
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
  busBody: {
    position: 'absolute',
  },
  window: {
    position: 'absolute',
  },
  wheel: {
    position: 'absolute',
  },
});
