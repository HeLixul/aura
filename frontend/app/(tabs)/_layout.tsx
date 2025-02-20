import { Tabs } from 'expo-router';
import React from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'black',
          position: 'absolute',
          bottom: 20,
          marginLeft: '20%',
          marginRight: '20%',
          borderRadius: 40,
          paddingTop: 3,
        },
        tabBarShowLabel: false,
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <IconSymbol size={30} name="house.fill" color={focused ? '#00bbf0' : '#dbd8e3'} />
          ),
        }}
      />

      {/* Explore Tab with Bar Chart Icon */}
      <Tabs.Screen
        name="explore"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <IconSymbol size={30} name="chart.bar.fill" color={focused ? '#00bbf0' : '#dbd8e3'} />
          ),
        }}
      />

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <IconSymbol size={30} name="gear" color={focused ? '#00bbf0' : '#dbd8e3'} />
          ),
        }}
      />
    </Tabs>
  );
}
