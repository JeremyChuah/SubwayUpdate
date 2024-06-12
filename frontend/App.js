import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import HomeDisplay from './screen/HomeDisplay'
import Login from './screen/Login'
import RoutesDisplay from './screen/routesDisplay';


const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {/* <Stack.Screen
          name="Login"
          component={Login}
        /> */}
        <Stack.Screen
          name="Home"
          component={HomeDisplay}
        />
        <Stack.Screen
          name="Routes"
          component={RoutesDisplay}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
 };

 export default App;
