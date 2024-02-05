import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  Extrapolate,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const defaultGradients = [
  { start: '#ff0000', end: '#ff4000' }, // Red to Orange
  { start: '#ff4000', end: '#ff7f00' }, // Orange to Light Orange
  { start: '#ff7f00', end: '#ffbf00' }, // Light Orange to Yellow
  { start: '#ffbf00', end: '#ffff00' }, // Yellow to Light Yellow
  { start: '#ffff00', end: '#80ff00' }, // Light Yellow to Green
  { start: '#80ff00', end: '#00ff80' }, // Green to Light Green
  { start: '#00ff80', end: '#00ffff' }, // Light Green to Cyan
  { start: '#00ffff', end: '#0080ff' }, // Cyan to Light Blue
  { start: '#0080ff', end: '#0000ff' }, // Light Blue to Blue
  { start: '#0000ff', end: '#4b0082' }, // Blue to Indigo
  { start: '#4b0082', end: '#9400d3' }, // Indigo to Violet
  { start: '#9400d3', end: '#ff007f' }, // Violet to Pink
  { start: '#ff007f', end: '#ff0000' }, // Pink back to Red
];

type Gradient = { start: string; end: string };
type FlowerProps = {
  leafs: number;
  size: number;
  duration?: number;
  initialActiveIndex?: number;
  gradients?: Gradient[];
  onPress?: (index: number) => void;
};

type LeafProps = {
  index: number;
  leafs: number;
  size: number;
  progress: SharedValue<number>;
  gradient: Gradient;
  dummyLeaf?: boolean;
  onLeafPress?: () => void;
};

function Leaf({ leafs, index, progress, size, gradient, onLeafPress, dummyLeaf }: LeafProps) {
  const leafSize = size * 0.25;
  const TWO_PI = 2 * Math.PI;
  const angle = TWO_PI / leafs;
  const radius = useDerivedValue(() => {
    return interpolate(progress.value, [0, 1], [0, leafSize]);
  });

  const stylez = useAnimatedStyle(() => {
    return {
      zIndex: dummyLeaf && progress.value === 1 ? -1 : leafSize - index,
      opacity: !dummyLeaf ? 1 : interpolate(progress.value, [0.2, 1], [1, 0]),
      transform: [
        // This will create a spiral movement for each leaf.
        // Also the leafs-index is used, because the angle should be calculated in reverse.
        // index = 0 should translate the entire circle circumference
        {
          translateX: Math.cos(progress.value * angle * (leafs - index)) * radius.value,
        },
        {
          translateY: Math.sin(progress.value * angle * (leafs - index)) * radius.value,
        },
        {
          scale: dummyLeaf
            ? 1
            : interpolate(progress.value, [0, 0.05], [0.5, 1], Extrapolate.CLAMP),
        },
        {
          rotate: `${progress.value * angle * (leafs - index)}rad`,
        },
      ],
      // Increase the size + shadow of the leaf as it moves down the spiral.
      width: interpolate(progress.value, [0, 1], [leafSize, leafSize * 2 - 10]),
      shadowOpacity: interpolate(progress.value, [0, 1], [0, 0.5]),
      shadowRadius: interpolate(progress.value, [0, 1], [0, leafSize / 6]),
    };
  });
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          backgroundColor: gradient.start,
          width: leafSize,
          height: leafSize,
          borderRadius: leafSize,
          shadowOffset: { width: 0, height: 0 },
          shadowColor: '#000',
          justifyContent: 'center',
          alignItems: 'center',
          // Because the order matters, when rendering the leafs, first leafs (index = 0) is going
          // to be position behind everything, so we would like to reverse the zIndex for the leafs,
          // and incrementally decrease it as we go.
          zIndex: leafs - index,
        },
        stylez,
      ]}
      onTouchStart={() => onLeafPress?.()}>
      <LinearGradient
        // Background Linear Gradient
        start={[0, 1]}
        end={[1, 0]}
        colors={[gradient.start, gradient.end]}
        style={(StyleSheet.absoluteFillObject, { flex: 1, borderRadius: leafSize })}
      />
    </Animated.View>
  );
}

const _spacing = 30;
export function Flower({
  leafs,
  size,
  gradients = defaultGradients,
  onPress,
  initialActiveIndex = 0,
  duration = 1000,
}: FlowerProps) {
  const progress = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const stylez = useAnimatedStyle(() => {
    return {
      width: interpolate(progress.value, [0, 1], [size * 0.25 + _spacing, size]),
      height: interpolate(progress.value, [0, 1], [size * 0.25 + _spacing, size]),
    };
  });

  const animate = useCallback(() => {
    progress.value = withTiming(progress.value === 0 ? 1 : 0, {
      duration,
      easing: Easing.elastic(0.9),
    });
  }, [duration]);

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: -10, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 10,
          backgroundColor: '#ffffff',
          transform: [
            {
              // Humans start from 0 degrees or x-axis :)
              rotate: '-90deg',
            },
          ],
        },
        stylez,
      ]}>
      {Array.from({ length: leafs }).map((_, i) => {
        return (
          <Leaf
            index={i}
            key={i}
            progress={progress}
            size={size - _spacing}
            leafs={leafs}
            onLeafPress={() => {
              setActiveIndex(i);
              animate();
              onPress?.(i);
            }}
            gradient={gradients[i % gradients.length]}
          />
        );
      })}
      <Leaf
        index={0}
        progress={progress}
        size={size}
        leafs={leafs}
        dummyLeaf
        gradient={gradients[activeIndex]}
        onLeafPress={animate}
      />
      <StatusBar hidden />
    </Animated.View>
  );
}
