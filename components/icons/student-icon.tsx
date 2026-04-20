import React from 'react';
import { StyleSheet, View } from 'react-native';

interface StudentIconProps {
  size?: number;
  color?: string;
}

export function StudentIcon({ size = 24, color = '#5E4352' }: StudentIconProps) {
  const scale = size / 24;
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Head */}
      <View style={[
        styles.head,
        {
          width: 8 * scale,
          height: 8 * scale,
          borderRadius: 4 * scale,
          backgroundColor: color,
          top: 2 * scale,
        }
      ]} />
      {/* Graduation cap top */}
      <View style={[
        styles.capTop,
        {
          width: 12 * scale,
          height: 2 * scale,
          backgroundColor: color,
          top: 0,
        }
      ]} />
      {/* Body */}
      <View style={[
        styles.body,
        {
          width: 14 * scale,
          height: 10 * scale,
          borderTopLeftRadius: 7 * scale,
          borderTopRightRadius: 7 * scale,
          backgroundColor: color,
          bottom: 2 * scale,
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
  capTop: {
    position: 'absolute',
  },
  body: {
    position: 'absolute',
  },
});
