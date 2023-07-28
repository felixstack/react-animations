// Inspiration: https://dribbble.com/shots/3845034-Listening-now-Kishi-Bashi

import * as React from 'react';
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import Constants from 'expo-constants';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  withSpring,
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');

const AnimatedPath = Animated.createAnimatedComponent(Path);

const _color = '#FE497F';
// const _color = "#2D2D2C"
// const _color = '#29D3FE';
// const _color = "#364680"
const _minF = width * 0.1;
const _maxF = width * 0.34;
const clampMin = 25;
const clampMax = 75;

export const clamp = (value, min, max) => {
  'worklet';
  return Math.min(Math.max(min, value), max);
};

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const AnimatedText = ({ text, style, ...props }) => {
  const animatedProps = useAnimatedProps(() => {
    if (!text) {
      return {};
    }
    return {
      text: String(text.value),
    };
  });
  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      style={[style]}
      allowFontScaling={true}
      numberOfLines={1}
      value={String(text.value)}
      {...{ animatedProps }}
    />
  );
};

export default function App() {
  const posY = useSharedValue(50);
  const posX = useSharedValue(50);
  const currentY = useSharedValue(50);
  const currentX = useSharedValue(width / 2);
  const animatedProps = useAnimatedProps(() => {
    const h = (height * posY.value) / 100;
    const currentH = (height * currentY.value) / 100;
    return {
      // extend beyond the screenwidth to make this feel more natural.
      d: `
    M-100 ${h}
    C ${currentX.value} ${currentH}, ${currentX.value} ${currentH}, ${
        width + 100
      } ${h}
    L${width + 100} ${height}
    L0 ${height}
    Z
  `,
    };
  });
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startY = posY.value;
      ctx.startX = event.x;
    },
    onActive: (event, ctx) => {
      posY.value = clamp(
        ctx.startY + event.translationY / 50,
        clampMin,
        clampMax
      );
      currentX.value = ctx.startX + event.translationX / 3;
      currentY.value = ctx.startY + event.translationY / 18;
    },
    onEnd: (event, ctx) => {
      currentY.value = withSpring(posY.value, {
        damping: 3,
        stiffness: 400,
      });
      currentX.value = withSpring(width / 2, {
        damping: 10,
        stiffness: 100,
      });
    },
  });

  const topValue = useDerivedValue(() => {
    return Math.floor(interpolate(posY.value, [clampMin, clampMax], [0, 100]));
  });

  const bottomValue = useDerivedValue(() => {
    return Math.floor(interpolate(posY.value, [clampMin, clampMax], [100, 0]));
  });

  const topTextStyle = useAnimatedStyle(() => {
    return {
      fontSize: Math.floor(
        interpolate(posY.value, [clampMin, clampMax], [_minF, _maxF])
      ),
    };
  });
  const topViewStyle = useAnimatedStyle(() => {
    return {
      top: 0,
      height: (height * posY.value) / 100,
      transform: [
        {
          translateY: currentY.value / 2,
        },
      ],
    };
  });
  const bottomTextStyle = useAnimatedStyle(() => {
    return {
      fontSize: Math.floor(
        interpolate(posY.value, [clampMin, clampMax], [_maxF, _minF])
      ),
    };
  });
  const bottomViewStyle = useAnimatedStyle(() => {
    return {
      bottom: 0,
      height: height - (height * posY.value) / 100,
      transform: [
        {
          translateY: -currentY.value / 2,
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={{
              position: 'absolute',
              backgroundColor: 'transparent',
            }}>
            <Svg width={width} height={height}>
              <AnimatedPath animatedProps={animatedProps} fill={_color} />
            </Svg>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  justifyContent: 'flex-end',
                  paddingBottom: height * 0.1,
                  left: 0,
                  right: 0,
                  bottom: 0,
                },
                topViewStyle,
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AnimatedText
                  text={topValue}
                  style={[
                    {
                      fontSize: _minF + _maxF / 2,
                      marginLeft: 20,
                      color: _color,
                    },
                    topTextStyle,
                  ]}
                />
                <Text style={{ fontSize: 24, color: _color, marginLeft: 20 }}>
                  Points you {'\n'}need
                </Text>
              </View>
            </Animated.View>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  justifyContent: 'flex-start',
                  paddingTop: height * 0.1,
                  left: 0,
                  right: 0,
                  bottom: 0,
                },
                bottomViewStyle,
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AnimatedText
                  text={bottomValue}
                  style={[
                    {
                      fontSize: _minF + _maxF / 2,
                      marginLeft: 20,
                      color: '#fff',
                    },
                    bottomTextStyle,
                  ]}
                />
                <Text style={{ fontSize: 24, color: '#fff', marginLeft: 20 }}>
                  Points you {'\n'}need
                </Text>
              </View>
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
