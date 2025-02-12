import { Tabs } from 'expo-router';
import React from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: 'black',position:'absolute',bottom:20,marginLeft:'22%',marginRight:'22%',borderRadius:30,paddingTop:3 }, 
        tabBarShowLabel: false, 
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name="house.fill" color={focused ? '#00bbf0' : '#dbd8e3'} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name="paperplane.fill" color={focused ? '#00bbf0' : '#dbd8e3'} />
          ),
        }}
      />
    </Tabs>
  );
}
