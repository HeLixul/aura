import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import { LineChart } from 'react-native-chart-kit';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Animated, { FadeIn, BounceIn, SlideInLeft } from 'react-native-reanimated';
import axios from "axios";

export default function HomeScreen() {
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Current Location');
  const [pollutionData] = useState([72, 68, 74, 69, 65]); // Dummy Data
  const [diseaseTrends] = useState([30, 35, 40, 50, 60]); // Dummy Data for Diseases
  const [aqi, setAqi] = useState(null);
  const [predictedDiseases, setPredictedDiseases] = useState([]);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation("Permission Denied");
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(`Lat: ${loc.coords.latitude.toFixed(2)}, Lng: ${loc.coords.longitude.toFixed(2)}`);
      setLoading(false);
    })();
  }, []);

  const fetchDiseasePrediction = async () => {
    try {
      setLoadingPrediction(true);
      const response = await axios.post("http://10.0.2.2:5000/predict", { aqi: 150 }); // Replace with real AQI
      setTimeout(() => {
        setPredictedDiseases(response.data.predicted_diseases);
        setLoadingPrediction(false);
      }, 1000); // Simulating loading time
    } catch (error) {
      setLoadingPrediction(false);
      Alert.alert("Error", "Failed to fetch predictions");
    }
  };

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
      <View className="mt-6">
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-bold text-gray-900">Current <Text className='text-green-600 text-xl'>AQI</Text></Text>
      </View>

      <View className="flex flex-row flex-wrap gap-4 mt-3 w-full">
        {/* Green - Good */}
        <View className="bg-green-300 flex justify-center items-center p-4 shadow-sm rounded-lg">
          <Text className="text-gray-900 font-bold">24 AQI</Text>
          <Text className="text-gray-600 text-m mt-1">📍 Tirunelveli</Text>
          <Text className="text-gray-700">Good</Text>
        </View>

        {/* Yellow - Moderate */}
        <View className="bg-yellow-400 flex justify-center items-center p-4 shadow-sm rounded-lg">
          <Text className="text-gray-900 font-bold">78 AQI</Text>
          <Text className="text-gray-600 text-m mt-1">📍Coimbatore</Text>
          <Text className="text-gray-700">Moderate</Text>
        </View>

        {/* Orange - Unhealthy for Sensitive Groups */}
        <View className="bg-orange-400 flex justify-center items-center p-5 shadow-sm rounded-lg">
          <Text className="text-gray-900 font-bold">105 AQI</Text>
          <Text className="text-gray-600 text-m mt-1">📍 Salem</Text>
          <Text className="text-gray-700">Unhealthy</Text>
        </View>

        {/* Red - Unhealthy (Full Width) */}
        <View className="bg-red-500 p-4 flex justify-center items-center shadow-sm rounded-lg w-full">
          <Text className="text-white font-bold">161 AQI</Text>
          <Text className="text-white text-m mt-1">📍 Trichy</Text>
          <Text className="text-white">Unhealthy</Text>
        </View>
      </View>

    </View>

      {/* Location Selector */}
      <Animated.View entering={FadeIn.delay(200)} className="mt-6">
        <Text className="text-center text-lg font-bold text-gray-700">Select Location</Text>
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

      {/* Predict Button */}
      <Animated.View entering={FadeIn.delay(400)} className="mt-6 flex items-center">
        <TouchableOpacity
          className="bg-green-500 px-4 py-2 rounded-full shadow-lg"
          onPress={fetchDiseasePrediction}
          disabled={loadingPrediction}
          style={{ opacity: loadingPrediction ? 0.7 : 1 }}
        >
          <Text className="text-white p-4 font-bold rounded-lg text-lg">{loadingPrediction ? "Predicting..." : "Get Predictions"}</Text>
        </TouchableOpacity>
      </Animated.View>

      {predictedDiseases.length > 0 && (
        <Animated.View entering={FadeIn.delay(600)} className="bg-red-300 mt-3 rounded-lg shadow-lg p-3 items-center">
          <Text className="text-lg font-bold text-black mb-3">Predicted Diseases</Text>

          <View className="flex-row justify-center gap-10">
            {predictedDiseases.map((disease, index) => (
              <Animated.View key={index} entering={SlideInLeft.delay(index * 200)} className="items-center">
                <View className='bg-white p-2 flex items-center rounded-lg'>
                <MaterialCommunityIcons
                  name={
                    disease === "Asthma" ? "lungs" :
                    disease === "Heart Disease" ? "heart-pulse" :
                    disease === "Lung Cancer" ? "biohazard" :
                    disease === "Brain Damage" ? "head-cog-outline" : "alert-circle"
                  }
                  size={50}
                  color="red"
                />
                <Text className="mt-2 text-gray-800 font-bold text-md text-center">{disease}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Pollution Trends Graph */}
      <Animated.View entering={FadeIn.delay(400)} className="p-5 bg-white rounded-lg shadow-lg mt-6 mb-10">
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
          style={{ marginTop: 10, borderRadius: 10 }}
        />
      </Animated.View>
       {/* Predicted Diseases Section */}
    </ScrollView>
  );
}
