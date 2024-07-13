import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import HomeDisplay from './screen/HomeDisplay'
import Login from './screen/Login'
import RoutesDisplay from './screen/routesDisplay';
import SpecificRoute from './screen/SpecificRoute';
import ChatScreen from './screen/ChatScreen';


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
        <Stack.Screen
          name="SpecificRoute"
          component={SpecificRoute}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
        />        
      </Stack.Navigator>
    </NavigationContainer>
  );
 };

 export default App;
