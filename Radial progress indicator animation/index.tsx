import { memo } from 'react';
import { StyleSheet, Text, View, TextStyle } from 'react-native';
import Animated, {
  Extrapolate,
  SharedValue,
  withTiming,
  useDerivedValue,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';

// Masked view and SVG, used only for the gradient.
import MaskedView from '@react-native-masked-view/masked-view';
import { Svg, Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

// Used for animated number.
import { AnimatedText } from './AnimatedText';

// Number of lines in the progress bar.
const lines = 100;

export type ProgressProps = {
  value: number;
  size: number;
  color?: string;
  inactiveColor?: string;
  textStyle?: TextStyle;
};

export function Progress({
  size = 300,
  value = 0,
  inactiveColor = '#777',
  color = 'gold',
  textStyle,
}: ProgressProps) {
  const progress = useSharedValue(-1);

  useDerivedValue(() => {
    progress.value = withTiming(value, { duration: 1500 });
  }, [value]);

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <MaskedView
        style={StyleSheet.absoluteFillObject}
        maskElement={<Gradient size={size} />}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {[...Array(lines).keys()].map((i) => (
            <Line
              progress={progress}
              color={color}
              inactiveColor={inactiveColor}
              key={`line-${i}`}
              size={size}
              index={i}
            />
          ))}
        </View>
      </MaskedView>
      <View style={{ alignItems: 'center' }}>
        <AnimatedText
          text={progress}
          style={[
            {
              fontSize: Math.floor(size * 0.15),
              color: '#fff',
              fontWeight: '600',
              width: size / 2,
              textAlign: 'center',
              fontVariant: ['tabular-nums'],
            },
            textStyle,
          ]}
          formatter="%"
        />
        <Text style={[{ color: '#fff', opacity: 0.7 }, textStyle]}>
          processing
        </Text>
      </View>
    </View>
  );
}

// Line component
type LineProps = {
  progress: SharedValue<number>;
  color: string;
  inactiveColor: string;
  size: number;
  index: number;
};

const Line = memo(
  ({ progress, color, size, index, inactiveColor }: LineProps) => {
    const progressToAngle = 360 / lines;
    const stylez = useAnimatedStyle(() => {
      const inputRange = [
        ((index - 2) * 100) / lines,
        (index * 100) / lines,
        ((index + 2) * 100) / lines,
      ];
      return {
        transform: [
          {
            translateY: interpolate(
              progress.value,
              inputRange,
              [size * 0.07, size * 0.07, 0],
              Extrapolate.CLAMP
            ),
          },
        ],

        backgroundColor: interpolateColor(progress.value, inputRange, [
          inactiveColor,
          inactiveColor,
          color,
        ]),
      };
    });
    return (
      <Animated.View
        style={[
          {
            flex: 1,
            width: 4,
            height: size,
            position: 'absolute',
            overflow: 'hidden',
            justifyContent: 'flex-start',
            transform: [
              {
                rotateZ: `${progressToAngle * index}deg`,
              },
            ],
          },
        ]}>
        <Animated.View
          style={[
            stylez,
            { height: '50%', borderRadius: 6, overflow: 'hidden' },
          ]}
        />
      </Animated.View>
    );
  }
);

// Radial gradient
const Gradient = ({ size }: { size: number }) => (
  <Svg height={size} width={size} style={{ position: 'absolute' }}>
    <Defs>
      <RadialGradient
        id="grad"
        cx={size / 2}
        cy={size / 2}
        rx={size / 2}
        ry={size / 2}
        fx={size / 2}
        fy={size / 2}
        gradientUnits="userSpaceOnUse">
        <Stop offset="0.6" stopColor="#000" stopOpacity="0" />
        <Stop offset="1" stopColor="#00000000" stopOpacity="1" />
      </RadialGradient>
    </Defs>
    <Circle r={size / 2} cx={size / 2} cy={size / 2} fill="url(#grad)" />
  </Svg>
);
