// Inspiration: https://dribbble.com/shots/16056812-NFT-Collections-App
import * as React from "react";
import {
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import Constants from "expo-constants";
import { svgPathProperties } from "svg-path-properties";

const _width = 100;
const _height = 144;
const _radius = _width * 0.4;
const _strokeWidth = 12;
const AnimatedPath = Animated.createAnimatedComponent(Path);

////////////////////
///////////// API //
////////////////////

type AnimatedDonutProps = {
  width?: number;
  height?: number;
  radius?: number;
  strokeColor?: string;
  strokeInactiveColor?: string;
  strokeWidth?: number;
  current?: number;
  max?: number;
  duration?: number;
  delay?: number;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

function AnimatedDonut({
  width = _width,
  height = _height,
  radius = _radius,
  strokeColor = "purple",
  strokeInactiveColor = "red",
  strokeWidth = _strokeWidth,
  current = 2,
  max = 4,
  duration = 500,
  delay = 500,
  children,
  style
}: AnimatedDonutProps) {
  const d = `
    M ${width / 2} 0
    H ${width - radius}
    C ${width} 0, ${width} ${radius}, ${width} ${radius}
    V ${height - radius}
    C ${width} ${height}, ${width - radius} ${height}, ${
    width - radius
  } ${height}
    H ${radius}
    C 0 ${height}, 0 ${height - radius}, 0 ${height - radius}
    V ${radius}
    C 0 0, ${radius} 0, ${radius} 0
    H ${width / 2}
  `;
  const wRatio = strokeWidth ? 1 - strokeWidth / width : 1;
  const hRatio = strokeWidth ? 1 - strokeWidth / height : 1;

  const properties = new svgPathProperties(d);
  const length = properties.getTotalLength();
  const animatedValue = useSharedValue(length);

  React.useEffect(() => {
    animatedValue.value = withDelay(
      delay,
      withTiming(length - (current * length) / max, { duration })
    );
  }, [duration, max, current]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: animatedValue.value
    };
  });

  return (
    <View style={[style, { width, height }]}>
      <Svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
      >
        <Path
          id="s"
          originX={width / 2}
          originY={height / 2}
          scaleX={wRatio}
          scaleY={hRatio}
          strokeWidth={strokeWidth}
          d={d}
          fill="transparent"
          stroke={strokeInactiveColor}
          strokeLinejoin="miter"
          strokeMiterlimit={0}
        />
        <AnimatedPath
          id="s"
          originX={width / 2}
          originY={height / 2}
          scaleX={wRatio}
          scaleY={hRatio}
          strokeWidth={strokeWidth}
          d={d}
          fill="transparent"
          stroke={strokeColor}
          strokeDasharray={length}
          // strokeLinecap='butt'
          strokeLinejoin="miter"
          strokeMiterlimit={0}
          strokeLinecap="round"
          animatedProps={animatedProps}
        />
      </Svg>
      <View
        style={[
          {
            top: strokeWidth,
            left: strokeWidth,
            right: strokeWidth,
            bottom: strokeWidth,
            position: "absolute",
            borderRadius: radius - strokeWidth * 2
          }
        ]}
      >
        {children}
      </View>
    </View>
  );
}

//////////////////////
///////////// Usage //
//////////////////////

const _colors = {
  bg: "#232839",
  inactive: "#353C51",
  active: "#80D15A"
};

const data = [
  {
    current: 36,
    max: 120,
    color: "#4985E0"
  },
  {
    current: 12,
    max: 50,
    color: "#80D15A"
  },
  {
    current: 8,
    max: 20,
    color: "#42B6DB"
  },
  {
    current: 8,
    max: 8,
    color: "#6B5CFE"
  },
  {
    current: 1,
    max: 5,
    color: "#F9AB4F"
  }
];

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        {data.map((item, index) => {
          return (
            <AnimatedDonut
              key={`item-${index}`}
              current={item.current}
              max={item.max}
              strokeColor={item.color}
              strokeInactiveColor={_colors.inactive}
              strokeWidth={5}
              width={62}
              height={86}
              radius={62 * 0.4}
              delay={400 + (300 * index) / 2}
              duration={400}
              // style={{marginRight: 20}}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "space-evenly"
                }}
              >
                <Text
                  style={[styles.text, { color: item.color, fontSize: 17 }]}
                >
                  {item.current}
                </Text>
                <View
                  style={{
                    height: 2,
                    width: "50%",
                    backgroundColor: _colors.inactive,
                    transform: [{ rotate: "-14deg" }]
                  }}
                />
                <Text style={[styles.text, { color: "rgba(255,255,255,0.3)" }]}>
                  {item.max}
                </Text>
              </View>
            </AnimatedDonut>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: _colors.bg
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Menlo",
    textAlign: "center"
  }
});
