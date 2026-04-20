import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { LocationIcon } from './icons';
import { ProfileIcon } from './profile-icon';
import { ThemedText } from './themed-text';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Get icon component based on route
        const renderIcon = () => {
          const iconColor = isFocused ? '#FFFFFF' : '#8E8E93';
          if (route.name === 'explore') {
            return <LocationIcon size={26} color={iconColor} />;
          } else if (route.name === 'profile') {
            return <ProfileIcon size={26} color={iconColor} />;
          }
          return null;
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <View style={[
              styles.iconContainer, 
              isFocused && styles.iconContainerActive
            ]}>
              {renderIcon()}
            </View>
            <ThemedText style={[styles.label, isFocused && styles.labelActive]}>
              {typeof label === 'string' ? label : ''}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    height: 80,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  iconContainerActive: {
    backgroundColor: '#F56476',
    borderRadius: 25,
    shadowColor: '#F56476',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
  },
  labelActive: {
    color: '#F56476',
    fontWeight: 'bold',
  },
});
