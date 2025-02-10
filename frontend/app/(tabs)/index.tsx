import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import * as Location from 'expo-location';
import { LineChart } from 'react-native-chart-kit';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Animated, { FadeIn, BounceIn } from 'react-native-reanimated';
import '../../global.css'

export default function HomeScreen() {
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Current Location');
  const [pollutionData] = useState([72, 68, 74, 69, 65]); // Dummy Data
  const [diseaseTrends] = useState([30, 35, 40, 50, 60]); // Dummy Data for Diseases

  // Fetch user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Permission Denied');
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(`Lat: ${loc.coords.latitude.toFixed(2)}, Lng: ${loc.coords.longitude.toFixed(2)}`);
      setLoading(false);
    })();
  }, []);

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between bg-blue-500 mt-8 p-4 rounded-lg shadow-md">
        <Animated.Text entering={BounceIn} className="text-xl font-bold text-white">
          Air & Health
        </Animated.Text>
        <FontAwesome5 name="wind" size={28} color="white" />
      </View>
       {/* Motivational Quote */}
       <Animated.View entering={FadeIn.delay(1000)} className="p-5 bg-indigo-100 rounded-lg shadow-lg mt-6">
        <Text className="text-lg font-bold text-indigo-800 text-center">"Breathe Clean, Live Healthy"</Text>
        <Text className="text-gray-600 text-center mt-2">A small change in the air, a big impact on life.</Text>
      </Animated.View>
      {/* Location Selector */}
      <Animated.View entering={FadeIn.delay(200)} className="mt-6">
        <Text className="text-center text-lg  font-bold text-gray-700">Select Location</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#3498DB" className="mt-2" />
        ) : (
          <Picker
            selectedValue={selectedCity}
            onValueChange={(itemValue) => setSelectedCity(itemValue)}
            className="bg-white rounded-lg mt-2 p-2 shadow-lg">
            <Picker.Item label="Current Location" value="Current Location" />
            <Picker.Item label="New York" value="New York" />
            <Picker.Item label="Los Angeles" value="Los Angeles" />
            <Picker.Item label="Chicago" value="Chicago" />
          </Picker>
        )}
      </Animated.View>

      {/* Pollution Trends Graph */}
      <Animated.View entering={FadeIn.delay(400)} className="p-5 bg-white rounded-lg shadow-lg mt-6">
        <Text className="text-lg font-bold text-blue-800">Air Quality Trends</Text>
        <Text className="text-gray-600">
          {selectedCity === 'Current Location' ? `Location: ${location}` : `City: ${selectedCity}`}
        </Text>

        <LineChart
          data={{
            labels: ['2019', '2020', '2021', '2022', '2023'],
            datasets: [{ data: pollutionData }],
          }}
          width={300}
          height={180}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#f3f4f6',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={{marginTop:10,borderRadius:10}}
        />
      </Animated.View>

      {/* Health Trends Graph */}
      <Animated.View entering={FadeIn.delay(600)} className="p-5 bg-white rounded-lg shadow-lg mt-6">
        <Text className="text-lg font-bold text-green-700">Pollution-Related Health Trends</Text>
        <Text className="text-gray-600">Increase in diseases linked to air pollution.</Text>

        <LineChart
          data={{
            labels: ['2019', '2020', '2021', '2022', '2023'],
            datasets: [{ data: diseaseTrends }],
          }}
          width={300}
          height={180}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#f3f4f6',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={{marginTop:10,borderRadius:10}}
        />
      </Animated.View>

      {/* Predicted Diseases Section */}
      <Animated.View entering={FadeIn.delay(800)} className="p-5 bg-red-100 rounded-lg shadow-lg mb-10 mt-6">
        <Text className="text-lg font-bold text-red-800">Air Pollution-Related Diseases</Text>
        <Text className="text-gray-600">Common health issues caused by poor air quality:</Text>
        <View className="flex-row justify-between mt-3">
          <View className="items-center">
            <MaterialCommunityIcons name="lungs" size={40} color="gray" />
            <Text className="text-sm text-gray-700 mt-1">Asthma</Text>
          </View>
          <View className="items-center">
            <MaterialCommunityIcons name="heart-pulse" size={40} color="red" />
            <Text className="text-sm text-gray-700 mt-1">Heart Disease</Text>
          </View>
          <View className="items-center">
            <MaterialCommunityIcons name="biohazard" size={40} color="green" />
            <Text className="text-sm text-gray-700 mt-1">Lung Cancer</Text>
          </View>
          <View className="items-center">
            <MaterialCommunityIcons name="head-cog-outline" size={40} color="purple" />
            <Text className="text-sm text-gray-700 mt-1">Brain Damage</Text>
          </View>
        </View>
      </Animated.View>

     
    </ScrollView>
  );
}
