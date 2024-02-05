import * as React from 'react';
import {
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const COLS = 15;
const { width, height } = Dimensions.get('window');
const _circleBoxSize = width / COLS;
const ROWS = Math.round(height / _circleBoxSize);
const dots = [...Array(ROWS).keys()].map((rowIndex) =>
  [...Array(COLS).keys()].map((colIndex) => ({
    key: rowIndex * COLS + colIndex,
    row: rowIndex,
    col: colIndex,
  }))
);

const distances = ['Manhattan', 'Euclidian', 'Chebyshev'];
const _distanceIndex = 1;


function distanceAlgo(X1: number = 0, Y1: number = 0, X2: number = 0, Y2: number = 0) {
  'worklet';
  const distanceX = X2 - X1;
  const distanceY = Y2 - Y1;
  // console.log('Manhattan distance:')
  // Diamond. Because the diagonal neighbors are not taken into account.
  /*
    4 3 2 3 4
    3 2 1 2 3
    2 1 0 1 2
    3 2 1 2 3
    4 3 2 3 4
  */
  if (_distanceIndex === 0) {
    // Manhattan distance
    return Math.abs(X1 - X2) + Math.abs(Y1 - Y2);
  }
  if (_distanceIndex === 1) {
    // Euclidian distance
    return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  }

  if (_distanceIndex === 2) {
    // Chebyshev distance
    return Math.max(Math.abs(X1 - X2), Math.abs(Y1 - Y2));
  }
}
const _staggerDelay = 60;
type DotProps = {
  dot: typeof dots[0][0];
  fromIndex: SharedValue<typeof dots[0][0]>;
};

const Dot = ({ dot, fromIndex }: DotProps) => {
  const d = useSharedValue(-1);
  const prevKey = useSharedValue(-1);

  const distance = useDerivedValue(() => {
    return distanceAlgo(
        fromIndex.value.col,
        fromIndex.value.row,
        dot.col,
        dot.row
      ) * _staggerDelay;

  })

  const stylez = useAnimatedStyle(() => {
    // if (prevKey.value !== fromIndex.value.key) {
    //   prevKey.value = fromIndex.value.key;
    //   d.value = distance * _staggerDelay;
    console.log(fromIndex.value.key);
    // }
    // const distance =
    //   distanceAlgo(
    //     fromIndex.value.col,
    //     fromIndex.value.row,
    //     dot.col,
    //     dot.row
    //   ) * _staggerDelay;
    // const _delay = distance * _staggerDelay;

    const scale = withDelay(
      distance.value,
      withSequence(
        withTiming(1, { duration: _staggerDelay * 5 }),
        withTiming(0.3, { duration: _staggerDelay * 3 })
      )
    );
    const color = withDelay(
      distance.value,
      withSequence(
        withTiming(1.0, { duration: _staggerDelay * 3 }),
        withTiming(0.2, { duration: _staggerDelay * 3 })
      )
    );
    return {
      opacity: color,
      transform: [
        {
          scale: scale,
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[styles.dot, stylez]}
      removeClippedSubviews
      renderToHardwareTextureAndroid
    />
  );
};

export default function App() {
  // const { width } = useWindowDimensions();
  const fromIndex = useSharedValue(
    dots[Math.round(ROWS / 2)][Math.round(COLS / 2)]
  );

  return (
    <View style={styles.container}>
      {dots.map((row, rowIndex) => {
        return (
          <View style={{ flexDirection: 'row' }} key={rowIndex}>
            {row.map((dot) => {
              return (
                <Pressable
                  key={dot.key.toString()}
                  onPress={() => {
                    // isPressActive.value = false;
                    fromIndex.value = dot;
                    console.log(fromIndex.value);
                  }}>
                  {/* <View
                    style={{
                      width: width / COLS,
                      height: width / COLS,
                      justifyContent: 'center',
                      alignItems: 'center',
                      // backgroundColor: 'rgba(0,0,0,0.1)',
                      // borderWidth: 1,
                      // borderColor: 'white',
                    }}
                  > */}
                  <Dot dot={dot} fromIndex={fromIndex} />
                  {/* </View> */}
                </Pressable>
              );
            })}
          </View>
        );
      })}
      <View
        style={{
          position: 'absolute',
          top: 40,
          right: -8,
          backgroundColor: '#444',
          padding: 4,
          borderRadius: 8,
          paddingHorizontal: 8,
          paddingRight: 16,
          alignItems: 'flex-end',
        }}>
        <Text
          style={{
            fontFamily: 'Menlo',
            fontSize: 11,
            fontWeight: '700',
            color: 'gold',
          }}>
          <Text style={{opacity: .6, fontWeight: '300'}}>No. of views: </Text>{ROWS * COLS}
        </Text>
        <Text
          style={{
            fontFamily: 'Menlo',
            fontSize: 11,
            color: 'gold',
            fontWeight: '700',
          }}>
          <Text style={{opacity: .6, fontWeight: '300'}}>Distance: </Text>{distances[_distanceIndex]}
        </Text>
        <Text
          style={{
            fontFamily: 'Menlo',
            fontSize: 11,
            color: 'gold',
            opacity: 0.6,
          }}>
          @mironcatalin
        </Text>
      </View>
      <StatusBar hidden />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: '#333',
  },
  dot: {
    width: 10,
    height: 10,
    margin: _circleBoxSize / 2 - 5,
    borderRadius: 10,
    backgroundColor: 'gold',
  },
});
