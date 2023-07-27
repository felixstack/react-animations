// Inspiration: https://screenlane.com/post/ios/waze/

import * as React from 'react';
import {
  SafeAreaView,
  StatusBar,
  Dimensions,
  FlatList,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import Constants from 'expo-constants';
import data from './data';
const { height, width } = Dimensions.get('window');

const _itemHeight = Math.floor(height / 8);
const _arriveBySize = 0.5;
const _spacing = 8;

import Animated, {
  Extrapolate,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
} from 'react-native-reanimated';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Hour = React.memo(({ item, scrollY, index }) => {
  const stylez = useAnimatedStyle(() => {
    // const midIndex = scrollY.value < height / 2 ? index : index - 6;
    const midIndex = index;
    return {
      opacity: interpolate(
        scrollY.value,
        [
          (midIndex - 0.8) * _itemHeight,
          midIndex * _itemHeight,
          (midIndex + 0.8) * _itemHeight,
        ],
        [0, 1, 0]
      ),
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [
              (midIndex - 0.8) * _itemHeight,
              midIndex * _itemHeight,
              (midIndex + 0.8) * _itemHeight,
            ],
            [-_itemHeight * 0.6, 0, _itemHeight * 0.6]
          ),
        },
      ],
    };
  });

  const lineStylez = useAnimatedStyle(() => {
    const midIndex = index;
    return {
      opacity: interpolate(
        scrollY.value,
        [
          (midIndex - 1) * _itemHeight,
          midIndex * _itemHeight,
          (midIndex + 1) * _itemHeight,
        ],
        [0, 1, 0]
      ),
    };
  });
  const duration = `${Math.floor(item.duration / 60)}:${
    item.duration % 60
  } h drive`;
  return (
    <View style={{ flexDirection: 'row', height: _itemHeight }}>
      <View style={styles.left}>
        <Text style={styles.arriveText}>{item.arriveAt}</Text>
      </View>
      <Animated.View
        style={[
          {
            paddingHorizontal: _spacing * 3,
            alignItems: 'flex-start',
            flex: 1,
            justifyContent: 'center',
            backgroundColor: '#ecf0f1',
          },
          stylez,
        ]}>
        <Text style={[styles.arriveText, { textAlign: 'right' }]}>
          {duration}
        </Text>
        <Text>leave by {item.departAt}</Text>
        <Animated.View
          style={[
            {
              backgroundColor: '#d0d0d0',
              width: 10,
              height: 10,
              position: 'absolute',
              left: -Math.sqrt(10 * 2),
              transform: [{ rotate: '45deg' }],
            },
          ]}
        />
      </Animated.View>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: 'rgba(0,0,0,0.05)' },
          lineStylez,
        ]}
      />
    </View>
  );
});

export default function App() {
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((ev) => {
    scrollY.value = ev.contentOffset.y;
  });
  const headerStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: interpolate(
        scrollY.value,
        [0, height / 2 - _itemHeight / 2, height / 2],
        [0, 0, 0.2],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <AnimatedFlatList
        data={data}
        keyExtractor={(item) => item.key}
        stickyHeaderIndices={[0]}
        bounces={false}
        snapToInterval={_itemHeight}
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottl={16}
        contentContainerStyle={{
          paddingVertical:
            (height - Constants.statusBarHeight) / 2 - _itemHeight / 2,
        }}
        ListHeaderComponent={() => {
          return (
            <Animated.View style={[styles.listHeader, headerStyle]}>
              <View style={styles.left}>
                <Text style={[styles.arriveText]}>Arrive by</Text>
              </View>
              <View style={styles.right}>
                <Text style={{ flex: 1, fontSize: 16, textAlign: 'right' }}>
                  Traffic
                </Text>
              </View>
            </Animated.View>
          );
        }}
        renderItem={({ item, index }) => {
          return <Hour item={item} index={index} scrollY={scrollY} />;
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  left: {
    backgroundColor: '#d0d0d0',
    width: '35%',
    padding: _spacing,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    backgroundColor: '#ecf0f1',
    flex: 1,
    alignItems: 'flex-end',
    padding: _spacing,
  },
  arriveText: {
    color: 'rgba(0,0,0,0.7)',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  listHeader: {
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
  },
});
