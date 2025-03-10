import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, { FadeInRight } from "react-native-reanimated";

export default function PotentialRisks() {
  const diseases = [
    { id: "1", name: "Asthma" },
    { id: "2", name: "Bronchitis" },
    { id: "3", name: "Lung Cancer" },
    { id: "4", name: "COPD (Chronic Obstructive Pulmonary Disease)" },
    { id: "5", name: "Respiratory Infections" },
  ];

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      {/* Top Bar with Back Button */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Potential Risks</Text>
      </View>

      {/* Animated Disease List */}
      <FlatList
        data={diseases}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInRight.delay(index * 200)} // Animated appearance
            className="bg-red-100 rounded-lg p-4 mb-3"
          >
            <Text className="text-lg font-semibold text-red-700">{item.name}</Text>
          </Animated.View>
        )}
      />
    </View>
  );
}
