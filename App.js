import React, { Component } from "react";
import { View, Text } from "react-native";
import { WebView } from "react-native-webview";
import * as Geo from "expo-location";

const postMessage = (ref, res = {}) => {
  try {
    if (!ref) {
      throw new Error("postMessage:: 웹뷰 레퍼런스가 존재하지 않습니다.");
    } else if (!res.name || !res.data) {
      throw new Error("postMessage:: 필수 파라미터가 존재하지 않습니다.");
    }
  } catch (err) {
    console.error(err);
    return;
  }

  ref.postMessage(JSON.stringify(res));
};

const WEBVIEW_NAME_TYPES = {
  GET_GEOLOCATION_POSITION: "getGeolocationPosition",
};

export default class App extends Component {

  // 현재 좌표를 webview에게 전달하는 메서드
  getGeolocationPosition = async ({ id }) => {
    const { status } = await Geo.requestPermissionsAsync();
    if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
    }

    const {
      coords: { latitude: lat, longitude: lng },
    } = await Geo.getCurrentPositionAsync({});

    postMessage(this.webref, {
      name: WEBVIEW_NAME_TYPES.GET_GEOLOCATION_POSITION,
      id,
      data: {
        lat,
        lng,
      },
    });
  };

  // webview에서 전달한 데이터를 받는 메서드
  onWebviewMessage = (e) => {
    try {
      const result = JSON.parse(e.nativeEvent.data);
      const { name, data, id } = result;
      if (!this.hasOwnProperty(name)) {
        throw new Error(`${name}을 가진 메서드가 존재하지 않습니다.`);
      }
      this[name](result);
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return (
        <>
            <WebView
                ref={(r) => (this.webref = r)}
                style={{ flex: 1 }} 
                source={{ uri: "http://192.168.35.237:3333" }}
                onMessage={this.onWebviewMessage}
                javaScriptEnabled={true}
            />
            <View style={{ flex: 1 }}>
                <Text>네이티브 컴포넌트</Text>
            </View>
        </>
    );
  }
}