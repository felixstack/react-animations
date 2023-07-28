import * as React from 'react';
import {
  Platform,
  Dimensions,
  Image,
  FlatList,
  Text,
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';
import faker from 'faker';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { FlingGestureHandler, Directions } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import images from './data';
const { width, height } = Dimensions.get('window');

faker.seed(1);
const _data = images.map((image) => {
  return {
    key: faker.datatype.uuid(),
    image,
    name: faker.commerce.product(),
  };
});
const _itemWidth = width * 0.8;
const _itemHeight = _itemWidth * 1.1;
const _scaleFactor = 0.2;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Item = ({ item, index, scrollY }) => {
  const v = useDerivedValue(() => {
    return (scrollY.value / _itemHeight) * 2;
  });
  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            v.value,
            [index - 1, index, index + 1, index + 2],
            [3, 1, 1 - _scaleFactor, 1 - _scaleFactor * 2]
            // Extrapolate.CLAMP
          ),
        },
        // {
        //   translateY: interpolate(
        //     v.value,
        //     [index - 1, index, index + 1],
        //     [-100, 0, (1-_scaleFactor) * _itemHeight],
        //   ),
        // },
      ],
      opacity: interpolate(
        v.value,
        [index - 1, index, index + 1, index + 2],
        [0, 1, 0.85, 0.7]
      ),
    };
  });
  return (
    <Animated.View
      style={[stylez, { justifyContent: 'center', alignItems: 'center' }]}>
      <Image
        source={{ uri: item.image }}
        style={{
          width: _itemWidth,
          height: _itemHeight,
          resizeMode: 'contain',
        }}
      />
    </Animated.View>
  );
};

export default function App() {
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((ev) => {
    scrollY.value = ev.contentOffset.y;
  });
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <FlingGestureHandler direction={Directions.DOWN}>
        <FlingGestureHandler direction={Directions.UP}>
          <AnimatedFlatList
            data={_data}
            keyExtractor={(item) => item.key}
            decelerationRate="fast"
            scrollEventThrottle={16}
            snapToInterval={_itemHeight / 2}
            snapToEnd
            onScroll={onScroll}
            style={{}}
            contentContainerStyle={{
              paddingTop: height - _itemHeight,
              ...(Platform.OS !== 'web' && {
                height:
                  _itemHeight * (_data.length + 1) * 0.5 + height - _itemHeight,
              }),
            }}
            CellRendererComponent={({ style, index, children, ...props }) => {
              return (
                <View
                  style={[
                    style,
                    {
                      // position: 'absolute',
                      bottom: (_itemHeight / 2) * index,
                    },
                  ]}
                  index={index}
                  {...props}>
                  {children}
                </View>
              );
            }}
            renderItem={(props) => {
              return <Item {...props} scrollY={scrollY} />;
            }}
          />
        </FlingGestureHandler>
      </FlingGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  item: {
    position: 'absolute',
  },
});
