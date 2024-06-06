import {useState, useEffect} from 'react'
import { View, Text, Pressable } from "react-native";
import axios from 'axios'

//base url for local calling
const baseURL = 'http://127.0.0.1:3000';

export default function HomeDisplay() {

    const [data, setData] = useState([]);

    const getData = () => {
        axios.get(`${baseURL}/subway/ACE`)
        .then(response => {
            setData(response.data)
        })
        .catch(error => {
            console.log(error)
        })
    }
    useEffect(() => {
        getData();
    }, []);

    return(
        <View className="flex-1 justify-center items-center">
            <Text>HI</Text>
            <Pressable onPress={() => console.log(data)}>
                <Text>Press Here!</Text>
            </Pressable>
        </View>
    )
}