// Inspiration: https://dribbble.com/shots/5341441-MasterClass-Onboarding
// + https://dribbble.com/shots/6702678-Find-a-random-article-on-Wikipedia
import * as React from 'react';
import { Text, View, StyleSheet, StatusBar, Dimensions, Pressable } from 'react-native';
import Constants from 'expo-constants';
import { faker } from '@faker-js/faker';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
} from 'react-native-reanimated';
import {
  FlingGestureHandler,
  Directions,
  State,
  PanGestureHandler,
  ScrollView
} from 'react-native-gesture-handler';
import chroma from 'chroma-js';
const { width, height } = Dimensions.get('window');

const _spacing = 8;
const _itemWidth = width * 0.7;
const _itemHeight = _itemWidth * 1.67;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const _itemsCount = 22;
const colors = chroma
  .scale(['#fafa6e', '#2A4858'])
  .mode('lch')
  .colors(_itemsCount);

// generate an even matrix cols === rows to fit all the items
const _gridLength = Math.round(Math.sqrt(22));
console.log(_gridLength);

const clamp = (value, min, max) => {
  'worklet';

  return Math.min(Math.max(value, min), max);
};

// console.log(clamp(40, 0, 50))

const DATA = [...Array(_itemsCount).keys()].map((index) => {
  return {
    key: faker.datatype.uuid(),
    bg: colors[index],
    // color: chroma.contrast(colors[index], 'white') > 3 ? 'white' : '#000'
    color:
      chroma.contrast(colors[index], '#eee') > 3.5
        ? colors[0]
        : colors[_itemsCount - 1],
  };
});

const Item = ({ row, col, item, activeIndex, index, onPress }) => {
  const stylez = useAnimatedStyle(() => {
    return {
      opacity:
        activeIndex.value === index
          ? withDelay(200, withTiming(1, { duration: 300 }))
          : withTiming(0.4),
    };
  });
  return (
    <Pressable onPress={onPress}>
    <Animated.View
      style={[
        {
          width: _itemWidth,
          height: _itemHeight,
          padding: _spacing,
        },
        stylez,
      ]}
      key={item.key}>
      <View
        style={{
          backgroundColor: item.bg,
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          flex: 1,
          padding: _spacing * 2,
          borderRadius: _spacing * 4,
        }}>
        <Text
          style={{
            color: item.color,
            fontSize: 32,
            fontWeight: '800',
            textTransform: 'uppercase',
          }}>
          {item.bg}
        </Text>
      </View>
    </Animated.View>
    </Pressable>
  );
};
export default function App() {
  const ref = React.useRef();
  const matrix = React.useMemo(() => {
    // Generate dummy array;
    const _m = [...Array(_gridLength).keys()].fill([
      ...Array(_gridLength).keys(),
    ]);
    console.log(_m);

    const xxx = _m.map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        return DATA[rowIndex * row.length + colIndex] || { key: 'empty' };
      });
    });

    return xxx;
  }, []);

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const canSwipe = useSharedValue(true);

  const onGestureEvent = useAnimatedGestureHandler({
    onEnd: (event, ctx) => {
      console.log(x.value);
      // don't move on x or y of the movement is subtle.
      // If the finger travelled more than 50px/points we
      // would like to move and check the direction from velocity.
      // This check will avoid things like, move finder 2px up or down
      // by mistake will change the y coordinate which is bad UX.
      console.log(event)
      if (canSwipe.value) {
        if (Math.abs(event.translationX) > 30) {
          if (event.velocityX < -200) {
            x.value = clamp(x.value + 1, 0, _gridLength - 1);
          } else if (event.velocityX > 200) {
            x.value = clamp(x.value - 1, 0, _gridLength - 1);
          }
        }
        if (Math.abs(event.translationY) > 30) {
          if (event.velocityY < -200) {
            y.value = clamp(y.value + 1, 0, _gridLength - 1);
          } else if (event.velocityY > -200) {
            y.value = clamp(y.value - 1, 0, _gridLength - 1);
          }
        }
        canSwipe.value = false;
      }
      // y.value = Math.round(y.value / _itemHeight) * _itemHeight - (height - _itemHeight) / 2;
    },
  });

  const activeIndex = useDerivedValue(() => {
    return _gridLength * y.value + x.value;
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      contentOffset: {
        x: withTiming(
          x.value * _itemWidth - (width - _itemWidth) / 2,
          {duration: 300},
          () => {
            canSwipe.value = true;
          }
        ),
        y: withTiming(
          y.value * _itemHeight - (height - _itemHeight) / 2,
          {duration: 300},
          () => {
            canSwipe.value = true;
          }
        ),
      },
    };
  }, []);

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={styles.container}>
        <StatusBar hidden/>
        <Animated.ScrollView
          ref={ref}
          scrollEnabled={false}
          // contentOffset={{x: 100, y: 0}}
          animatedProps={animatedProps}
          style={
            {
              // width: _gridLength * _itemWidth,
              // transform: [{
              //   rotate: '-15deg'
              // }]
            }
          }
          contentContainerStyle={{
            width: _gridLength * _itemWidth,
          }}
          renderToHardwareTextureAndroid={true}
          >
          {matrix.map((row, rowIndex) => {
            return (
              <View key={`row-${rowIndex}`} style={{ flexDirection: 'row' }}>
                {row.map((item, colIndex) => {
                  return (
                    <Item
                      key={item.key}
                      row={rowIndex}
                      col={colIndex}
                      item={item}
                      activeIndex={activeIndex}
                      index={rowIndex * row.length + colIndex}
                      onPress={() => {
                        x.value = colIndex;
                        y.value = rowIndex;
                      }}
                    />
                  );
                })}
              </View>
            );
          })}
        </Animated.ScrollView>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: '#222',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
