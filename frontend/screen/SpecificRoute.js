import React, { useEffect, useState, useCallback } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, SafeAreaView, Pressable, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';




const SpecificRoute = ({ route, navigation }) => {
  const { allRoutes: initialRoutes } = route.params;

  const filterRoute = (routes) => {
    const current = new Date();
    return routes.filter(station => new Date(station.arrivalTime).getTime() >= current.getTime());
  };

  const [allRoutes, setAllRoutes] = useState(initialRoutes);
  const [currentRoute, setCurrentRoute] = useState([]);
  const [selectedStation, setSelectedStation] = useState([null, null]);

  // Use useFocusEffect to handle the interval only when updating on this screen
  useFocusEffect(
    useCallback(() => {
      const updateFilteredRoutes = () => {
        setAllRoutes(prevRoutes => prevRoutes.map(route => filterRoute(route)));
        setCurrentRoute([]);
        setSelectedStation([null, null]);
      };

      updateFilteredRoutes(); // Initial update

      const interval = setInterval(updateFilteredRoutes, 60000); // Update every minute

      return () => clearInterval(interval); // Clear interval when screen loses focus
    }, [])
  );

  useEffect(() => {
    setAllRoutes(prevRoutes => prevRoutes.map(route => filterRoute(route)));
    setCurrentRoute([])
    setSelectedStation([null, null])
  }, [])


  const renderRouteItem = ({ item }) => {

    if (!item.length) return null

    const isSelected = item === currentRoute;
    return (
      <Pressable onPress={() => {
        setCurrentRoute(item);
        setSelectedStation([null, null]);
      }}>
        <View style={{ backgroundColor: isSelected ? 'white' : '#d1d5db', borderBlockColor: 'black' }} className="rounded-md mx-3 p-5">
          <Text style={{ color: isSelected ? 'black' : '#6b7280' }}>{item[0]?.stop.station_name}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 items-center">
      <View>
      <Pressable className="ml-3" onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={15} color="black"/>
      </Pressable>
        <Text className="ml-3 font-semibold mt-3">Current Station:</Text>
        <FlatList
          data={allRoutes}
          renderItem={renderRouteItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="max-h-16 mt-2"
          contentContainerStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        />
      </View>
      <View className="w-full h-2/3 mt-3 items-center ">
        <MapView
          className="w-full h-full"
          initialRegion={{
            latitude: 40.7128,
            longitude: -74.0060,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
        >
          {currentRoute && currentRoute.map((station, index) => (
            <Marker
              key={Math.floor(Math.random() * 10000) + 1}
              coordinate={{
                longitude: station.stop.longitude,
                latitude: station.stop.latitude,
              }}
              onPress={() => setSelectedStation([station.arrivalTime, station.stop.station_name])}
              title={station.stop.station_name}
              pinColor={station.stop.station_name === selectedStation[1] ? 'blue' : 'red'}
            />
          ))}
        </MapView>
      </View>
        <Text className="text-xs text-gray-400">Map Automatically updates every minute</Text>
      {selectedStation[0] &&
      <View className="mt-3 flex h-24 w-4/5 bg-slate-200 p-4 rounded-md items-center">
          <Text>ETA at {selectedStation[1]} Station:</Text>
          <Text className="font-bold mb-2">{new Date(selectedStation[0]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>
          <Pressable className="bg-gray-300 p-1 rounded-sm" onPress={() => navigation.navigate("ChatScreen", {station_name: selectedStation[1], time: selectedStation[0]})}>
            <Text className="text-sm">Explore the station</Text>
          </Pressable>
        </View>
      }
    </SafeAreaView>
  );
};

export default SpecificRoute;
