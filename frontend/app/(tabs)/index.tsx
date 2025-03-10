import { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Dimensions, ScrollView, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeIn, BounceIn, SlideInLeft,Easing,useSharedValue,withRepeat,withTiming,interpolate,
useAnimatedStyle, } from 'react-native-reanimated';
import * as Location from 'expo-location';
import LottieView from 'lottie-react-native';
import '../../global.css'

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [aqiData, setAqiData] = useState(null);
  const [districtAQIData, setDistrictAQIData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(true);

  const radius = 65; // Circle radius for the ripple effect
  const rippleSize = useSharedValue(0); // Initial size of the ripple
  const rippleOpacity = useSharedValue(1); // Initial opacity of the ripple
  
  useEffect(() => {
    rippleSize.value = withRepeat(
      withTiming(1, {
        duration: 3000, // Duration of the ripple animation
        easing: Easing.inOut(Easing.ease), // Easing effect for smooth animation
      }),
      -1, // Repeat infinitely
      true // Reverse animation on each iteration
    );

    rippleOpacity.value = withRepeat(
      withTiming(0, {
        duration: 3000, // Duration of the opacity animation
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // Repeat infinitely
      true // Reverse animation on each iteration
    );
  }, [rippleSize, rippleOpacity]);

  const rippleStyle = useAnimatedStyle(() => {
    // Interpolating size and opacity for ripple
    const rippleRadius = interpolate(rippleSize.value, [0, 1], [0, radius * 3]);
    const rippleAlpha = interpolate(rippleOpacity.value, [0, 1], [1, 0]);

    return {
      width: rippleRadius,
      height: rippleRadius,
      borderRadius: rippleRadius / 2, // Keeping the ripple circular
      backgroundColor: 'rgba(255, 255, 255, 0.3)', // Light white color for the ripple
      position: 'absolute',
      opacity: rippleAlpha,
      top: '62%', // Centered vertically
      left: '80%', // Centered horizontally
      transform: [
        { translateX: -rippleRadius / 2 }, // Offset to center the ripple
        { translateY: -rippleRadius / 2 }, // Offset to center the ripple
      ],
      
    };
  });

  const fetchAQI = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,european_aqi`
      );      
      const data = await response.json();
      setAqiData(data.current);
    } catch (error) {
      console.error('Error fetching AQI:', error);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length > 0) {
      const district = tamilNaduDistricts.find((district) =>
        district.name.toLowerCase() === text.toLowerCase()
      );
      if (district) {
        fetchAQI(district.latitude, district.longitude);
      } else {
        setAqiData(null); // Reset if no district matches
      }
    } else {
      setAqiData(null); // Reset if search is empty
    }
  };

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
  
  const fetchDistrictAQI = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,european_aqi`
        );
        const data = await response.json();
        return data.current; // Return the AQI data for that district
      } catch (error) {
        console.error('Error fetching AQI:', error);
        return null; // Return null in case of an error
      }
    };
  
    // Function to fetch AQI data for all districts in Tamil Nadu
    const fetchAllDistrictsAQIData = async () => {
      const districtAQIResults = await Promise.all(
        tamilNaduDistricts.map(async (district) => {
          const aqiResult = await fetchDistrictAQI(district.latitude, district.longitude);
          return {
            ...district,
            aqi: aqiResult ? aqiResult.european_aqi : 0, // You can adjust to a different AQI parameter if needed (e.g., pm2_5, etc.)
          };
        })
      );
      // Sort by AQI value (descending) and get the top 5
      const sortedDistricts = districtAQIResults.sort((a, b) => b.aqi - a.aqi).slice(0, 5);
      setDistrictAQIData(sortedDistricts);
      setIsLoading(false);
    };
  
    const getCurrentLocationAQI = async () => {
      setIsFetchingLocation(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Location permission denied");
        setIsFetchingLocation(false);
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    
      try {
        // Reverse geocoding to get location name
        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
    
        if (reverseGeocode.length > 0) {
          const locationName = reverseGeocode[0].district || reverseGeocode[0].city || reverseGeocode[0].name;
          setSearchText(locationName); // Set the search text to display location name
        }
      } catch (error) {
        console.error("Error fetching location name:", error);
      }
    
      fetchAQI(location.coords.latitude, location.coords.longitude);
      setIsFetchingLocation(false);
    };
    
    useEffect(() => {
      fetchAllDistrictsAQIData();
      getCurrentLocationAQI();
    }, []);
  
    // Render function for each district
    const renderDistrictAQICard = ({ item }) => {
      const { color, label, backgroundColor } = getAQIColor(item.european_aqi);
      return (
        <View
          className="bg-white mt-5 rounded-3xl h-[190px]"
          style={{
            width: Dimensions.get('window').width * 0.7,
            marginRight: 15,
          }}
        >
          {/* Only the top section background color changes based on AQI */}
          <View className="flex-row justify-between rounded-t-3xl items-center py-4 px-5" style={{ backgroundColor }}>
            <Text className="text-white font-pbold text-xl">{item.name}</Text>
            <Text className="text-white text-lg mt-1 font-pregular">AQI {item.aqi}</Text>
          </View>
          <Text className="font-bold text-[#000000b4] text-2xl px-5 mt-4 top-7 w-[250px]">{item.name}</Text>
        </View>
      );
    };
  const getAQIColor = (aqi) => {
    if (aqi <= 50) {
      return { color: 'white', label: 'Good', backgroundColor: '#16A34A' }; // Green for good
    } else if (aqi <= 100) {
      return { color: 'black', label: 'Moderate', backgroundColor: 'orange' }; // Yellow for moderate
    } else if (aqi <= 150) {
      return { color: 'black', label: 'Unhealthy for Sensitive Groups', backgroundColor: '#CA8A04' }; // Orange for unhealthy for sensitive groups
    } else if (aqi <= 200) {
      return { color: 'black', label: 'Unhealthy', backgroundColor: '#DC2626' }; // Red for unhealthy
    } else if (aqi <= 300) {
      return { color: 'white', label: 'Very Unhealthy', backgroundColor: '#9C27B0' }; // Purple for very unhealthy
    } else {
      return { color: 'white', label: 'Hazardous', backgroundColor: '#B71C1C' }; // Maroon for hazardous
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <View className="flex-row items-center justify-between bg-blue-500 mt-8 p-4 rounded-lg shadow-md">
        <Animated.Text entering={BounceIn} className="text-xl font-bold font-pbold text-white">
          Aura
        </Animated.Text>
        <FontAwesome5 name="wind" size={28} color="white" />
      </View>

      <Animated.View entering={FadeIn.delay(1000)} className="p-5 bg-indigo-100 rounded-lg shadow-lg mt-6">
        <Text className="text-lg font-bold text-indigo-800 text-center font-pmedium">"Breathe Clean, Live Healthy"</Text>
        <Text className="text-gray-600 text-center mt-2 font-pmedium">A small change in the air, a big impact on life.</Text>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(200)} className="mt-6 px-4">      
   
      <Animated.View entering={FadeIn.delay(200)} className="bg-white rounded-3xl shadow-lg mt-2 p-2 relative">
        <TextInput
          className="text-gray-800 text-base font-pregular"
          placeholder="Search locations"
          value={searchText}
          onChangeText={handleSearch}
        />
        <View className='absolute right-[-20px] top-[-22px]'>
          <LottieView 
              source={require('../../assets/search.json')}  
              autoPlay
              loop
              style={{ width: 100, height: 100 }}  
            /> 
        </View>
      </Animated.View>

      {filteredDistricts.length > 0 && (
        <FlatList
          data={filteredDistricts}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity className="bg-gray-200 p-3 rounded-lg mt-2 font-pmedium">
              <Text className="text-gray-800">{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </Animated.View>

    {aqiData ? (
        <View className="mt-6">
        <View
          style={{
            backgroundColor: getAQIColor(aqiData.european_aqi).backgroundColor,
            height: 200,
            borderRadius: 16,
            elevation: 5,
            padding: 20,
            position: 'relative',
          }}
        >
          <Text 
            style={{ 
              color: getAQIColor(aqiData.european_aqi).color 
            }} 
            className="text-md font-pmedium"
          >
            Updated just now
          </Text>
            <Text 
              style={{ color: getAQIColor(aqiData.european_aqi).color }} 
              className="text-2xl font-pmedium leading-relaxed mt-6"
            >
              Air quality is
            </Text>
            <Text 
              style={{ color: getAQIColor(aqiData.european_aqi).color }} 
              className="font-pbold text-3xl"
            >
              {getAQIColor(aqiData.european_aqi).label}
            </Text>
      
          <Animated.View style={rippleStyle} />
      
          <View
            className="absolute right-12 bottom-12 bg-white w-32 h-32 elevation-md rounded-full flex justify-center items-center gap-1"
            style={rippleStyle}
          >
            <Text className="text-gray-400 text-center font-pbold">AQI</Text>
            <Text 
              className="text-4xl text-center font-pbold" 
              style={{ color: 'green'}}
            >
              {aqiData.european_aqi}
            </Text>
          </View>
      
          <Text 
            className="absolute font-pregular" 
            style={{ 
              bottom: 20, 
              left: 20, 
              color: getAQIColor(aqiData.european_aqi).color
            }}
          >
            {searchText} <FontAwesome5 name="map-marker-alt" size={16} color="#ff7272"/>
          </Text>
        </View>
    
        <View className='flex-row items-center justify-center ml-6'>
        <Text 
          className="mt-5 font-pmedium" 
          style={{ color: aqiData.european_aqi <= 100 ? 'black' : 'slategray' }}
        >
          Air quality is considered <Text 
            className="font-bold text-xl" 
            style={{ color: getAQIColor(aqiData.european_aqi).backgroundColor }}
          >
            {getAQIColor(aqiData.european_aqi).label}
          </Text>
        </Text>

          {aqiData.european_aqi > 50 && (
          <LottieView 
            source={require('../../assets/maskearth.json')}  
            autoPlay
            loop
            style={{ width: 100, height: 100 }}  
          />
          )}
           {aqiData.european_aqi <=50 && (
            <LottieView 
            source={require('../../assets/happyearth.json')}  
            autoPlay
            loop
            style={{ width: 100, height: 100 }}  
          />
          )}
        </View>
      </View>
      ) : (
        searchText && (
          <Text className="mt-4 text-center text-gray-500 font-pmedium">No AQI data found for "{searchText}"</Text>
        )
      )}
      <View className="flex-1">
            <Text className="mt-5 text-xl text-slate-700 font-psemibold">Top <Text className='text-2xl color-green-600'>AQI</Text> Levels</Text>
            {isLoading ? (
            <View className="flex items-center justify-center mt-10">
              <Text className='font-pmedium text-center mt-2'>Loading...</Text>
              <LottieView 
                source={require('../../assets/loadingearth.json')}  
                autoPlay
                loop
                style={{ width: 100, height: 100 }}  
              />
            </View>
          ) : (
              <FlatList
                data={districtAQIData}
                horizontal
                pagingEnabled
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderDistrictAQICard}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: Dimensions.get("window").width * 0.3 }}
                snapToInterval={Dimensions.get("window").width * 0.7 + 15}
                decelerationRate="fast"
                snapToAlignment="start"
                className="mb-28"
              />
            )}
          </View>
    </ScrollView>
  );
}
