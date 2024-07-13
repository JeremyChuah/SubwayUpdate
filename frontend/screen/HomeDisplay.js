import React, { useState, useEffect } from 'react';
import { View, Text, FlatList,SafeAreaView, Pressable } from "react-native";
import axios from 'axios';


export default function HomeDisplay({navigation}) {

    const data = [
        { id: '1', color: '#0039A6', endpoint: 'ace', routes: ['A', 'C', 'E'] },
        { id: '2', color: '#FF6319', endpoint: 'bdfm', routes: ['B', 'D', 'F', 'M'] },
        { id: '3', color: '#6CBE45', endpoint: 'g', routes: ['G'] },
        { id: '4', color: '#996633', endpoint: 'jz', routes: ['J', 'Z'] },
        { id: '6', color: '#FCCC0A', endpoint: 'nqrw', routes: ['N', 'Q', 'R', 'W'] },
        { id: '7', color: '#FF6319', endpoint: 'bdfm', routes: ['B', 'D', 'F', 'M'] },
    ];

    const goToCorrectRoute = (route, arr, color) => {
        navigation.navigate('Routes', {routeURL: route, routeCharArr: arr, color: color})
    }

    const renderItem = ({ item }) => (
        <Pressable onPress={() => goToCorrectRoute(item.endpoint, item.routes, item.color)}>
            <View className="flex-row justify-center items-center my-4 bg-gray-200 p-3 rounded-lg shadow-lg">
                {item.routes.map((route, index) => (
                        <View
                            key={index}
                            className="h-10 w-10 rounded-full justify-center items-center mr-3"
                            style={{backgroundColor: item.color}}
                        >
                            <Text className="text-white text-lg font-bold">{route}</Text>
                        </View>
                ))}
            </View>
        </Pressable>
    );

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 items-center mt-10">
                <Text className="text-2xl font-bold">All Routes</Text>
                <View className="h-4/5 mt-10 w-5/6">
                    <FlatList
                        showsVerticalScrollIndicator = {false}
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
