import React, { useState, useRef } from 'react';
import { View, Text,Image, TouchableOpacity, SafeAreaView, Animated, Easing, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import psgLogo from '../../assets/psglogo.png';
import { BackHandler } from 'react-native';

const Settings = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  const [selectedLanguage, setSelectedLanguage] = useState('English'); // Default language

  // Function to handle section toggle with smooth animation
  const toggleSection = (section, contentHeight) => {
    const isExpanding = expandedSection !== section;
    setExpandedSection(isExpanding ? section : null);

    Animated.timing(heightAnim, {
      toValue: isExpanding ? contentHeight : 0, // Dynamic height based on content
      duration: 300,
      easing: Easing.out(Easing.quad), // Smooth easing for a natural effect
      useNativeDriver: false,
    }).start();

    Animated.timing(rotateAnim, {
      toValue: isExpanding ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Button press animation
  const handlePressIn = () => {
    Animated.timing(pressAnim, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(pressAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScrollView className="flex-1 bg-white p-6 mt-10">
      {/* Header */}
      <Text className="text-2xl font-pbold text-gray-900 mb-6">Settings</Text>

      <View className="space-y-6 mt-5 gap-1.5">
        {/* Language Section */}
        <TouchableOpacity
          onPress={() => toggleSection('language', 100)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="flex-row items-center bg-gray-100 p-4 rounded-lg  elevation-md"
        >
          <Ionicons name="language" size={24} color="#007AFF" />
          <Text className="ml-4 flex-1 text-lg font-psemibold text-gray-800">Language</Text>
          <Animated.View style={{ transform: [{ rotate: expandedSection === 'language' ? '90deg' : '0deg' }] }}>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </Animated.View>
        </TouchableOpacity>

        <Animated.View style={{ height: expandedSection === 'language' ? 'auto' : 0, overflow: 'hidden', backgroundColor: '#f3f4f6', padding: expandedSection === 'language' ? 15 : 0, borderRadius: 8,marginBottom: expandedSection === 'language' ? 10 : 0,marginTop: expandedSection === 'language' ? 10 : 0}}>
          {expandedSection === 'language' && (
            <>
              <Text className="text-gray-700 font-pregular mb-2">Select your preferred language:</Text>
              <View className="bg-white rounded-lg border border-gray-300">
                <Picker
                  selectedValue={selectedLanguage}
                  onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
                >
                  <Picker.Item label="🇺🇸 English" value="English" />
                  <Picker.Item label="🇮🇳 தமிழ் (Tamil)" value="Tamil"/>
                </Picker>
              </View>
            </>
          )}
        </Animated.View>

        {/* Help Center Section */}
        <TouchableOpacity
          onPress={() => toggleSection('help', 160)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="flex-row items-center bg-gray-100 p-4 rounded-lg elevation-md"
        >
          <Ionicons name="help-circle" size={24} color="#007AFF" />
          <Text className="ml-4 flex-1 text-lg font-psemibold text-gray-800">Help Center</Text>
          <Animated.View style={{ transform: [{ rotate: expandedSection === 'help' ? '90deg' : '0deg' }] }}>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </Animated.View>
        </TouchableOpacity>

        <Animated.View style={{ height: expandedSection === 'help' ? 'auto' : 0, backgroundColor: '#f3f4f6', padding: expandedSection === 'help' ? 20 : 0, borderRadius: 8,marginBottom: expandedSection === 'help' ? 10 : 0,marginTop: expandedSection === 'help' ? 10 : 0 }}>
          {expandedSection === 'help' && (
            <>
            <Text className="text-gray-900 font-pbold text-lg mb-3">Need Help?</Text>
            <Text className="text-gray-700 font-pregular mb-4">
              If you encounter any issues, feel free to reach out:
            </Text>
          
            {/* Contact Section */}
            <View className="space-y-3 mb-4 flex justify-center items-center gap-2">
              <View className="flex-row items-center gap-10">
                <Ionicons name="call" size={22} color="#007AFF" />
                <Text className="text-gray-700 font-psemibold mt-1 ml-[-10px]">+91 98765 43210</Text>
              </View>
          
              <View className="flex-row items-center gap-4">
                <Ionicons name="mail" size={22} color="#007AFF"/>
                <Text className="text-gray-700 font-psemibold">aura@gmail.com</Text>
              </View>
            </View>
          </>
          )}
        </Animated.View>

        {/* Contributors Section */}
        <TouchableOpacity
          onPress={() => toggleSection('contributors', 100)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="flex-row items-center bg-gray-100 p-4 rounded-lg  elevation-md"
        >
          <Ionicons name="people" size={24} color="#007AFF" />
          <Text className="ml-4 flex-1 text-lg font-psemibold text-gray-800">Contributors</Text>
          <Animated.View style={{ transform: [{ rotate: expandedSection === 'language' ? '90deg' : '0deg' }] }}>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </Animated.View>
        </TouchableOpacity>

        <Animated.View style={{ height: expandedSection === 'contributors' ? 'auto' : 0, overflow: 'hidden', backgroundColor: '#f3f4f6', padding: expandedSection === 'contributors' ? 15 : 0, borderRadius: 8,marginBottom: expandedSection === 'contributors' ? 10 : 0,marginTop: expandedSection === 'contributors' ? 10 : 0}}>
          {expandedSection === 'contributors' && (
            <>
              {/* Developer Team Section */}
            <Text className="text-gray-900 font-psemibold text-lg mb-3 mt-2">👨‍💻 Developed By</Text>
            <View className="bg-gray-50 p-4 rounded-lg shadow-lg shadow-blue-500 border border-gray-300 backdrop-blur-sm">
              <View className='flex justify-center items-center gap-1'>
                <Text className="text-gray-900 text-sm font-pregular">This project is developed by students of</Text>
                <Text className="text-gray-900 font-psemibold text-lg">PSG College of Technology</Text>
              </View>
          
              {/* PSG Logo */}
              <View className="items-center mt-3">
                <Image 
                  source={psgLogo} 
                  style={{ width: 80, height: 80, resizeMode: 'contain' }} 
                />
              </View>
          
              {/* Student Names */}
              <View className="mt-4 space-y-2">
                <Text className="text-gray-700 font-psemibold text-center">Ashwin Kumar R S</Text>
                <Text className="text-gray-700 font-psemibold text-center">Bala Subramanian S</Text>
                <Text className="text-gray-700 font-psemibold text-center">Shreeram V</Text>
                <Text className="text-gray-700 font-psemibold text-center">Srivatsan R</Text>
                <Text className="text-gray-700 font-psemibold text-center">Udhith Akash R R</Text>
              </View>
            </View>
            </>
          )}
        </Animated.View>

        {/* About Us Section */}
        <TouchableOpacity
          onPress={() => toggleSection('about', 180)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="flex-row items-center bg-gray-100 p-4 rounded-lg elevation-md"
        >
          <Ionicons name="information-circle" size={24} color="#007AFF" />
          <Text className="ml-4 flex-1 text-lg font-psemibold text-gray-800">About Us</Text>
          <Animated.View style={{ transform: [{ rotate: expandedSection === 'about' ? '90deg' : '0deg' }] }}>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </Animated.View>
        </TouchableOpacity>

        <Animated.View style={{ height: expandedSection === 'about' ? 'auto' : 0, overflow: 'hidden', backgroundColor: '#f3f4f6', padding: expandedSection === 'about' ? 20 : 0, borderRadius: 8,marginBottom: expandedSection === 'about' ? 30 : 0,marginTop: expandedSection === 'about' ? 10 : 0 }}>
          {expandedSection === 'about' && (
            <>
              <View className="">
                {/* Title */}
                <Text className="text-gray-900 font-pbold text-xl mb-3">About Aura</Text>

                {/* Short Introduction */}
                <View className="text-gray-700 font-pregular leading-relaxed space-y-2 gap-2">
                  <View className="flex-row items-start">
                    <Text className="text-gray-700 text-2xl">• </Text>
                    <Text className="text-gray-700 font-pregular">
                      Aura is an advanced <Text className="font-psemibold">Air Quality Monitoring</Text> system designed to provide insights on air pollution levels.
                    </Text>
                  </View>

                  <View className="flex-row items-start">
                    <Text className="text-gray-700 text-2xl">• </Text>
                    <Text className="text-gray-700 font-pregular">
                      Offers <Text className="font-psemibold">real-time</Text> and <Text className="font-psemibold">historical insights</Text> on air quality.
                    </Text>
                  </View>

                  <View className="flex-row items-start">
                    <Text className="text-gray-700 text-2xl">• </Text>
                    <Text className="text-gray-700 font-pregular">
                      Utilizes the <Text className="font-psemibold">OpenMeteo API</Text> to analyze key air pollutants.
                    </Text>
                  </View>

                  <View className="flex-row items-start">
                    <Text className="text-gray-700 text-2xl">• </Text>
                    <Text className="text-gray-700 font-pregular">
                      Provides a comprehensive <Text className="font-psemibold">Health Score (0 - 100%)</Text> to help users assess environmental risks.
                    </Text>
                  </View>
                </View>

                {/* What We Offer Section */}
                <View className="bg-gray-50 p-4 mt-4 rounded-lg elevation-md">
                  <View className='flex-row items-center mb-3 gap-2'>
                    <Text className="text-gray-900 font-psemibold text-lg mt-1">What We Offer</Text>
                    <Ionicons name="server" size={22} color="#007AFF" />
                  </View>

                  <View className="flex-row items-center mb-3 mr-6">
                    <Ionicons name="location-outline" size={22} color="#007AFF" />
                    <Text className="ml-3 text-gray-800 font-pregular">
                      <Text className="font-psemibold">Real-time AQI Data</Text> for your current location.
                    </Text>
                  </View>

                  <View className="flex-row items-center mb-3 mr-6">
                    <Ionicons name="cloud-outline" size={22} color="#007AFF" />
                    <Text className="ml-3 text-gray-800 font-pregular">
                      <Text className="font-psemibold">Detailed Pollutant Breakdown</Text> (PM2.5, PM10, CO, NO2, SO2, O3).
                    </Text>
                  </View>

                  <View className="flex-row items-center mb-3 mr-6">
                    <Ionicons name="analytics" size={22} color="#007AFF" />
                    <Text className="ml-3 text-gray-800 font-pregular">
                      <Text className="font-psemibold">Past 7 Days AQI Trends</Text> to track air quality changes.
                    </Text>
                  </View>

                  <View className="flex-row items-center mr-6">
                    <Ionicons name="heart-outline" size={22} color="#007AFF" />
                    <Text className="ml-3 text-gray-800 font-pregular">
                      <Text className="font-psemibold">Personalized Health Risk Assessment</Text> based on pollution levels.
                    </Text>
                  </View>
                </View>

                {/* Why Aura? Section */}
                <View className="bg-gray-50 p-5 mt-4 rounded-lg elevation-md">
                  <Text className="text-gray-900 font-psemibold text-lg mb-2">🔍 Why Aura ?</Text>

                  <View className="flex-row items-center mb-2">
                    <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
                    <Text className="ml-2 text-gray-800 font-pregular">Accurate & Up-to-Date Data</Text>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
                    <Text className="ml-2 text-gray-800 font-pregular">Easy-to-Understand AQI Insights</Text>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
                    <Text className="ml-2 text-gray-800 font-pregular">Health-Based Recommendations</Text>
                  </View>

                  <View className="flex-row items-center">
                    <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
                    <Text className="ml-2 text-gray-800 font-pregular">Minimal & User-Friendly Design</Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </Animated.View>

      </View>
      <View className='flex items-center'>
      <TouchableOpacity
        onPress={() => BackHandler.exitApp()}
        className="bg-white p-4 rounded-lg elevation-md border border-red-500 w-[150px] mt-20"
      >
        <View className='flex-row justify-center items-center gap-3'>
          <Text className="text-red-500 text-center font-pbold text-xl">Exit App</Text>
          <Ionicons name="exit-outline" size={24} color="red" />
        </View>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Settings;
