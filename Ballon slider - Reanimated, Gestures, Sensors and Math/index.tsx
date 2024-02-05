// Extra
const clamp = (a: number, min = 0, max = 1) => {
    "worklet";
    return Math.min(max, Math.max(min, a));
  };
  
  const hitSlop = {
    left: 25,
    bottom: 25,
    right: 25,
    top: 25,
  };
  
  export const layout = {
    spacing: 8,
    radius: 8,
    knobSize: 24,
    indicatorSize: 48,
  };
  
  export const colors = {
    purple: "#683FC2",
    blue: "#007AFF",
    green: "#34C759",
  };
  
  type ColorShades = {
    [key in keyof typeof colors]: {
      base: string;
      light: string;
      dark: string;
    };
  };
  
  const colorShades: ColorShades = Object.entries(colors).reduce(
    (acc, [key, value]) => {
      acc[key as keyof typeof colors] = {
        base: value,
        light: `${value}55`,
        dark: `${value}DD`,
      };
      return acc;
    },
    {} as ColorShades
  );
  
  import { StyleSheet, View } from "react-native";
  import { Gesture, GestureDetector } from "react-native-gesture-handler";
  import Animated, {
    Extrapolation,
    SensorType,
    interpolate,
    measure,
    useAnimatedRef,
    useAnimatedSensor,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
  } from "react-native-reanimated";
  import { AnimatedText } from "./AnimatedText";
  
  const minAngleToActivateSensor = 5; //in degrees
  const pointsPerAngle = 0.2;
  
  export function BallonSlider({ withSensor = true }) {
    const x = useSharedValue(0);
    const progress = useSharedValue(0);
    const isSensorActive = useSharedValue(true);
    const isPanActive = useSharedValue(false);
    const knobScale = useDerivedValue(() => {
      return withSpring(isPanActive.value ? 1 : 0);
    });
    const { sensor } = useAnimatedSensor(SensorType.ROTATION, {
      interval: 100,
    });
    const aRef = useAnimatedRef<View>();
  
    useDerivedValue(() => {
      if (!isSensorActive.value || !aRef || !withSensor) {
        return;
      }
      // Angle is max ~90deg
      const angle = sensor.value.roll * (180 / Math.PI);
      if (Math.abs(angle) < minAngleToActivateSensor) {
        isPanActive.value = false;
        return;
      }
      const size = measure(aRef);
      const countValue = angle * pointsPerAngle;
  
      if (!size) {
        return;
      }
      isPanActive.value = true;
      x.value = clamp((x.value += countValue), 0, size.width);
      progress.value = 100 * (x.value / size.width);
    });
  
    const panGesture = Gesture.Pan()
      .averageTouches(true)
      .activateAfterLongPress(1)
      .onBegin(() => {
        isSensorActive.value = false;
        isPanActive.value = true;
      })
      .onChange((ev) => {
        const size = measure(aRef);
        if (!size) {
          return;
        }
        isSensorActive.value = false;
        x.value = clamp((x.value += ev.changeX), 0, size.width);
        progress.value = 100 * (x.value / size.width);
      })
      .onEnd(() => {
        isSensorActive.value = true;
        isPanActive.value = false;
      });
    const animatedStyle = useAnimatedStyle(() => {
      return {
        borderWidth: interpolate(
          knobScale.value,
          [0, 1],
          [layout.knobSize / 2, 2],
          // For older Reanimated version, please use
          // Extrapolate.CLAMP
          Extrapolation.CLAMP
        ),
        transform: [
          {
            translateX: x.value,
          },
          {
            scale: knobScale.value + 1,
          },
        ],
      };
    });
  
    const ballonSpringyX = useDerivedValue(() => {
      return withSpring(x.value);
    });
  
    const ballonAngle = useDerivedValue(() => {
      return (
        90 +
        (Math.atan2(-layout.indicatorSize * 2, ballonSpringyX.value - x.value) *
          180) /
          Math.PI
      );
    });
  
    const ballonStyle = useAnimatedStyle(() => {
      return {
        opacity: knobScale.value,
        transform: [
          { translateX: ballonSpringyX.value },
          { scale: knobScale.value },
          {
            translateY: interpolate(
              knobScale.value,
              [0, 1],
              [0, -layout.indicatorSize]
            ),
          },
          {
            rotate: `${ballonAngle.value}deg`,
          },
        ],
      };
    });
  
    return (
      <GestureDetector gesture={panGesture}>
        <View ref={aRef} style={styles.slider} hitSlop={hitSlop}>
          <Animated.View style={[styles.ballon, ballonStyle]}>
            <View style={styles.textContainer}>
              <AnimatedText
                text={progress}
                style={{ color: "white", fontWeight: "600" }}
              />
            </View>
          </Animated.View>
          <Animated.View style={[styles.progress, { width: x }]} />
          <Animated.View style={[styles.knob, animatedStyle]} />
        </View>
      </GestureDetector>
    );
  }
  
  const styles = StyleSheet.create({
    knob: {
      width: layout.knobSize,
      height: layout.knobSize,
      borderRadius: layout.knobSize / 2,
      backgroundColor: "#fff",
      borderWidth: layout.knobSize / 2,
      borderColor: colorShades.purple.base,
      position: "absolute",
      left: -layout.knobSize / 2,
    },
    slider: {
      width: "90%",
      backgroundColor: colorShades.purple.light,
      height: 5,
      justifyContent: "center",
    },
    textContainer: {
      width: 40,
      height: 60,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colorShades.purple.base,
      position: "absolute",
      top: -layout.knobSize,
    },
    ballon: {
      alignItems: "center",
      justifyContent: "center",
      width: 4,
      height: layout.indicatorSize,
      bottom: -layout.knobSize / 2,
      borderRadius: 2,
      backgroundColor: colorShades.purple.base,
      position: "absolute",
    },
    progress: {
      height: 5,
      backgroundColor: colorShades.purple.dark,
      position: "absolute",
    },
  });
  