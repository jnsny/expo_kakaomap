import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import { createDrawerNavigator } from 'react-navigation-drawer';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
  
    // 위치정보동의 및 좌표 얻기
    useEffect(() => {
      (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }, []);
  
    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
    }

    // 햄버거 버튼
    const Header =({name, openDrawer})=> (
        <View style={styles.header}>
          <TouchableOpacity onPress={()=>openDrawer()}>
            <Ionicons name="ios-menu" size={32} />
          </TouchableOpacity>
          <Text>{name}</Text>
          <Text style={{width:50}}></Text>
        </View>
      )

  return (
    <>
        <Header name="별별동네" />
        <WebView 
            source={{ uri: 'http://76971ea24442.ngrok.io/assets/resource/map.html' }} 
            style={{ flex: 1 }} 
        />
        <View style={{ flex: 1 }}>
            <Text>{text}</Text>
            <Text>test</Text>
        </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header:{
    width:"100%",
    height:60,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    paddingHorizontal:20
  }
});
