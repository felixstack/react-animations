// https://dribbble.com/shots/15224317-Processing-Loop
import * as React from 'react';
import { Dimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';


const { width, height } = Dimensions.get('window');

const CONTAINER_WIDTH = width * 0.7;
const CONTAINER_HEIGHT = height * 0.2;
const DURATION = 1000;
const DELAY = 500;
const MAX = 3;
const Rect = ({ index }) => {
  const animation = useSharedValue(0);
  const stylez = useAnimatedStyle(() => {
    return {
      width: animation.value,
    };
  });

  React.useEffect(() => {
    animation.value = withDelay(
      index * DURATION,
      withRepeat(
        withSequence(
          withTiming(0, { duration: DURATION }),
          withTiming(CONTAINER_WIDTH * 0.7, { duration: DURATION }),
          // withTiming(CONTAINER_WIDTH * .7, {duration: DURATION}),
          withTiming(0, { duration: DURATION })
        ),
        Infinity,
        true
      )
    );
  }, []);

  return (
    <Animated.View
      style={[{ borderWidth: 1, borderColor: '#333', height: '100%' }, stylez]}
    />
  );
};
export default function ProcessingLoop() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: CONTAINER_WIDTH,
          height: CONTAINER_HEIGHT,
          flexDirection: 'row',
          justifyContent: 'space-between',
          // backgroundColor: 'red',
          padding: 10,
        }}>
        {[...Array(MAX).keys()].map((i) => {
          return <Rect index={i} key={i} />;
        })}
      </View>
    </View>
  );
}
