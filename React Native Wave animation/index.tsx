import * as React from 'react';
import {
  StatusBar,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, {
  Path,
  Defs,
  Rect,
  ClipPath,
  G,
  Text as SvgText,
} from 'react-native-svg';
import Animated, {
  withRepeat,
  useSharedValue,
  useAnimatedProps,
  useDerivedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
const { width, height } = Dimensions.get('window');

const AnimatedPath = Animated.createAnimatedComponent(Path);

const waveConfig = {
  height: height * 0.9,
  width,
  amplitude: 16,
  speed: 2.5,
  color: '#0099cc',
};

const maxCups = 10;

export default function App() {
  const offset = useSharedValue(0);
  const waveHeight = useSharedValue(height);
  const amplitude = useSharedValue(0);
  const [cups, setCups] = React.useState(1);

  const animatedProps = useAnimatedProps(() => {
    let lines = ``;
    for (let x = 0; x <= waveConfig.width; x += 1) {
      let y =
        amplitude.value *
          Math.sin(
            (360 / waveConfig.width) * ((x * Math.PI) / 180) -
              (offset.value * Math.PI) / 180
          ) +
        waveHeight.value;
      lines += ` L${x} ${y}`;
    }
    return {
      d: `
    M0 ${waveHeight.value}
    ${lines}
    L${waveConfig.width} ${height}
    L0 ${height}
    Z
  `,
    };
  });

  React.useEffect(() => {
    //
    // waveHeight.value = withTiming(height - height * cups / maxCups , {
    //   duration: 1000,
    // });

    // // higher we go, smaller the amplitude.
    // amplitude.value = withTiming(
    //   2 + (waveConfig.amplitude * height * cups / maxCups ) / height, {
    //     duration: 1000
    //   }
    // );
    offset.value = withRepeat(
      withTiming(waveConfig.width - 11, {
        duration: 2000 / waveConfig.speed,
        easing: Easing.linear,
      }),
      Infinity,
      false
    );
  }, []);

  React.useEffect(() => {
    // const newHeight = height * Math.random();
    waveHeight.value = withTiming(height - (height * cups) / (maxCups - 1), {
      duration: 1000,
    });

    // higher we go, smaller the amplitude.
    amplitude.value = withTiming(
      (waveConfig.amplitude *
        1.5 *
        (height - (height * cups) / (maxCups - 1))) /
        height,
      {
        duration: 1000,
      }
    );
  }, [cups]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <ClipPath id="clip">
          <G>
            <SvgText
              x="50%"
              y="50%"
              fontSize={Math.floor(width * 0.6)}
              fontWeight="bold"
              textAnchor="middle">
              {cups}
            </SvgText>
            <AnimatedPath animatedProps={animatedProps} />
          </G>
        </ClipPath>

        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          // fill="url(#grad)"
          fill={waveConfig.color}
          clipPath="url(#clip)"
          strokeLinejoin="miter"
          strokeMiterlimit={0}
        />
      </Svg>

      <TouchableOpacity
        onPress={() => {
          setCups((cups) => {
            return (cups + 1) % maxCups;
          });
        }}
        style={{
          position: 'absolute',
          bottom: 100,
          width,
        }}>
        <View
          style={{
            paddingHorizontal: 24,
            paddingVertical: 16,
            backgroundColor: 'white',
            alignSelf: 'center',
            borderRadius: 100,
          }}>
          <Text
            style={{
              textTransform: 'uppercase',
              fontWeight: '700',
            }}>
            Tap for water
          </Text>
        </View>
      </TouchableOpacity>
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
