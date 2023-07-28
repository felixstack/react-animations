import { StatusBar } from 'expo-status-bar';
import { View as MView } from 'moti';
import * as React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';

import data from './data';

const { width, height } = Dimensions.get('window');
const IMAGE_WIDTH = width * 0.8;
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.36;
const DOT = 8;
const SPACING = 10;
const DOT_INDICATOR = DOT + SPACING;
const TWO_DOT_INDICATORS = DOT_INDICATOR + SPACING;

const DATA = data.slice(0, 10);

export default function Slider() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState('RIGHT');
  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <MView
        animate={{
          backgroundColor: DATA[currentIndex].bg,
        }}
        transition={{ type: 'timing', duration: 2000 }}
        style={[StyleSheet.absoluteFillObject, { opacity: 0.9 }]}
      />
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onMomentumScrollEnd={(ev) => {
          const newIndex = Math.round(ev.nativeEvent.contentOffset.x / width);
          const newDirection = newIndex > currentIndex ? 'RIGHT' : 'LEFT';
          if (newDirection !== direction) {
            setDirection(newDirection);
          }
          setCurrentIndex(newIndex);
        }}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                width,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowRadius: 30,
                shadowOpacity: 0.2,
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
              }}>
              <Image
                source={{ uri: item.image }}
                style={{
                  width: IMAGE_WIDTH,
                  height: IMAGE_HEIGHT,
                  borderRadius: 20,
                }}
              />
            </View>
          );
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          padding: SPACING,
          alignSelf: 'center',
          height: height * 0.1,
        }}>
        <MView
          animate={{
            width: [
              DOT_INDICATOR,
              DOT_INDICATOR + TWO_DOT_INDICATORS,
              DOT_INDICATOR,
            ],
            translateX:
              direction === 'RIGHT'
                ? [
                    (currentIndex - 1) * TWO_DOT_INDICATORS,
                    (currentIndex - 1) * TWO_DOT_INDICATORS,
                    currentIndex * TWO_DOT_INDICATORS,
                  ]
                : // keep the previous currentIndex because width will not change
                  [
                    (currentIndex + 1) * TWO_DOT_INDICATORS,
                    currentIndex * TWO_DOT_INDICATORS,
                    currentIndex * TWO_DOT_INDICATORS,
                  ],
            // borderColor: getContrastYIQ(DATA[currentIndex].bg),
          }}
          transition={{ type: 'timing' }}
          style={{
            position: 'absolute',
            left: DOT_INDICATOR - DOT / 2 + 1,
            top: DOT_INDICATOR / 2 - DOT / 2,
            width: DOT_INDICATOR,
            height: DOT_INDICATOR,
            borderRadius: DOT_INDICATOR,
            borderWidth: 2,
            borderColor: '#000',
          }}
        />
        {DATA.map((item) => {
          return (
            <MView
              animate={
                {
                  // backgroundColor: getContrastYIQ(DATA[currentIndex].bg),
                }
              }
              transition={{ type: 'timing' }}
              key={item.key}
              style={{
                height: DOT,
                width: DOT,
                borderRadius: DOT,
                backgroundColor: '#000',
                marginHorizontal: SPACING,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
