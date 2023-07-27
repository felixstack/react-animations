import { View, StyleSheet, StatusBar } from 'react-native';
import Constants from 'expo-constants';
import Animated, {
  useDerivedValue,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  useAnimatedProps,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);


function useJellyGesture() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const velocityX = useSharedValue(0);
  const velocityY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = x.value;
      ctx.startY = y.value;
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
      y.value = ctx.startY + event.translationY;
      velocityX.value = event.velocityX / 30;
      velocityY.value = event.velocityY / 30;
    },
    onEnd: () => {
      velocityX.value = withSpring(0);
      velocityY.value = withSpring(0);
    },
  });

  return {
    x,
    y,
    velocityX,
    velocityY,
    gestureHandler,
  };
}

const JellyBox = ({ width = 100, height = 100, spacing: s = 20, color }) => {
  const { x, y, velocityX, velocityY, gestureHandler } = useJellyGesture();

  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
        {
          translateY: y.value,
        },
      ],
    };
  });

  const bottom = useDerivedValue(() => {
    return `Q${width / 2},${height - s + velocityY.value} ${width - s},${height - s}`
  })
  const top = useDerivedValue(() => {
    return `Q${width / 2},${s + velocityY.value} ${s},${s}`
  })
  const right = useDerivedValue(() => {
    return `Q${width - s + velocityX.value},${height / 2} ${width - s},${s}`
  })
  const left = useDerivedValue(() => {
    return `Q${s + velocityX.value},${height / 2} ${s},${height - s}`
  })


  const path = useAnimatedProps(() => {
    return {
      d: `
        M${s},${height - s} 
        ${bottom.value} 
        ${right.value}
        ${top.value}
        ${left.value}
      `
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={stylez}>
        <Svg
          viewBox={`0 0 ${width} ${height}`}
          width={width + s * 3}
          height={height + s * 3}
          >
          <AnimatedPath
            animatedProps={path}
            fill={color}
            fillOpacity="1"
          />
        </Svg>
      </Animated.View>
    </PanGestureHandler>
  );
};
export default function App() {
  return (
    <View style={styles.container}>
    <StatusBar hidden />
      <JellyBox width={140} height={140} color="gold"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#333',
    padding: 8,
  }
});
