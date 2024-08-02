import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, Pressable } from "react-native";
import axios from 'axios';


export default function HomeDisplay({ navigation }) {

    const data = [
        { id: '1', color: '#0039A6', endpoint: 'ace', routes: ['A', 'C', 'E'] },
        { id: '2', color: '#FF6319', endpoint: 'bdfm', routes: ['B', 'D', 'F', 'M'] },
        { id: '3', color: '#6CBE45', endpoint: 'g', routes: ['G'] },
        { id: '4', color: '#996633', endpoint: 'jz', routes: ['J', 'Z'] },
        { id: '6', color: '#FCCC0A', endpoint: 'nqrw', routes: ['N', 'Q', 'R', 'W'] },
        { id: '7', color: ['#EE352E', '#EE352E', '#EE352E','#00933C', '#00933C','#00933C', '#B933AD'], endpoint: 'nums', routes: ['1', '2', '3', '4', '5', '6', '7'] },
    ];

    const goToCorrectRoute = (route, arr, color, id) => {
        navigation.navigate('Routes', { routeURL: route, routeCharArr: arr, color: color, id: id })
    }

    const renderItem = ({ item }) => (
        <Pressable onPress={() => goToCorrectRoute(item.endpoint, item.routes, item.color, item.id)}>
            <View className="my-4 bg-gray-200 p-3 rounded-lg shadow-lg">
                <View className="flex-row justify-center items-center flex-wrap">
                    {item.routes.map((route, index) => (
                        <View
                            key={index}
                            className="h-10 w-10 rounded-full justify-center items-center mr-3 mb-3"
                            style={{
                                backgroundColor: item.id === '7' ? item.color[index] : item.color
                            }}
                        >
                            <Text className="text-white text-lg font-bold">{route}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </Pressable>

    );

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 items-center mt-10">
                <Text className="text-2xl font-bold">All Routes</Text>
                <View className="h-4/5 mt-10 w-5/6">
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
