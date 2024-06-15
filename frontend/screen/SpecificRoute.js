import React, {useState} from 'react';
import MapView, { Marker } from 'react-native-maps';
import {View, Text, SafeAreaView, Pressable } from 'react-native';

const SpecificRoute = ({route}) => {

  const { allRoutes } = route.params;

  const [currentRoute, setCurrentRoute] = useState(allRoutes[0])

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Pressable onPress={() => {
        console.log(currentRoute)
      }}>
        <Text>PRESS</Text>
      </Pressable>
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
            title={station.stop.station_name}
          >
          </Marker>
        ))}
      </MapView>
    </SafeAreaView>
  );
}

export default SpecificRoute
