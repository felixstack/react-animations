// Inspiration https://dribbble.com/shots/6293853-UI-Challenge-011-Workout-of-the-Day
import * as React from 'react';
import {
  Pressable,
  StatusBar,
  Image,
  ImageBackground,
  Dimensions,
  FlatList,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import Constants from 'expo-constants';
import Animated, {
  Extrapolate,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
const { width, height } = Dimensions.get('window');

import { faker } from '@faker-js/faker';
faker.seed(10);

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const _indicatorSize = 4;
const _spacing = 14;
const _buttonSize = 64;

const _data = [...Array(6).keys()].map((i) => ({
  key: faker.datatype.uuid(),
  title: faker.company.catchPhrase(),
  description: faker.company.bs(),
  duration: faker.datatype.number({ min: 1, max: 7 }) * 5,
  image: `https://source.unsplash.com/random/${i}`,
}));

const Details = ({ scrollY, item, index }) => {
  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [index - 1, index, index + 1],
        [0, 1, 0],
        Extrapolate.CLAMP
      ),
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [index - 1, index, index + 1],
            [20, 0, -20],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });
  return (
    <View
      style={[
        {
          position: 'absolute',
          width: '100%',
          zIndex: _data.length - index,
          overflow: 'hidden',
        },
      ]}>
      <Animated.View style={stylez}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.duration}>{item.duration} min</Text>
      </Animated.View>
    </View>
  );
};
const DetailsWrapper = ({ scrollY, data }) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        top: '60%',
        alignItems: 'center',
        left: _spacing * 2 + _indicatorSize,
        right: _spacing,
      }}
      pointerEvents="none">
      {data.map((item, index) => {
        return <Details item={item} index={index} scrollY={scrollY} />;
      })}
    </View>
  );
};

const Item = ({ item, index }) => {
  return (
    <ImageBackground
      source={{ uri: item.image }}
      style={{ width, height, backgroundColor: '#000' }}
      imageStyle={{ flex: 1, resizeMode: 'cover', opacity: 0.7 }}
    />
  );
};

const PaginationDot = ({ scrollY, index }) => {
  const stylez = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [index - 1, index, index + 1],
        [_indicatorSize, _indicatorSize * 6, _indicatorSize],
        Extrapolate.CLAMP
      ),
    };
  });
  return (
    <Animated.View
      style={[
        {
          width: _indicatorSize,
          height: _indicatorSize,
          borderRadius: _indicatorSize / 2,
          backgroundColor: 'white',
          marginBottom: _indicatorSize / 2,
        },
        stylez,
      ]}
    />
  );
};

const Pagination = ({ scrollY, data }) => {
  return (
    <View style={{ position: 'absolute', left: _spacing }}>
      {data.map((_, index) => {
        return <PaginationDot index={index} scrollY={scrollY} />;
      })}
    </View>
  );
};

export default function App() {
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (ev) => {
      scrollY.value = ev.contentOffset.y / height;
    },
    onMomentumEnd: (ev) => {
      scrollY.value = Math.floor(ev.contentOffset.y / height);
    },
  });
  return (
    <View style={styles.container}>
      <AnimatedFlatList
        data={_data}
        renderItem={(props) => <Item {...props} />}
        onScroll={onScroll}
        scrollEventThrottle={16}
        pagingEnabled
        decelerationRate="fast"
        bounces={false}
      />
      <Pagination scrollY={scrollY} data={_data} />
      <DetailsWrapper scrollY={scrollY} data={_data} />
      <Pressable
        onPress={() => {
          console.log(scrollY.value);
        }}
        style={{
          position: 'absolute',
          bottom: _spacing * 4,
          right: _spacing * 2,
        }}>
        <View
          style={{
            width: _buttonSize,
            height: _buttonSize,
            borderRadius: _buttonSize / 2,
            backgroundColor: '#FA6301',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MaterialIcons
            name="arrow-right-alt"
            size={_buttonSize / 2}
            color="white"
          />
        </View>
      </Pressable>
      <StatusBar hidden />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 32,
    marginBottom: _spacing / 2,
  },
  description: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: _spacing / 2,
  },
  duration: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
