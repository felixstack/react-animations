// Inspiration: https://dribbble.com/shots/14313275--38-Stack-Menu-GIF-99-Days-in-the-Lab

import * as React from 'react';
import {
  StatusBar,
  Dimensions,
  Pressable,
  Image,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import Constants from 'expo-constants';
import { AnimatePresence, MotiView, MotiText } from 'moti';
import { faker } from '@faker-js/faker';
import {
  useFonts,
  Inter_500Medium,
  Inter_700Bold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';
import { Feather } from '@expo/vector-icons';
import { Easing } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
faker.seed(10);

//https://www.flaticon.com/free-icon/unicorn_3468306?term=unicorn&page=1&position=5&page=1&position=5&related_id=3468306&origin=search
const _logo = 'https://cdn-icons-png.flaticon.com/512/3468/3468306.png';
const _color = '#E0BDFC';
const _arrowColor = '#A1E8C3';
const _spacing = 10;
const _logoSize = 80;

const _duration = 1000;
const _delay = 60;
const _logoDelay = _duration * 0.1;

const _menu = [...Array(6).keys()].map(() => {
  return {
    key: faker.datatype.uuid(),
    label: faker.commerce.department(),
  };
});

const _transition = {
  easing: Easing.bezier(0.16, 1, 0.3, 1),
  duration: _duration,
  type: 'timing',
};

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_500Medium,
    Inter_700Bold,
    Inter_900Black,
  });
  const [isVisible, setIsVisible] = React.useState(false);

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Pressable
        onPress={() => {
          setIsVisible((isVisible) => !isVisible);
        }}
        hitSlop={{
          top: 20,
          bottom: 20,
          left: 20,
          right: 20,
        }}
        style={styles.menuButton}>
        <AnimatePresence>
          {isVisible ? (
            <MotiView
              style={{ right: 0, position: 'absolute' }}
              key="x"
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <Feather name="x" size={24} color="black" />
            </MotiView>
          ) : (
            <MotiView
              style={{ right: 0, position: 'absolute' }}
              key="menu"
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <Feather name="menu" size={24} color="black" />
            </MotiView>
          )}
        </AnimatePresence>
      </Pressable>
      <MotiView
        style={{ flex: 1, paddingTop: Constants.statusBarHeight }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{
          ..._transition,
          duration: 0,
          delay: isVisible ? 0 : _duration + _delay,
        }}>
        <MotiView
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: 'rgba(251,240,168, .3)' },
          ]}
          animate={{ translateY: isVisible ? 0 : -height }}
          transition={{
            ..._transition,
            duration: _duration,
            delay: isVisible ? 0 : _duration * 0.3,
          }}
        />
        <MotiView
          style={{
            backgroundColor: _color,
            width: _logoSize,
            height: _logoSize,
            padding: _spacing,
            marginBottom: _spacing * 3,
          }}
          animate={{
            translateY: isVisible ? 0 : -_logoSize * 2,
          }}
          transition={{
            ..._transition,
            delay: _logoDelay,
            duration: _duration,
          }}>
          <Image
            source={{ uri: _logo }}
            style={{ flex: 1, resizeMode: 'contain', padding: _spacing }}
          />
        </MotiView>
        <MotiView style={{ padding: _spacing }}>
          {_menu.map((item, index) => {
            return (
              <MotiView
                animate={{
                  translateY: isVisible ? 0 : 40,
                  opacity: isVisible ? 1 : 0,
                }}
                transition={{
                  ..._transition,
                  delay: isVisible ? index * _delay + _logoDelay * 2 : 0,
                }}>
                <Pressable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: _spacing * 1.5,
                  }}
                  onPress={() => {
                    setIsVisible((isVisible) => !isVisible);
                  }}>
                  <MotiText
                    key={item.key}
                    style={[styles.fontBold, { fontSize: 42, color: '#333' }]}>
                    {item.label}
                  </MotiText>
                  <Feather
                    name="arrow-right"
                    size={24}
                    color={_arrowColor}
                    style={{ marginLeft: _spacing }}
                  />
                </Pressable>
              </MotiView>
            );
          })}
        </MotiView>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: Constants.statusBarHeight,
    right: _spacing * 2,
    zIndex: 1,
    backgroundColor: 'red',
  },
  fontMedium: {
    fontFamily: 'Inter_500Medium',
  },
  fontBold: {
    fontFamily: 'Inter_700Bold',
  },
  fontBlack: {
    fontFamily: 'Inter_900Black',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
