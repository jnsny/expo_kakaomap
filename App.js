import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import { createDrawerNavigator } from 'react-navigation-drawer';
import { Ionicons } from '@expo/vector-icons';
import Postcode from 'react-native-daum-postcode';
import * as Geo from "expo-location";
import { Component } from "react";

const postMessage = (ref, res = {}) => {
    console.log("postMessage 실행: " + JSON.stringify(res));
    
    try {
        if (! ref) {
            throw new Error("postMessage:: 웹뷰 레퍼런스가 존재하지 않습니다.");
        } else if (!res.name || !res.data) {
            throw new Error("postMessage:: 필수 파라미터가 존재하지 않습니다.");
        }
    } catch(err) {
        console.error(err);
        return;
    }

    ref.postMessage(JSON.stringify(res));
}

const WEBVIEW_NAME_TYPES = {
    GET_GEOLOCATION_POSITIONS: "getGeolocationPostion",
};

export default class App extends Component {
    // const [location, setLocation] = useState(null);
    // const [errorMsg, setErrorMsg] = useState(null);
  
    // 위치정보동의 및 좌표 얻기
    // useEffect(() => {
    //   (async () => {
    //     let { status } = await Location.requestPermissionsAsync();
    //     if (status !== 'granted') {
    //       setErrorMsg('Permission to access location was denied');
    //     }
  
    //     let location = await Location.getCurrentPositionAsync({});
    //     setLocation(location);
    //   })();
    // }, []);
  
    // let text = 'Waiting..';
    // if (errorMsg) {
    //   text = errorMsg;
    // } else if (location) {
    //   text = JSON.stringify(location);
    // }

    handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = ''; 
        
        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
          }
          fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }
     
        console.log(fullAddress);  // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
      }

    // 햄버거 버튼
    // Header =({name, openDrawer})=> (
    //     <View style={styles.header}>
    //       <TouchableOpacity onPress={()=>openDrawer()}>
    //         <Ionicons name="ios-menu" size={32} style={{ marginTop: 20 }} />
    //       </TouchableOpacity>
    //       <Postcode
    //         style={{ width: 200, height: 200 }}
    //         jsOptions={{ animated: true }}
    //         onSelected={(data) => alert(JSON.stringify(data))}
    //       />
    //       <Text style={{width:50}}></Text>
    //     </View>
    //   )

      getGeolocationPosition = async ({ id }) => {
        console.log("getGeolocationPosition 실행");

        const { status } = await Geo.requestPermissionsAsync();

        const {
            coords: { latitude: lat, longitude: lng }
        } = await Geo.getCurrentPositionAsync({});

        // postMessage helper function
        postMessage(this.webref, {
            name: WEBVIEW_NAME_TYPES.GET_GEOLOCATION_POSITIONS,
            id,
            data: {
                lat,
                lng,
            }
        });
    } 

    // 웹뷰에서 보낸 message 데이터를 전달 받는다.
    onWebviewMessage = (e) => {
        console.log("onWebviewMessage 실행");
        
        try {
            const result = JSON.parse(e.nativeEvent.data);
            const { name, data, id } = result;
            console.log("native app: " + JSON.stringify(result));

            if (!this.hasOwnProperty(name)) {
                throw new Error(`${name}을 가진 메서드가 존재하지 않습니다.`);
            }
            this[name](result);
        } catch(err) {
            console.error(err);
        }
    };

    render() {
        return (
            <>
                {/* onMessage 이벤트가 발생하는 조건은 웹뷰에서 [ReactNativeWebView.postMessage]가 실행되어야 함 */}
                {/* <Header name="검색창??" /> */}
                <WebView 
                    ref={(r) => (this.webref = r)}
                    source={{ uri: 'http://bdf0ed7cd842.ngrok.io/assets/resource/map.html' }}
                    style={{ flex: 1 }} 
                    onMessage={this.onWebviewMessage}
                    javaScriptEnabled={true}
                />
                <View style={{ flex: 1 }}>
                    {/* <Text>{text}</Text> */}
                </View>
            </>
        );
    }
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
