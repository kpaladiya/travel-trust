import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AppLayout() {
  const isWeb = Platform.OS === 'web';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const sidebarWidth = isSidebarCollapsed ? 76 : 240;

  return (
    <Tabs
      tabBar={
        isWeb
          ? (props) => (
              <WebSidebar
                {...props}
                collapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
                width={sidebarWidth}
              />
            )
          : undefined
      }
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
              marginHorizontal: isSidebarCollapsed ? 10 : 12,
              marginVertical: 4,
              minHeight: 48,
            }
          : undefined,
        tabBarStyle: isWeb
          ? {
              width: sidebarWidth,
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

function WebSidebar({
  state,
  descriptors,
  navigation,
  collapsed,
  onToggle,
  width,
}: BottomTabBarProps & {
  collapsed: boolean;
  onToggle: () => void;
  width: number;
}) {
  return (
    <View style={[styles.webSidebar, { width }]}>
      <TouchableOpacity
        accessibilityLabel={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        accessibilityRole="button"
        onPress={onToggle}
        style={[styles.sidebarToggle, collapsed && styles.sidebarToggleCollapsed]}
      >
        <Ionicons name={collapsed ? 'chevron-forward' : 'chevron-back'} size={20} color="#4B5563" />
        {!collapsed ? <Text style={styles.sidebarToggleText}>Collapse</Text> : null}
      </TouchableOpacity>

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const color = focused ? '#007AFF' : '#6B7280';
        const label = options.title ?? route.name;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityLabel={label}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            }}
            style={[styles.sidebarItem, focused && styles.sidebarItemActive, collapsed && styles.sidebarItemCollapsed]}
          >
            {options.tabBarIcon?.({ focused, color, size: 22 })}
            {!collapsed ? <Text style={[styles.sidebarLabel, focused && styles.sidebarLabelActive]}>{label}</Text> : null}
            {!collapsed && options.tabBarBadge ? <View style={styles.sidebarBadge} /> : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  webSidebar: {
    minHeight: '100%',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  sidebarToggle: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  sidebarToggleCollapsed: {
    justifyContent: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 0,
  },
  sidebarToggleText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '700',
  },
  sidebarItem: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 12,
    marginVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  sidebarItemCollapsed: {
    justifyContent: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 0,
  },
  sidebarItemActive: {
    backgroundColor: '#EAF3FF',
  },
  sidebarLabel: {
    flex: 1,
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  sidebarLabelActive: {
    color: '#007AFF',
  },
  sidebarBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
});
