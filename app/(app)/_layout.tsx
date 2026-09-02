import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function AppLayout() {
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarPosition: isWeb ? 'left' : 'bottom',
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: isWeb ? 14 : 12,
          fontWeight: '600',
        },
        tabBarItemStyle: isWeb
          ? {
              borderRadius: 10,
              marginHorizontal: 12,
              marginVertical: 4,
              minHeight: 48,
            }
          : undefined,
        tabBarStyle: isWeb
          ? {
              width: 240,
              paddingTop: 28,
              paddingBottom: 28,
              backgroundColor: '#fff',
              borderRightWidth: 1,
              borderRightColor: '#E5E7EB',
              borderTopWidth: 0,
            }
          : {
              backgroundColor: '#fff',
              borderTopWidth: 0,
              paddingBottom: Platform.OS === 'ios' ? 20 : 10,
              paddingTop: 10,
              height: Platform.OS === 'ios' ? 92 : 72,
              shadowColor: '#111827',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.08,
              shadowRadius: 14,
              elevation: 12,
            },
      }}
    >
      {/* Rides Tab */}
      <Tabs.Screen
        name="(rides)"
        options={{
          title: 'Rides',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'car' : 'car-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* Travel Tab */}
      <Tabs.Screen
        name="(travel)"
        options={{
          title: 'Travel',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'people' : 'people-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* Chat Tab */}
      <Tabs.Screen
        name="(chat)"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'chatbubble' : 'chatbubble-outline'} 
              size={24} 
              color={color} 
            />
          ),
          tabBarBadge: 3,
        }}
      />

      {/* Bookings Tab */}
      <Tabs.Screen
        name="(bookings)"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'bookmark' : 'bookmark-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="(profile)"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
