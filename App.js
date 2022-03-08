import React from 'react';
import { View } from 'react-native';

export default function App() {
  return (
    // 기본적으로 모든 View는 display: flex, flexDirection: column;
    <View style={{ flex: 1 }}>
      {/* width, height를 사용하지 않고 비율을 사용. 아래는 1:2:1 비율 */}
      <View style={{ flex: 1, backgroundColor: "tomato" }}></View>
      <View style={{ flex: 2, backgroundColor: "teal" }}></View>
      <View style={{ flex: 1, backgroundColor: "orange" }}></View>
    </View>
  );
}
