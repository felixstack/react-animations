import * as React from 'react';
import { FlatList, Text, View, StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import chroma from 'chroma-js';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { faker } from '@faker-js/faker';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

faker.seed(3);

const _numOfItems = 10;
const colors = chroma
  .scale(['#fafa6e', '#2A4858'])
  .mode('lch')
  .colors(_numOfItems);
const DATA = colors.map((color) => ({
  key: faker.datatype.uuid(),
  available: faker.helpers.arrayElements([false, false, true]),
  text: faker.random.words(faker.datatype.number(3)),
  color,
}));

const _smallItemHeight = 60;
const _itemHeight = 120;
const _spacing = 20;

export default function App() {
  const scrollY = useSharedValue(0);
  const posY = useSharedValue(0);
  const posX = useSharedValue(0);
  const posWidth = useSharedValue(0);
  const posHeight = useSharedValue(0);
  const isDragActive = useSharedValue(false);
  const isScrollActive = useSharedValue(false);
  const _availableSpaces = React.useRef([]);
  const [layout, setLayout] = React.useState([]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      posY.value -= event.contentOffset.y - scrollY.value;
      scrollY.value = event.contentOffset.y;
      // console.log(event)
    },
    onBeginDrag: (e) => {
      console.log(e);
      isScrollActive.value = true;
    },
    onEndDrag: (e) => {
      isScrollActive.value = false;
    },
  });

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      console.log('event: ', event);
      ctx.absoluteX = event.absoluteX;
      ctx.absoluteY = event.absoluteY;
      ctx.x = event.x;
      ctx.startY = posY.value;
      ctx.startX = posX.value;
    },
    onActive: (event, ctx) => {
      // console.log()
      posY.value = ctx.startY + event.translationY;
      posX.value = ctx.startX + event.translationX;
      posHeight.value = withTiming(_smallItemHeight);
      posWidth.value = withTiming(_smallItemHeight);
      // posY.value = event.translationY;
      // posX.value = event.translationX;
      isDragActive.value = true;
    },
    onEnd: (event, ctx) => {
      // calculate where to snap
      console.log(event);
      console.log(_availableSpaces.current);
      const closestAvailableIndex = layout.reduce((prev, curr) => {
        return Math.abs(
          curr.y + curr.height / 2 - event.absoluteY - scrollY.value
        ) < Math.abs(prev.y + prev.height / 2 - event.absoluteY - scrollY.value)
          ? curr
          : prev;
      });
      console.log('closestAvailableIndex: ', closestAvailableIndex.index);
      isDragActive.value = false;
      posY.value = withTiming(
        closestAvailableIndex.y - posHeight.value - scrollY.value
      );
      // posX.value = withTiming(closestAvailableIndex.x - posWidth.value / 2 + ctx.absoluteX / 2 + _spacing);
      posX.value = withTiming(closestAvailableIndex.x - _spacing);
      posWidth.value = withTiming(closestAvailableIndex.width);
      posHeight.value = withTiming(closestAvailableIndex.height - _spacing);
      runOnJS(() => {
        setData([]);
      })();
    },
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: isDragActive.value ? withTiming(0) : withTiming(1),
    };
  });
  const draggableStyle = useAnimatedStyle(() => {
    return {
      //height: _smallItemHeight,
      position: 'absolute',
      padding: _spacing,
      backgroundColor: '#0099cc',
      top: 60,

      // left: 50,
      // bottom: 200,
      alignSelf: 'center',
      width: posWidth.value,
      height: posHeight.value,
      borderRadius: isDragActive.value ? 16 : 16,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      transform: [
        {
          translateY: posY.value,
        },
        {
          translateX: posX.value,
        },
      ],
    };
  });

  const [data, setData] = React.useState(DATA);
  const availableSpaces = data.filter((x) => x.available).length;
  console.log('data: ', data);

  return (
    <View style={styles.container}>
      <AnimatedFlatList
        data={data}
        contentContainerStyle={{
          paddingTop: Constants.statusBarHeight,
          paddingHorizontal: _spacing,
        }}
        keyExtractor={(item) => item.key}
        onScroll={onScroll}
        scrollEventThrottle={16}
        CellRendererComponent={({ children, ...props }) => {
          return (
            <View
              {...props}
              onLayout={(ev) => {
                if (!props.item.available) {
                  _availableSpaces.current = [
                    ..._availableSpaces.current,
                    {
                      ...ev.nativeEvent.layout,
                      item: { ...props.item },
                      index: props.index,
                    },
                  ];
                }

                if (_availableSpaces.current.length === availableSpaces) {
                  posWidth.value = _availableSpaces.current[0].width;
                  posHeight.value = _availableSpaces.current[0].height;
                  setLayout(_availableSpaces.current);
                }
              }}>
              {children}
            </View>
          );
        }}
        renderItem={({ item, index }) => {
          return (
            <Animated.View
              style={{
                height: _itemHeight,
                padding: _spacing,
                marginBottom: _spacing,
                borderRadius: 16,
                backgroundColor: item.available ? item.color : 'transparent',
                borderWidth: 2,
                borderColor: item.available ? item.color : '#bbb',
                borderStyle: item.available ? 'solid' : 'dashed',
              }}>
              <Text>{item.available ? item.text : `Available: false`}</Text>
            </Animated.View>
          );
        }}
      />
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[draggableStyle]}>
          <Animated.Text
            style={[
              { fontSize: 22, color: 'white', fontWeight: '700' },
              textStyle,
            ]}>
            + Drag to add
          </Animated.Text>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
