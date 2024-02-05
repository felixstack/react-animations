import { Entypo } from '@expo/vector-icons'
import chroma from 'chroma-js'
import { useEffect, useRef, useState } from 'react'
import { Pressable, ViewStyle } from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  ZoomIn,
  ZoomOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const AnimatedEntypo = Animated.createAnimatedComponent(Entypo)

export type SquishyButtonProps = {
  text: string
  onPress: () => void
}

const AnimatedIcon = ({
  icon,
  color,
  size,
}: {
  icon: keyof typeof Entypo.glyphMap
  size: number
  color?: string
}) => {
  return (
    <AnimatedEntypo
      style={{ position: 'relative' }}
      key="!active"
      name={icon}
      size={size}
      color={color}
      entering={ZoomIn}
      exiting={ZoomOut}
    />
  )
}

const defaultLayout = Layout.springify().damping(15).mass(1)

export function SquishyButton({
  style,
  size = 36,
  color = 'hsl(227,100%,69%)',
}: {
  style?: ViewStyle
  size?: number
  color?: string
}) {
  const pressed = useSharedValue(1)
  const [active, setActive] = useState(false)
  const [timer, setTimer] = useState(0)
  const minutes = Math.floor(timer / 60)
  const seconds = timer % 60
  const timeout = useRef<NodeJS.Timeout>()
  // This is not needed at all, extend the props and send them from outside.
  // This is here more for demo purposes.
  const colors = {
    background: chroma(color).brighten().hex(),
    foreground: chroma(color).darken().hex(),
  }

  useEffect(() => {
    // Faking the timer.
    if (!active) {
      clearInterval(timeout.current)
      return
    }
    timeout.current = setInterval(() => {
      setTimer((timer) => timer + 1)
    }, 1000)

    return () => {
      clearInterval(timeout.current)
    }
  }, [active])

  return (
    <Animated.View style={[style, { alignItems: 'center' }]}>
      <AnimatedPressable
        // Animate the button scale on press.
        onPressIn={() => {
          pressed.value = withSpring(0.9)
        }}
        onPressOut={() => {
          pressed.value = withSpring(1)
        }}
        // Long press will reset the timer.
        delayLongPress={1000}
        onLongPress={() => {
          setTimer(0)
          setActive(false)
        }}
        // Toggle the button state.
        onPress={() => {
          setActive((active) => !active)
        }}
        style={{
          transform: [
            {
              // We use inline styles from Reanimated.
              // https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary/#animations-in-inline-styling
              scale: pressed,
            },
          ],
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
          paddingHorizontal: size / 4,
          paddingVertical: size / 8,
          borderRadius: size / 4,
          overflow: 'hidden',
        }}
        layout={defaultLayout}
      >
        {/* ICON */}
        {!active ? (
          <AnimatedIcon size={size} icon="controller-play" key="play" color={colors.foreground} />
        ) : (
          <AnimatedIcon size={size} icon="controller-stop" key="pause" color={colors.foreground} />
        )}
        {/* SPACER */}
        {active && (
          <Animated.View
            style={{ width: size * 3 }}
            entering={FadeIn}
            exiting={FadeOut}
          >
            <Wave color={colors.foreground} size={size * 3} />
          </Animated.View>
        )}
        {/* TIMER */}
        {/* Most probably, you can extend this by sending the content as children */}
        {/* Or even more, extend this functionality to support <left> <center> <right> */}
        {/* Like. SquishyButton.Left | SquishyButton.Center | SquishyButton.Right */}
        {/* Where left can be an icon, center - waveform, right: timer. */}
        <Animated.Text
          key="active-text"
          style={{
            fontVariant: ['tabular-nums'],
            color: colors.foreground,
            fontWeight: '600',
            lineHeight: Math.floor(size / 2) * 1.5,
            fontSize: Math.floor(size / 2),
            // Make it so the "spacer" appears to go beneath it.
            backgroundColor: colors.background
          }}
          exiting={ZoomOut}
          entering={ZoomIn}
          layout={defaultLayout}
        >
          {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </Animated.Text>
      </AnimatedPressable>
    </Animated.View>
  )
}

// Fake WaveBar
const WaveBar = ({ color, size }: { color: string; size: number }) => {
  const height = useSharedValue(size)

  useEffect(() => {
    const randomValue = Math.floor(Math.random() * size * 6)
    height.value = withDelay(
      Math.random() * 1000,
      withRepeat(withTiming(randomValue, { duration: Math.random() * 200 + 200 }), Infinity, true)
    )
  }, [])

  const stylez = useAnimatedStyle(() => {
    return {
      height: height.value,
      backgroundColor: color,
      opacity: 0.8,
      borderRadius: 2,
      width: size,
    }
  })

  return (
    <Animated.View style={stylez} />
  )
}
// Fake Wave
const Wave = ({ color, size }: { color: string; size: number }) => {
  const count = 24
  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: size / 8,
      }}
      entering={ZoomIn}
      exiting={ZoomOut}
    >
      {Array.from({ length: count }).map((_, index) => (
        <WaveBar key={index} color={color} size={size / (count * 2)} />
      ))}
    </Animated.View>
  )
}
