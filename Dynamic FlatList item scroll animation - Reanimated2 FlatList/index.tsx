import React, { useCallback } from 'react';

import { StatusBar, StyleSheet, FlatList, View, Text, ScrollView } from 'react-native';
import chroma from 'chroma-js';
import faker from 'faker';
import Animated, {
  useDerivedValue,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
  interpolate,
  measure,
  useAnimatedRef,
  Extrapolate,
} from 'react-native-reanimated';
import Constants from 'expo-constants';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const colors = chroma.scale(['#fafa6e', '#2A4858']).mode('lch').colors(30);

const _spacing = 10;

faker.seed(10);
const _data = colors.map((color) => {
  return {
    key: faker.datatype.uuid(),
    color,
    height: faker.datatype.number(200) + 70,
  };
});

const _offset = 0;

const Item = ({ item, index, scrollY, itemY, itemHeight }) => {
  console.log('from children y:', itemY);
  const stylez = useAnimatedStyle(() => {
    // console.log(values.value)

    return {
      opacity: interpolate(
        scrollY.value,
        [itemY.value - 1, itemY.value, itemY.value + itemHeight.value],
        [1, 1, 0]
      ),
      transform: [
        { perspective: itemHeight.value * 4 },
        {
          translateY: interpolate(
            scrollY.value,
            [
              itemY.value - index * _offset - 1,
              itemY.value - index * _offset,
              itemY.value - index * _offset + 1,
            ],
            [0, 0, 1]
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [itemY.value - 1, itemY.value, itemY.value + itemHeight.value],
            [1, 1, 0]
          ),
        },
        // , {
        //   rotate: `${interpolate(scrollY.value, [itemY.value - index * _offset - 1, itemY.value - index * _offset , itemY.value - index * _offset  + 1], [0, 0, 10], Extrapolate.CLAMP)}deg`,
        // }
      ],
    };
  });
  return (
    <Animated.View
      style={[
        {
          backgroundColor: item.color,
          marginBottom: _spacing,
          height: item.height,
          padding: _spacing,
          borderRadius: 16,
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        },
        stylez,
      ]}>
      <Text style={{ fontWeight: '700', textTransform: 'uppercase' }}>
        {item.color}
      </Text>
    </Animated.View>
  );
};

const CustomCellRendererComponent = React.memo(({ children, ...props }) => {
  const itemY = useSharedValue(0);
  const itemHeight = useSharedValue(0);
  return (
    <View
      {...props}
      onLayout={(ev) => {
        itemY.value = ev.nativeEvent.layout.y;
        itemHeight.value = ev.nativeEvent.layout.height;
      }}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { itemY, itemHeight });
        }
        return child;
      })}
    </View>
  );
});

export default function App() {
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((ev) => {
    scrollY.value = ev.contentOffset.y;
  });
  return (
    <View style={styles.container}>
      <StatusBar hidden/>
      <AnimatedFlatList
        data={_data}
        keyExtractor={(item) => item.key}
        onScroll={onScroll}
        scrollEventThrottle={16}
        CellRendererComponent={CustomCellRendererComponent}
        renderItem={({ item, index }) => {
          return <Item item={item} index={index} scrollY={scrollY} />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    padding: _spacing,
  },
});
