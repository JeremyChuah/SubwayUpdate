import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, FlatList, Pressable } from "react-native";
import axios from "axios";

const baseURL = 'http://127.0.0.1:3000';

const RoutesDisplay = ({ route }) => {
    const { routeURL } = route.params;

    const [data, setData] = useState(null);

    const getData = () => {
        axios.get(`${baseURL}/subway/${routeURL}`)
            .then(response => {
                const groupedData = {};

                response.data.forEach(item => {
                    const lastStation = item.last_station;
                    if (!groupedData[lastStation]) {
                        groupedData[lastStation] = {
                            stopUpdates: []
                        };
                    }
                    if (item.stopUpdates.length > 0) {
                        groupedData[lastStation].stopUpdates.push(item.stopUpdates);
                    }
                });
                setData(groupedData);
            })
            .catch(error => {
                console.log(error);
            });
    };

    useEffect(() => {
        getData();
    }, []);

    if (!data) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    const renderItem = ({ item }) => (
        <View
            className="w-80 bg-white p-4 my-2 rounded-lg shadow-lg"
        >
            <Text className="text-lg font-bold">{item}</Text>
            <Pressable onPress={() => {console.log(data[item].stopUpdates.length)}}>
                <Text>PRESS</Text>
            </Pressable>
        </View>
    );

    return (
        <SafeAreaView className="flex-1">
            <FlatList
                data={Object.keys(data)}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                contentContainerStyle={{ alignItems: 'center' }}
            />
        </SafeAreaView>
    );
};

export default RoutesDisplay;
