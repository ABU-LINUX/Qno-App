/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Map from '/home/abu/qno/screens/map.js'
import Home from '/home/abu/qno/screens/home.js'
import CheckIn from './screens/chackIn';
import Verify from './screens/verify';
import Wait from './screens/wait';
import Otp from './screens/otp';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { Text, View,Dimensions,  } from 'react-native';
import { color } from 'react-native-elements/dist/helpers';
import Icon2 from 'react-native-vector-icons/dist/Ionicons';
import Profile from './screens/profile';
import Details from './screens/details';
import PInfo from './screens/PInfo';

import { useNavigation } from '@react-navigation/native';
import SaloonInfo from './screens/saloonInfo';
const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();
const width=Dimensions.get('window').width;

const height=Dimensions.get('window').height;

function Qno(){
  const [val,setVal]=useState(null)
  // async function get(){
  //   var x = await AsyncStorage.getItem('checkedIn')
  //   console.log(x===null);
  //   setVal(x);
  //   return false;
  // }
  // get();
  const navigation = useNavigation();
  useEffect(()=>{
    // var x = await AsyncStorage.getItem('checkedIn')
    // console.log(x===null);
    
    // setVal(x);
      setTimeout(()=>{
            navigation.navigate("App")
        
      },1000)
    
    
   
    
  },[])
  return (
    <View style={{alignContent:'center',alignItems:'center',flex:1,backgroundColor:'#00b894',justifyContent:'center'}}>
      <Text style={{fontSize:50,color:'white'}} >
        qno
      </Text>
    </View>
  );
  // return (
  //   get()?<MyStack/>:<Wait/>
  // )
}

export default function MyStack() {
  return (
    <NavigationContainer >
      <Stack.Navigator headerMode='none'>
        <Stack.Screen name="qno" component={Qno} options={{headerShown:false}} />
         <Stack.Screen name="App" component={App} options={{headerShown:false}} />
         
         <Stack.Screen name="verify" component={Verify} options={{headerShown:false}}/>
         <Stack.Screen name="otp" component={Otp} options={{headerShown:false}}/>
         <Stack.Screen name="wait" component={Wait} options={{headerShown:false}}/>
         <Stack.Screen name="details" component={Details} options={{headerShown:false}}/>
         <Stack.Screen name="checkIn" component={CheckIn} options={{headerShown:false}}/>
         <Stack.Screen name="PInfo" component={PInfo} options={{headerShown:false}}/>
         <Stack.Screen name="SaloonInfo" component={SaloonInfo} options={{headerShown:false}}/>
         
      </Stack.Navigator>

    </NavigationContainer>
  );
}
function WaitScreen(){
  return (
    <Wait/>
  );
}
function App() {
  return (
      <View style={{flex:1}}>
        <Tab.Navigator screenOptions={{
        tabBarStyle: { height: height/15,elevation:10,},
        tabBarHideOnKeyboard:true,
        tabBarIndicatorStyle:{backgroundColor:"#00b894"},
        
      }} 
      tabBarPosition='bottom'>
        <Tab.Screen name="Home" component={Home} options={{headerShown:false , tabBarIcon:({color})=>( <Icon2 name="home" color={color} size={30}/>) ,tabBarShowLabel:false,tabBarActiveTintColor:'#00b894'}} />
        <Tab.Screen name="Map" component={Map} options={{headerShown:false , tabBarIcon:({color})=>( <Icon name="search" color={color} size={24}/>) ,tabBarShowLabel:false,tabBarActiveTintColor:'#00b894'}}/>
        <Tab.Screen name="Profile" component={Profile} options={{headerShown:false , tabBarIcon:({color})=>( <Icon name="user" color={color} size={24}/>) ,tabBarShowLabel:false,tabBarActiveTintColor:'#00b894'}}/>
      </Tab.Navigator>
      </View>
      
    


  );
}

