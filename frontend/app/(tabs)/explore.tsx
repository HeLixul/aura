import React, { useEffect, useState } from "react";
import { 
  View, Text, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator 
} from "react-native";
import * as Location from "expo-location"; // Get user location
import { BarChart } from "react-native-chart-kit";
import { RefreshControl } from 'react-native';
import LottieView from 'lottie-react-native';

const screenWidth = Dimensions.get("window").width - 32;

const getAQIColor = (value) => {
  if (value <= 50) return "rgba(34, 197, 94, 1)"; // Green (Good)
  if (value <= 100) return "rgba(234, 179, 8, 1)"; // Yellow (Moderate)
  return "rgba(239, 68, 68, 1)"; // Red (Unhealthy)
};

export default function SummaryReport() {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState("Fetching location...");
  const [aqiData, setAqiData] = useState(null);
  const [historicalAQI, setHistoricalAQI] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Function to refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    if (location) {
      await fetchAQIData(location.latitude, location.longitude);
      await fetchHistoricalAQIData(location.latitude, location.longitude);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission denied");
        setLoading(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);

      // Get city name
      let reverseGeocode = await Location.reverseGeocodeAsync(userLocation.coords);
      if (reverseGeocode.length > 0) {
        setCity(reverseGeocode[0].city || "Unknown Location");
      }

      // Fetch both current and historical AQI data
      await fetchAQIData(userLocation.coords.latitude, userLocation.coords.longitude);
      await fetchHistoricalAQIData(userLocation.coords.latitude, userLocation.coords.longitude);
    })();
  }, []);

  // Fetch current AQI data
  const fetchAQIData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,european_aqi`
      );
      const data = await response.json();

      if (!data.current) {
        console.warn("No AQI data found");
        setAqiData(null);
      } else {
        setAqiData({
          aqi: data.current.european_aqi ?? 0,
          pm2_5: data.current.pm2_5 ?? 0,
          pm10: data.current.pm10 ?? 0,
          no2: data.current.nitrogen_dioxide ?? 0,
          so2: data.current.sulphur_dioxide ?? 0,
          co: data.current.carbon_monoxide ?? 0,
        });
      }
    } catch (error) {
      console.error("Error fetching AQI:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricalAQIData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=european_aqi&timezone=auto&past_days=7`
      );
      const data = await response.json();
  
      if (!data.hourly || !data.hourly.european_aqi) {
        console.warn("No historical AQI data found");
        setHistoricalAQI([0, 0, 0, 0, 0, 0, 0]);
        return;
      }
  
      const hourlyAQI = data.hourly.european_aqi;
  
      // Split hourly AQI into daily max AQI values
      let dailyAQI = [];
      for (let i = 0; i < 7; i++) {
        const dayStart = i * 24;
        const dayEnd = dayStart + 24;
        const dailyMax = Math.max(...hourlyAQI.slice(dayStart, dayEnd));
        dailyAQI.push(dailyMax);
      }
  
      console.log("📊 Historical AQI Data:", dailyAQI); // 🔍 Debug Log
  
      setHistoricalAQI([...dailyAQI]);  // Ensure state update
    } catch (error) {
      console.error("Error fetching historical AQI:", error);
      setHistoricalAQI([0, 0, 0, 0, 0, 0, 0]); // Default fallback
    }
  };

  if (loading) {
    return (
      <View className="flex items-center justify-center mt-[400px]">
        <Text className='font-pmedium text-center mt-2'>Loading...</Text>
        <LottieView 
          source={require('../../assets/loadingearth.json')}  
          autoPlay
          loop
          style={{ width: 100, height: 100 }}  
        />
      </View>
    );
  }
  
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="p-4" 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#16A34A"]} />
      }
      >
        {/* Location Title */}
        <View className="flex-row justify-between items-center">
          <Text className="text-xl mt-10 font-bold">{`Air Quality Report for ${city}`}</Text>
          <TouchableOpacity>
            <Text className="text-gray-400 text-lg">...</Text>
          </TouchableOpacity>
        </View>

        {/* Time Range Selector */}
        {/*
        <View className="flex-row justify-between bg-gray-200 p-2 rounded-lg my-4">
          <TouchableOpacity className="flex-1 py-2 bg-white rounded-lg shadow-md">
            <Text className="text-center font-semibold">Week</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 py-2">
            <Text className="text-center">Month</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 py-2">
            <Text className="text-center">Year</Text>
          </TouchableOpacity>
        </View>
        */}

        <View className="bg-white mt-5 p-4 rounded-xl elevation-md mb-4 flex items-center">
          <Text className="text-lg font-semibold mb-4">Analytics (Last 7 Days AQI)</Text>
          <BarChart
            data={{
              labels: ["6d", "5d", "4d", "3d", "2d", "Yest", "Today"],
              datasets: [
                { data: historicalAQI.length === 7 ? historicalAQI : new Array(7).fill(0) }
              ],
            }}
            width={screenWidth * 0.9}
            height={280} // Increased height for labels
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0, // No decimals
              color: (opacity, index) => getAQIColor(historicalAQI[index] || 0),
              labelColor: (opacity) => `rgba(0, 0, 0, ${opacity})`,
              barPercentage: 0.5,
              fillShadowGradientOpacity: 1,
              propsForLabels: {
                fontSize: 14, // Make y-axis numbers readable
              },
              propsForBackgroundLines: {
                strokeWidth: 1,
                stroke: "#ddd", // Light gray grid lines
                strokeDasharray: "4", // Dashed lines
              },
              useShadowColorFromDataset: false, // Ensures correct colors
              formatYLabel: (value) => (value % 20 === 0 ? value : ""), // Only show multiples of 20
            }}
            showValuesOnTopOfBars={true} // Displays values on top of bars
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1} // Ensures regular y-axis intervals
            style={{
              marginVertical: 8,
              borderRadius: 20,
              alignSelf: "center",
              paddingRight: 8,
            }}
          />

        </View>

        {/* AQI Summary Cards */}
        <View className="flex-row flex-wrap justify-between mb-24">
          <View className="bg-white relative p-4 rounded-3xl shadow-lg w-full mb-4">
            <Text className="text-slate-600 text-xl font-bold">Average AQI</Text>
            <Text className="absolute top-3 right-6 text-2xl font-bold" style={{ color: getAQIColor(aqiData?.aqi) }}>
              {aqiData?.aqi ?? "N/A"}
            </Text>
            <Text className="text-gray-500 text-md mt-5">
              The current AQI is {aqiData?.aqi}, which is {aqiData?.aqi <= 50 ? "Good" : aqiData?.aqi <= 100 ? "Moderate" : "Unhealthy"}.
            </Text>
          </View>

          {/* AQI Pollutant Details */}
          {[
            { label: "PM2.5", value: aqiData?.pm2_5, color: "text-blue-500", unit: "mg/m³" },
            { label: "PM10", value: aqiData?.pm10, color: "text-green-500", unit: "mg/m³" },
            { label: "NO₂", value: aqiData?.no2, color: "text-red-500", unit: "ppb" },
            { label: "SO₂", value: aqiData?.so2, color: "text-purple-500", unit: "ppb" },
            { label: "CO", value: aqiData?.co, color: "text-orange-500", unit: "ppm" },
          ].map((item, index) => (
            <View key={index} className="bg-white p-4 rounded-xl shadow-md w-[48%] mb-4">
              <Text className="text-gray-500 text-lg font-bold">{item.label}</Text>
              <Text className={`${item.color} text-2xl font-bold`}>{item.value ?? "N/A"}</Text>
              <Text className="text-gray-500 text-md">{item.unit}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
