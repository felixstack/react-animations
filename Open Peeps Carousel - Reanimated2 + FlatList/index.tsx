// Inspiration: https://dribbble.com/shots/16489827-Sports-tracker-mobile-app

import * as React from 'react';
import {
  Image,
  FlatList,
  Text,
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import Constants from 'expo-constants';
import data from './data';
import faker from 'faker';
import Animated, {
  Extrapolate,
  interpolate,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
import {
  useFonts,
  PTSerif_400Regular,
  PTSerif_700Bold,
} from '@expo-google-fonts/pt-serif';
import AppLoading from 'expo-app-loading';
import { useDynamicAnimation, MotiView } from 'moti';

const { width, height } = Dimensions.get('window');

const headings = [
  'Open Peeps',
  'A hand-drawn \nillustration library.',
  'Mix & Match.',
  'Designed by \nPablo Stanley.',
  'Inspired by \nTaras Migulko.',
  'Developed by \nCatalin Miron.',
];

faker.seed(123);
const _data = faker.helpers.shuffle(data).slice(0, headings.length);
const _dotSize = 8;
// const _data = data.slice(0, headings.length)
const random = () => {
  return ((Math.random() > 0.5 ? -1 : 1) * Math.random() * width) / 2;
};

const randomBorder = () => {
  return Math.floor(Math.random() * 14) + 4;
};

const Item = ({ item, index, scrollX }) => {
  const style = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollX.value / width,
        [index - 0.6, index, index + 0.6],
        [0, 1, 0]
      ),
    };
  });
  return (
    <View style={{ width, height: height / 2 }}>
      <Animated.Image
        source={{ uri: item }}
        style={[{ flex: 1, resizeMode: 'contain' }, style]}
      />
    </View>
  );
};

const TextItem = ({ index, heading, scrollX }) => {
  const style = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollX.value / width,
        [index - 0.8, index, index + 0.8],
        [0, 1, 0]
      ),
      transform: [
        {
          translateX: interpolate(
            scrollX.value / width,
            [index - 0.8, index, index + 0.8],
            [10, 0, -10]
          ),
        },
      ],
    };
  });
  return (
    <Animated.Text
      key={index}
      style={[
        {
          fontFamily: 'PTSerif_700Bold',
          position: 'absolute',
          fontSize: index === 0 ? 42 : 28,
        },
        style,
      ]}>
      {heading}
    </Animated.Text>
  );
};

const PaginationDot = ({ index, scrollX }) => {
  const style = useAnimatedStyle(() => {
    return {
      width: interpolate(
        scrollX.value / width,
        [index - 1, index, index + 1],
        [_dotSize * 1.5, _dotSize * 3, _dotSize * 1.5],
        Extrapolate.CLAMP
      ),
      opacity: interpolate(
        scrollX.value / width,
        [index - 1, index, index + 1],
        [0.2, 1, 0.2],
        Extrapolate.CLAMP
      ),
    };
  });
  return (
    <Animated.View
      style={[
        {
          width: _dotSize,
          height: _dotSize,
          borderRadius: _dotSize,
          backgroundColor: '#000',
          marginHorizontal: _dotSize / 2,
        },
        style,
      ]}
    />
  );
};

const Pagination = ({ data, scrollX }) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: height * 0.1,
        left: 20,
        flexDirection: 'row',
      }}>
      {data.map((_, index) => (
        <PaginationDot index={index} scrollX={scrollX} />
      ))}
    </View>
  );
};

const Circle = ({ animation }) => {
  return (
    <MotiView
      state={animation}
      transition={{
        stiffness: 50,
      }}
      style={[
        {
          width: width * 0.8,
          height: width * 0.8,
          borderRadius: width,
          borderWidth: 4,
          borderColor: 'rgba(0,0,0,1)',
          position: 'absolute',
        },
      ]}
    />
  );
};

const Circles = ({ scrollX, first, second, third }) => {
  return (
    <View style={{ position: 'absolute', top: height * 0.1 }}>
      <Circle animation={first} />
      <Circle animation={second} />
      <Circle animation={third} />
    </View>
  );
};

export default function App() {
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((ev) => {
    scrollX.value = ev.contentOffset.x;
  });

  let [fontsLoaded] = useFonts({
    PTSerif_400Regular,
    PTSerif_700Bold,
  });

  const first = useDynamicAnimation(() => ({
    translateX: random(),
    translateY: random(),
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.8,
    borderWidth: randomBorder(),
  }));

  const second = useDynamicAnimation(() => ({
    translateX: random(),
    translateY: random(),
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.8,
    borderWidth: randomBorder(),
  }));
  const third = useDynamicAnimation(() => ({
    translateX: random(),
    translateY: random(),
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.8,
    borderWidth: randomBorder(),
  }));

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Circles first={first} second={second} third={third} />
      <AnimatedFlatList
        data={_data}
        keyExtractor={(item) => item}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        bounces={false}
        onMomentumScrollEnd={(ev) => {
          const newSize = width * 0.5 + Math.random() * width * 0.5;
          const newSize2 = width * 0.5 + Math.random() * width * 0.5;
          const newSize3 = width * 0.5 + Math.random() * width * 0.5;
          first.animateTo({
            translateX: random(),
            translateY: random(),
            width: newSize,
            height: newSize,
            borderRadius: newSize,
            borderWidth: randomBorder(),
          });
          second.animateTo({
            translateX: random(),
            translateY: random(),
            width: newSize2,
            height: newSize2,
            borderRadius: newSize2,
            borderWidth: randomBorder(),
          });
          third.animateTo({
            translateX: random(),
            translateY: random(),
            width: newSize3,
            height: newSize3,
            borderRadius: newSize3,
            borderWidth: randomBorder(),
          });
        }}
        renderItem={({ item, index }) => {
          return <Item item={item} index={index} scrollX={scrollX} />;
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: height * 0.3,
          left: 20,
          width: width * 0.7,
        }}>
        {headings.map((heading, index) => (
          <TextItem index={index} scrollX={scrollX} heading={heading} />
        ))}
      </View>
      <Pagination data={_data} scrollX={scrollX} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
