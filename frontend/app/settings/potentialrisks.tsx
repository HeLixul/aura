import { View, Text,Image, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, { FadeInRight } from "react-native-reanimated";
import LottieView from 'lottie-react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useLocalSearchParams } from "expo-router";

const getAirPollutionRisks = async (healthClass, healthScore, aqi) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=api`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Given an AQI of ${aqi}, a health impact score of ${healthScore}, and a classification of '${healthClass}', list exactly five air pollution-related diseases. Only return the five disease names, separated by line breaks, without any extra text.`
                }
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini Response:", JSON.stringify(data, null, 2));

    // Extract diseases from text response
    const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Convert text response into an array by splitting on new lines and removing unwanted characters
    const risks = textResponse
      .split("\n")
      .map((d, i) => d.replace(/[*-]/g, "").trim()) // Remove '*' or '-' from the list
      .filter(d => d.length > 0) // Remove empty items
      .slice(0, 5) // Ensure only 5 items
      .map((name, index) => ({ id: String(index + 1), name })); // Convert to objects

    return risks;
  } catch (error) {
    console.error("Error fetching AI risks:", error);
    Alert.alert("AI Error", "Failed to fetch disease risks.");
    return [];
  }
};


export default function PotentialRisks() {
  const [loading, setLoading] = useState(true);
  const [healthClass, setHealthClass] = useState("");
  const [healthScore, setHealthScore] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [diseases, setDiseases] = useState([]);

  const { lat, lon, place } = useLocalSearchParams();

  console.log("Received lat:", lat, "lon:", lon); // Use these values to fetch data

  useEffect(() => {
    if (lat && lon) {
      fetchHealthData(lat, lon); // Use dynamic values from params
    }
  }, [lat, lon]);

  const fetchHealthData = async (lat, lon) => {
    setLoading(true);
    try {
      const response = await fetch(`http://10.1.216.68:5000/predict?lat=${lat}&lon=${lon}`);
      const data = await response.json();
  
      if (data.PredictedHealthImpactScore !== undefined) {
        const percentageScore = Math.max(0, Math.min(100, Math.round(data.PredictedHealthImpactScore)));
        setHealthScore(percentageScore);
        setHealthClass(classifyHealthImpact(percentageScore));
        setAqi(data.AQI || 100); // Default AQI if missing
  
        // Get AI-generated risks and update state
        const risks = await getAirPollutionRisks(healthClass, percentageScore, aqi);
        setDiseases(risks);
      } else {
        Alert.alert("Error", "Failed to fetch valid health data.");
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

  return (
    <View className="flex-1 bg-gray-100 px-6 pt-12">
      <View>
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <View className="flex-row items-center p-4 rounded-lg mb-4 mt-3 ml-[-15px]">
          <Image
            source={require("../../assets/pollutedearth.png")}
            className="w-36 h-36 rounded-3xl mr-6 elevation-md"
          />
          <View>
            <Text className="text-xl font-pbold text-red-600">
              Potential Health Risks 
            </Text>
            <Text className="text-lg font-pbold text-gray-900">{place}</Text>
          </View>
        </View>

      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center mt-[-150px]">
                  <LottieView 
                    source={require('../../assets/loadingearth.json')}  
                    autoPlay
                    loop
                    style={{ width: 100, height: 100 }} 
                  />
                  <Text className="font-psemibold text-gray-700 mt-2">Please wait...</Text>
          </View>
      ) : (
        <>
          {/* Display AQI, Health Score, and Class */}
          <View className="flex-row justify-center items-center gap-8 mb-4">
            <View className="bg-red-500 p-5 rounded-lg mb-4 elevation-md w-[160px]">
              <Text className="text-lg text-center font-psemibold text-white">Health Score {healthScore}%</Text>
            </View>
            <View className="bg-red-500 p-5 rounded-lg mb-4 elevation-md w-[160px]">
              <Text className="text-lg text-center font-psemibold text-white">Health Impact {healthClass}</Text>
            </View>
          </View>
          {/* Animated Disease List */}
          <FlatList
          data={diseases}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            // Trim the item name to ensure correct mapping
            const diseaseName = item.name.trim();

            // Mapping disease names to appropriate FontAwesome5 icons
            const iconMap = {
              "Asthma": "lungs",
              "Chronic Obstructive Pulmonary Disease (COPD)": "lungs-virus",
              "Lung Cancer": "radiation",
              "Cardiovascular Disease": "heartbeat",
              "Respiratory Infections": "virus",
            };

            // Get icon name, default to "lungs" if not found
            const iconName = iconMap[diseaseName] || "virus";

            return (
              <Animated.View
                key={item.id}
                entering={FadeInRight.delay(index * 200)}
                className="w-[150px] bg-slate-50 rounded-lg elevation-md p-4 m-2 flex items-center justify-between"
              >
                {/* Icon */}
                <FontAwesome5 
                  name={iconName}
                  size={28}
                  color={index % 2 === 0 ? "#D32F2F" : "#1976D2"}
                />

                {/* Disease Name */}
                <Text className="text-md font-semibold text-gray-800 text-center mt-2">
                  {diseaseName}
                </Text>

                {/* Arrow Button */}
                <TouchableOpacity className="mt-3">
                  <FontAwesome5 name="arrow-right" size={16} color="#333" />
                </TouchableOpacity>
              </Animated.View>
            );
          }}
        />
        </>
      )}
    </View>
  );
}
