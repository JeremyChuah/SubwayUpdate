import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, FlatList, Pressable, Button } from "react-native";
import axios from "axios";

const baseURL = 'http://127.0.0.1:3000';

const RoutesDisplay = ({ route }) => {
    const { routeURL, routeCharArr, color } = route.params;

    const [data, setData] = useState(null);
    const [curData, setCurData] = useState(null);
    const [selectedRouteId, setSelectedRouteId] = useState(null);

    const getData = (id) => {
        axios.get(`${baseURL}/subway/${routeURL}`)
            .then(response => {
                // console.log(response.data)
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
                        groupedData[lastStation].routeID = item.routeId;
                    }
                });
                setData(groupedData);

                const filteredById =
                    Object.keys(groupedData)
                        .filter((key) => groupedData[key].routeID == id)
                        .reduce((obj, key) => {
                            obj[key] = groupedData[key]
                            return obj
                        }, {});

                setCurData(filteredById);
                setSelectedRouteId(id);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const refilterData = (id) => {
        const filteredById =
            Object.keys(data)
                .filter((key) => data[key].routeID == id)
                .reduce((obj, key) => {
                    obj[key] = data[key]
                    return obj
                }, {});

        setCurData(filteredById);
        setSelectedRouteId(id);
    }

    useEffect(() => {
        getData(routeCharArr[0]);
    }, []);

    if (!curData) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    const renderItem = ({ item }) => (
        <View
            className="w-80 bg-white p-4 my-2 rounded-lg shadow-md"
        >
            <Text className="text-lg font-bold">{item}</Text>
            <Pressable onPress={() => { console.log(data[item].stopUpdates.length) }}>
                <Text>PRESS</Text>
            </Pressable>
        </View>
    );


    return (
        <SafeAreaView className="flex-1 justify-center items-center">
            {/* <Button onPress={() => console.log(curData)} title="HI"></Button> */}
            <View className="flex flex-row my-10 justify-center items-center">
                {routeCharArr.map((route, index) => (
                    <View
                        key={index}
                        className="h-10 w-10 rounded-full justify-center items-center mx-10"
                        style={{ backgroundColor: selectedRouteId === route ? color : '#ccc' }}
                    >
                        <Pressable onPress={() => refilterData(route)}>
                            <Text className="text-white text-lg font-bold">{route}</Text>
                        </Pressable>
                    </View>
                ))}
            </View>
            <FlatList
                data={Object.keys(curData)}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                contentContainerStyle={{ alignItems: 'center' }}
            />
        </SafeAreaView>
    );
};

export default RoutesDisplay;
