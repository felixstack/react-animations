import { PropsWithChildren, memo, useEffect, useState } from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

type BrandedFeaturesProps = PropsWithChildren<{
  count: number
  duration?: number
}>

type AnimatedElementProps = PropsWithChildren<{
  index: number
  count: number
  animation: Animated.SharedValue<number>
  duration: number
}>

const AnimatedElement = memo(
  ({ index, count, children, duration, animation }: AnimatedElementProps) => {
    const { start, end, rotation, startTime, endTime, scale } = getAnimationConfigForElement(
      duration,
      index,
      count
    )
    const { width, height } = useWindowDimensions()
    const style = useAnimatedStyle(() => {
      return {
        // Maybe rely on the children?
        opacity: 0.8,
        position: 'absolute',
        transform: [
          {
            translateX: interpolate(
              animation.value,
              [startTime, endTime],
              [start.x * width, end.x * width]
            ),
          },
          {
            translateY: interpolate(
              animation.value,
              [startTime, endTime],
              [start.y * height, (end.y * height) / 2]
            ),
          },
          {
            rotate: `${interpolate(animation.value, [startTime, endTime], [0, rotation])}rad`,
          },
          {
            scale,
          },
        ],
      }
    })
    return <Animated.View style={style}>{children}</Animated.View>
  }
)

export function BrandedFeatures({ count, duration = 5000, children }: BrandedFeaturesProps) {
  const animation = useSharedValue(0)
  const [autoDestroy, setAutoDestroy] = useState(false)

  useEffect(() => {
    animation.value = withTiming(
      1,
      {
        duration,
        easing: Easing.linear,
      },
      (finished) => {
        if (finished) {
          runOnJS(setAutoDestroy)(true)
        }
      }
    )
  }, [])

  const fadeOutBeforeDestroy = useSharedValue(300 / duration)
  const stylez = useAnimatedStyle(() => {
    return {
      backgroundColor: '#222',
      opacity: interpolate(animation.value, [1 - fadeOutBeforeDestroy.value, 1], [1, 0]),
    }
  })

  if (autoDestroy) {
    return null
  }

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFillObject, stylez]}>
      {[...Array(count).keys()].map((i) => {
        return (
          <AnimatedElement
            key={`animated-element-${i}`}
            index={i}
            count={count}
            animation={animation}
            duration={duration}
          >
            {children}
          </AnimatedElement>
        )
      })}
    </Animated.View>
  )
}

// Helpers

function clamp(value: number, lowerBound: number, upperBound: number) {
  'worklet'
  return Math.min(Math.max(lowerBound, value), upperBound)
}

function getRandomStartEndCoordinates() {
  'worklet'
  // First, generate a start x between 0 and 1
  // then subtract that from 1 to get the end x
  // In this way, we now that the end x will always
  // be on the opposite side of the screen from the start x
  // We want a range between [0, 1] because we will
  // multiply this with the screen width/height.
  const x = randomNumberInRange(0, 1)
  const y = randomNumberInRange(1, 1.3)
  // y -> -x
  return { start: { x, y: 0 }, end: { x: randomNumberInRange(0, 1.5) - x, y } }
}

function randomNumberInRange(min: number, max: number) {
  'worklet'
  return Math.random() * (max - min) + min
}

function getAnimationConfigForElement(duration: number, index: number, count: number) {
  'worklet'
  // I don't really know what I was doing here :-)
  // But in a nutshell, I wanted to constrain the duration
  // of each element and also ensure that I am evenly
  // distributing the elements across the duration [0, 1]
  const minDuration = duration / 4
  const maxDuration = clamp(2000, minDuration, duration * 0.7)
  const minDurationFraction = minDuration / duration
  const maxDurationFraction = maxDuration / duration
  // Distribute the start times evenly across the duration, based on index and count
  const startTime = (index / count) * (1 - maxDurationFraction) // between [0, 1 - maxDurationFraction]
  const animationDuration = randomNumberInRange(minDurationFraction, maxDurationFraction)
  return {
    ...getRandomStartEndCoordinates(),
    startTime, // from [0, .5]
    endTime: clamp(startTime + animationDuration, 0, 1), // from [startTime, 1]:
    rotation: randomNumberInRange(0, 1) * Math.PI, // max 2PI (360deg)
    scale: randomNumberInRange(0.7, 2),
  }
}
