import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, FlatList, Pressable, ScrollView } from "react-native";
import axios from "axios";
import Icon from 'react-native-vector-icons/FontAwesome';

const baseURL = 'http://127.0.0.1:3000';

const RoutesDisplay = ({ route, navigation }) => {
    const { routeURL, routeCharArr, color, id } = route.params;

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
                        .filter((key) => groupedData[key].routeID == id && groupedData[key].stopUpdates.length > 0)
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
                .filter((key) => data[key].routeID == id && data[key].stopUpdates.length > 0)
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
        <Pressable onPress={() => navigation.navigate("SpecificRoute", { allRoutes: data[item].stopUpdates })}>
            <View className="bg-white p-4 my-2 rounded-lg shadow-md flex flex-row justify-between items-center w-80">
                <Text className="text-lg font-bold">{item}</Text>
                <Icon name="chevron-right" size={15} color="black" />
            </View>
        </Pressable>
    );


    return (
        <SafeAreaView className="flex-1 items-center">
            <View className="flex flex-row my-10 justify-center items-center">
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                    {routeCharArr.map((route, index) => (
                        <Pressable onPress={() => refilterData(route)} key={index}>
                            <View
                                className="h-10 w-10 rounded-full justify-center items-center mx-5"
                                style={{
                                    backgroundColor: selectedRouteId === route
                                        ? (id === '7' ? color[index] : color)
                                        : '#ccc'
                                }}
                            >
                                <Text className="text-white text-lg font-bold">{route}</Text>
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
            {Object.keys(curData).length > 0 ? (
                <FlatList
                    data={Object.keys(curData)}
                    renderItem={renderItem}
                    keyExtractor={(item) => item}
                    contentContainerStyle={{ alignItems: 'center' }}
                />
            ) : (
                <Text className="text-lg font-bold">No current routes</Text>
            )}
        </SafeAreaView>
    );
};

export default RoutesDisplay;
