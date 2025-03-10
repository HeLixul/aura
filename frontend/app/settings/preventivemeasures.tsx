import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, { FadeInRight } from "react-native-reanimated";

export default function PreventiveMeasures() {
  const measures = [
    { id: "1", name: "Wear a Mask (N95)" },
    { id: "2", name: "Use Air Purifiers" },
    { id: "3", name: "Avoid Outdoor Activities in High AQI" },
    { id: "4", name: "Keep Indoor Plants for Air Purification" },
    { id: "5", name: "Stay Hydrated & Maintain Good Hygiene" },
  ];

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      {/* Top Bar with Back Button */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Preventive Measures</Text>
      </View>

      {/* Animated List of Preventive Measures */}
      <FlatList
        data={measures}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInRight.delay(index * 200)} // Animated appearance
            className="bg-green-100 rounded-lg p-4 mb-3"
          >
            <Text className="text-lg font-semibold text-green-700">{item.name}</Text>
          </Animated.View>
        )}
      />
    </View>
  );
}
