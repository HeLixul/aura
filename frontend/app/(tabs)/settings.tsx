import { View, Text, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { LiquidGaugeProgress } from './LiquidGaugeProgress.tsx'; // Adjust the import path
import * as Location from 'expo-location';
import { useRouter } from "expo-router";

const tamilNaduDistricts = [
  { id: "1", name: "Ariyalur", latitude: 11.1398, longitude: 79.0782 },
  { id: "2", name: "Chengalpattu", latitude: 12.6926, longitude: 79.9766 },
  { id: "3", name: "Chennai", latitude: 13.0827, longitude: 80.2707 },
  { id: "4", name: "Coimbatore", latitude: 11.0168, longitude: 76.9558 },
  { id: "5", name: "Cuddalore", latitude: 11.7447, longitude: 79.7680 },
  { id: "6", name: "Dharmapuri", latitude: 12.1277, longitude: 78.1570 },
  { id: "7", name: "Dindigul", latitude: 10.3673, longitude: 77.9803 },
  { id: "8", name: "Erode", latitude: 11.3410, longitude: 77.7172 },
  { id: "9", name: "Kallakurichi", latitude: 11.7380, longitude: 78.9591 },
  { id: "10", name: "Kancheepuram", latitude: 12.8342, longitude: 79.7036 },
  { id: "11", name: "Kanyakumari", latitude: 8.0883, longitude: 77.5385 },
  { id: "12", name: "Karur", latitude: 10.9601, longitude: 78.0766 },
  { id: "13", name: "Krishnagiri", latitude: 12.5190, longitude: 78.2132 },
  { id: "14", name: "Madurai", latitude: 9.9252, longitude: 78.1198 },
  { id: "15", name: "Mayiladuthurai", latitude: 11.1035, longitude: 79.6550 },
  { id: "16", name: "Nagapattinam", latitude: 10.7654, longitude: 79.8424 },
  { id: "17", name: "Namakkal", latitude: 11.2189, longitude: 78.1670 },
  { id: "18", name: "Nilgiris", latitude: 11.4916, longitude: 76.7337 },
  { id: "19", name: "Perambalur", latitude: 11.2333, longitude: 78.8833 },
  { id: "20", name: "Pudukkottai", latitude: 10.3797, longitude: 78.8200 },
  { id: "21", name: "Ramanathapuram", latitude: 9.3719, longitude: 78.8300 },
  { id: "22", name: "Ranipet", latitude: 12.9316, longitude: 79.3333 },
  { id: "23", name: "Salem", latitude: 11.6643, longitude: 78.1460 },
  { id: "24", name: "Sivaganga", latitude: 9.8470, longitude: 78.4836 },
  { id: "25", name: "Tenkasi", latitude: 8.9591, longitude: 77.3152 },
  { id: "26", name: "Thanjavur", latitude: 10.7870, longitude: 79.1378 },
  { id: "27", name: "Theni", latitude: 10.0104, longitude: 77.4760 },
  { id: "28", name: "Thoothukudi", latitude: 8.7642, longitude: 78.1348 },
  { id: "29", name: "Tiruchirappalli", latitude: 10.7905, longitude: 78.7047 },
  { id: "30", name: "Tirunelveli", latitude: 8.7139, longitude: 77.7567 },
  { id: "31", name: "Tirupathur", latitude: 12.4952, longitude: 78.2134 },
  { id: "32", name: "Tiruppur", latitude: 11.1085, longitude: 77.3411 },
  { id: "33", name: "Tiruvallur", latitude: 13.1439, longitude: 79.9086 },
  { id: "34", name: "Tiruvannamalai", latitude: 12.2253, longitude: 79.0747 },
  { id: "35", name: "Tiruvarur", latitude: 10.7726, longitude: 79.6366 },
  { id: "36", name: "Vellore", latitude: 12.9165, longitude: 79.1325 },
  { id: "37", name: "Viluppuram", latitude: 11.9398, longitude: 79.4924 },
  { id: "38", name: "Virudhunagar", latitude: 9.5680, longitude: 77.9624 }
];

const Settings = () => {

  const router = useRouter();

  const [healthScore, setHealthScore] = useState(null);
  const [healthClass, setHealthClass] = useState('');
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Coimbatore");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDistricts, setFilteredDistricts] = useState([]);

  useEffect(() => {
    fetchHealthData(11.0168, 76.9558); // Default to Coimbatore
  }, []);

  const fetchHealthData = async (lat, lon, cityName = "Coimbatore") => {
    console.log(`Fetching data for: ${cityName} (Lat: ${lat}, Lon: ${lon})`); // Debugging log
    setLoading(true);
    try {
      const response = await fetch(`http://10.1.216.68:5000/predict?lat=${lat}&lon=${lon}`);
      const data = await response.json();
      console.log("API Response:", data); // Log API response
  
      if (data.PredictedHealthImpactScore !== undefined) {
        setHealthScore(data.PredictedHealthImpactScore);
        setHealthClass(classifyHealthImpact(data.PredictedHealthImpactScore));
        setLocationName(cityName);
      } else {
        console.error("Invalid data format received:", data);
        Alert.alert("Error", "Failed to fetch valid data for this location.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Network Error", "Unable to fetch health data.");
    } finally {
      setLoading(false);
    }
  };
  
  const classifyHealthImpact = (score) => {
    if (score >= 80) return "Very High";
    if (score >= 60) return "High";
    if (score >= 40) return "Moderate";
    if (score >= 20) return "Low";
    return "Very Low";
  };

  const categoryDetails = {
    "Very High": { description: "Severe health risks! Avoid outdoor exposure.", bgColor: "bg-red-800", textColor: "bg-red-800", animation: require('../../assets/sadearth.json') },
    "High": { description: "High health risks. Limit outdoor activities.", bgColor: "bg-orange-600", textColor: "text-orange-600", animation: require('../../assets/sadearth.json') },
    "Moderate": { description: "Air quality is moderate. Some risks for sensitive individuals.", bgColor: "bg-orange-500", textColor: "text-orange-500", animation: require('../../assets/maskearth.json') },
    "Low": { description: "Good air quality. Enjoy outdoor activities.", bgColor: "bg-green-500", textColor: "text-green-500", animation: require('../../assets/happyearth.json') },
    "Very Low": { description: "Excellent air quality. No risks detected.", bgColor: "bg-teal-500", textColor: "text-teal-500", animation: require('../../assets/happyearth.json') }
  };

  const category = categoryDetails[healthClass] || categoryDetails["Moderate"];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const filtered = tamilNaduDistricts.filter(district =>
        district.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
    }
  };

  const handleSelectDistrict = (district) => {
    fetchHealthData(district.latitude, district.longitude, district.name);
    setSearchQuery("");
    setFilteredDistricts([]);
  };
  const tailwindColors = {
    "red-800": "#991B1B",
    "orange-600": "#EA580C",
    "orange-500": "#F97316",
    "green-500": "#22C55E",
    "teal-500": "#14B8A6",
  };
  return (
    <View className={`flex-1 ${category.bgColor}`}>

      {/* Title (Location Name) */}
      <View className="pt-14 pb-4 px-6 flex-row justify-between items-center">
        <Text className="text-2xl font-pbold text-gray-800">{locationName}</Text>
      </View>

      {/* Search Bar */}
      <View className="relative mx-5">
        <View className="flex-row items-center bg-gray-200 px-4 py-2 rounded-full elevation-md">
          <Ionicons name="search" size={20} color="#555" />
          <TextInput
            placeholder="Search location..."
            className="flex-1 ml-3 text-gray-700"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Dropdown Results */}
        {filteredDistricts.length > 0 && (
        <View className="absolute top-14 left-0 w-full bg-white rounded-lg shadow-lg z-10 border border-gray-300 py-2">
          <FlatList
            data={filteredDistricts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                className="flex-row items-center px-4 py-3 border-b border-gray-200 active:opacity-60"
                onPress={() => handleSelectDistrict(item)}
              >
                <Ionicons name="location-sharp" size={20} color="black" />
                <Text className="text-lg text-black font-pregular ml-3">{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center mt-[-50px] ">
          <Text className='text-2xl font-psemibold'>Predicting Potential Diseases</Text>
          <LottieView 
            source={require('../../assets/loadingearth.json')}  
            autoPlay
            loop
            style={{ width: 100, height: 100 }} 
          />
          <Text className="font-psemibold text-gray-700 mt-2">Please wait...</Text>
        </View>
      ) : (
        <View className="flex-1 items-center justify-start">
          <LottieView source={category.animation} autoPlay loop style={{ width: 250, height: 250 }} />
        </View>
      )}

      {!loading && (
        <View className="w-full bg-white rounded-t-3xl elevation-md p-6 absolute bottom-0 h-[390px] flex items-center">
          <Text className='text-xl font-pbold absolute left-6 top-5'>Predicted Health Score</Text>
          <TouchableOpacity 
            className="absolute top-4 right-4 bg-gray-800 p-2 rounded-full font-pbold elevation-md"
            onPress={() => fetchHealthData(11.0168, 76.9558, locationName)}
          >
            <View className="flex-row items-center gap-1">
              <Text className="text-white text-sm font-psemibold pl-1">Refresh</Text>
              <Ionicons name="refresh" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>

          {/* Score & Description */}
          <View className="items-center mt-10">
          {/* Row: Score & Health Class */}
          <View className="flex-row justify-center items-center gap-6">              
            <View className='relative'>
            
            <LiquidGaugeProgress 
              size={100} 
              value={healthScore ?? 0} // Ensuring default value is 0 if healthScore is null
              color={tailwindColors[category.bgColor.replace("bg-", "")]} 
            />
            <Text className="text-3xl font-pbold text-black absolute top-11 left-9">
              {healthScore ? `${Math.round(healthScore)}%` : "--"}
            </Text>
            </View>
            <Text className='font-bold text-3xl'>-</Text>
            <View className='flex-col justify-center items-center'>
              <Text className={`text-2xl font-pbold text-gray-700 text-center ${category.textColor}`}>{healthClass}</Text>
              <Text className='text-black text-lg font-psemibold'>Risk</Text>
            </View>
          </View>
          <Text className="text-lg font-psemibold text-gray-700 text-center mt-3">{category.description}</Text>
        </View>

          {/* Buttons */}
          <TouchableOpacity className="w-full mt-4 bg-gray-800 py-3 rounded-lg flex items-center justify-center elevation-sm"  onPress={() => router.push("/settings/potentialrisks")}>
            <Text className="text-white text-lg font-psemibold">Potential Risks</Text>
          </TouchableOpacity>

          <TouchableOpacity className="w-full mt-3 bg-gray-600 py-3 rounded-lg flex items-center justify-center elevation-sm" onPress={() => router.push("/settings/preventivemeasures")}>
            <Text className="text-white text-lg font-psemibold">Preventive Measures</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
};

export default Settings;
