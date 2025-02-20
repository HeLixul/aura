import React, { useEffect, useState } from "react";
import { 
  View, Text, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator 
} from "react-native";
import * as Location from "expo-location"; // Get user location
import { BarChart } from "react-native-chart-kit";

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
  const [loading, setLoading] = useState(true);

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

      // Reverse geocode to get city name
      let reverseGeocode = await Location.reverseGeocodeAsync(userLocation.coords);
      if (reverseGeocode.length > 0) {
        setCity(reverseGeocode[0].city || "Unknown Location");
      }

      fetchAQIData(userLocation.coords.latitude, userLocation.coords.longitude);
    })();
  }, []);

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

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="p-4">
        {/* Location Title */}
        <View className="flex-row justify-between items-center">
          <Text className="text-xl mt-10 font-bold">{`Air Quality Report for ${city}`}</Text>
          <TouchableOpacity>
            <Text className="text-gray-400 text-lg">...</Text>
          </TouchableOpacity>
        </View>

        {/* Time Range Selector */}
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

        {/* Bar Chart (Weekly AQI Data) */}
        <View className="bg-white p-6 rounded-xl shadow-md mb-4 flex items-center">
          <Text className="text-lg font-semibold mb-4">Analytics</Text>
          <BarChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [{ data: [30, 40, 50, 80, 90, 40, 20] }],
            }}
            width={screenWidth * 0.9}
            height={250}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1, index) => {
                const aqiValues = [30, 40, 50, 80, 90, 40, 20];
                return getAQIColor(aqiValues[index]);
              },
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              barPercentage: 0.4,
            }}
            style={{
              marginVertical: 8,
              borderRadius: 20,
              alignSelf: "center",
              paddingRight: 8,
            }}
            fromZero
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
