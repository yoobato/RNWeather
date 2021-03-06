import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const API_KEY = '1bb6464b0927a02116e40ef6bccac8cf';

const icons = {
  'Clouds': 'cloudy',
  'Clear': 'day-sunny',
  'Atmosphere': 'cloudy-gusts',
  'Snow': 'snow',
  'Rain': 'rains',
  'Drizzle': 'rain',
  'Thunderstorm': 'lightning',
};

export default function App() {
  const [city, setCity] = useState('Loading...');
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }

    const { 
      coords: { latitude, longitude } 
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0].city);

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style='light' />

      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>

      {/* TODO: ok가 false(location 권한 없음)면 우는 얼굴(?) 보여주자 */}

      {/* scrollView는 style대신에 contentContainerStyle을 쓴다. */}
      {/* scrollView에서는 flex를 써줄 필요가 없다. */}
      <ScrollView 
        contentContainerStyle={styles.weather} 
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {days.length === 0 ? (
          // 아래처럼 쓰면 기존 style에 새로운 style을 추가할 수 있다.
          <View style={{ ...styles.day, alignItems: 'center' }}>
            <ActivityIndicator 
              color='white' 
              size='large' 
              style={{ marginTop: 10 }} 
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Fontisto name={icons[day.weather[0].main]} size={68} color='white' />
              </View>

              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato'
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 68,
    fontWeight: '500',
    color: 'white',
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  temp: {
    marginTop: 50,
    fontSize: 100,
    fontWeight: '600',
    color: 'white',
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: 'white',
    fontWeight: '500',
  },
  tinyText: {
    marginTop: -5,
    fontSize: 25,
    color: 'white',
    fontWeight: '500',
  },
});
