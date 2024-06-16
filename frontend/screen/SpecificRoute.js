import React, {useState} from 'react';
import MapView, { Marker } from 'react-native-maps';
import {View, Text, SafeAreaView, Pressable, FlatList } from 'react-native';

const SpecificRoute = ({route}) => {

  const { allRoutes } = route.params;

  const [currentRoute, setCurrentRoute] = useState(allRoutes[0])
  const [selectedStation, setSelectedStation] = useState([null, null])

  const renderRouteItem = ({ item }) => {
    const isSelected = item === currentRoute;
    return (
      <Pressable onPress={() => {
        setCurrentRoute(item)
        setSelectedStation([null, null])
      }}>
        <View style={{backgroundColor: isSelected ? 'white' : '#d1d5db', borderBlockColor: 'black'}} className="rounded-md mx-3 p-5">
          <Text style={{ color: isSelected ? 'black' : '#6b7280' }}>{item[0].stop.station_name}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 items-center">
      <View>
        <Text className="ml-3 font-semibold mt-3">Current Station:</Text>
        <FlatList
          data={allRoutes}
          renderItem={renderRouteItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="max-h-16 mt-2"
          contentContainerStyle={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        />
      </View>
      <View className="w-4/5 h-3/5 mt-3 items-center bg-black p-1">
      <MapView
        className="w-full h-full"
        initialRegion={{
          latitude: 40.7128,
          longitude: -74.0060,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {currentRoute.map((station, index) => (
          <Marker
            key={index}
            coordinate={{
              longitude: station.stop.longitude,
              latitude: station.stop.latitude,
            }}
            onPress={() => setSelectedStation([station.arrivalTime, station.stop.station_name])}
            title={station.stop.station_name}
            pinColor={station.stop.station_name === selectedStation[1] ? 'blue' : 'red'}
          >
          </Marker>
        ))}
      </MapView>
      </View>
      {selectedStation &&
        <Pressable onPress={() => console.log(new Date(selectedStation[0]).toString())}>
          <Text>{new Date(selectedStation[0]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>
        </Pressable>
      }
      <View>
        <Text>ASK GPT</Text>
      </View>
    </SafeAreaView>
  );
}

export default SpecificRoute
