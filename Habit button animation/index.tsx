// Inspiration: https://x.com/sekachov/status/1695087894229086636?s=46&t=eX7dcVtEmANNl14sX_YtpA

import * as React from 'react'
import { StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { Feather } from '@expo/vector-icons'
import Animated, {
  Extrapolate, FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutUp,
  Layout, interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue, withTiming
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useState } from 'react'
import { MotiView, motify } from 'moti'

export type HabitButtonProps = {
  icon: keyof typeof Feather.glyphMap
  color: string
  count: number
  name: string
  onChange: (newValue: number) => void
  size?: number
  longPressDuration?: number
  fancyAnimation?: boolean
}

const AnimatedFeather = motify(Feather)()

export function HabitButton({
  color,
  count,
  icon,
  name,
  size = 104,
  longPressDuration = 600,
  onChange,
  fancyAnimation = false,
}: HabitButtonProps) {
  // Layout config
  const radius = size / 8
  const spacing = radius * 0.4

  const indicatorFontSize = Math.floor(size / 10)
  const indicatorSize = indicatorFontSize + spacing * 2

  const nameSize = indicatorFontSize + 2
  const iconSize = Math.floor(size / 2)

  // Animations
  const animation = useSharedValue(0)
  const pressInAnimation = useSharedValue(0)

  const [isActive, setIsActive] = useState(false)

  const onDone = () => {
    setIsActive(false)
    onChange(count + 1)
    startAnimation(0)
  }

  const startAnimation = (to: number, duration = 0) => {
    'worklet'
    animation.value = withTiming(to, { duration }, (finished) => {
      if (finished && to === 1) {
        runOnJS(onDone)()
      }
    })
    pressInAnimation.value = withTiming(to, { duration: 400 })
  }

  const tapGesture = Gesture.LongPress()
    .minDuration(longPressDuration)
    .onBegin(() => {
      startAnimation(1, longPressDuration)
      runOnJS(setIsActive)(true)
    })
    .onFinalize(() => {
      startAnimation(0)
      runOnJS(setIsActive)(false)
    })

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(pressInAnimation.value, [0, 1], [1, 0.9]),
        },
      ],
    }
  })

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(pressInAnimation.value, [0, 1], [1, 1.3], {
            extrapolateRight: Extrapolate.CLAMP,
          }),
        },
      ],
    }
  })
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(animation.value, [0, 1], [-size, 0]),
        },
      ],
      opacity: interpolate(animation.value, [0, 1], [1, 0.4]),
    }
  })
  return (
    <MotiView
      animate={{
        backgroundColor: count > 0 ? color : '#eee',
      }}
      style={[
        {
          // backgroundColor: count > 0 ? color : '#eee',
          borderRadius: radius,
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        },
        containerStyle,
      ]}
    >
      {/* Indicator */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: 'rgba(0,0,0,0.1)',
          },
          indicatorStyle,
        ]}
      />
      <GestureDetector gesture={tapGesture}>
        <Animated.View style={[{ flex: 1, padding: spacing }]}>
          <Animated.View
            layout={Layout}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              gap: spacing,
              flex: 1,
            }}
          >
            <Animated.View
              layout={Layout}
              entering={FadeInDown.duration(300)}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: size,
              }}
            >
              <AnimatedFeather
                exiting={FadeOut}
                style={iconStyle}
                name={icon}
                size={iconSize}
                animate={{
                  // @ts-ignore
                  color: count > 0 ? '#fff' : '#999',
                }}
                transition={{
                  type: 'timing',
                  duration: 300,
                }}
              />
            </Animated.View>
            {!isActive && (
              <Animated.Text
                entering={FadeInDown.duration(300)}
                exiting={FadeOutDown.duration(300)}
                layout={Layout}
                style={[
                  {
                    color: count > 0 ? '#fff' : '#999',
                    fontSize: nameSize,
                    fontWeight: '500',
                  },
                ]}
              >
                {name}
              </Animated.Text>
            )}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
      {count > 0 && (
        <TouchableWithoutFeedback
          style={{ position: 'absolute' }}
          onPress={() => {
            onChange(count - 1)
          }}
        >
          <Animated.View
            entering={FadeInUp.duration(500)}
            exiting={FadeOutUp.duration(500)}
            style={{
              position: 'absolute',
              top: spacing,
              right: spacing,
              height: indicatorSize * 0.8,
              borderRadius: radius - spacing / 2,
              paddingHorizontal: spacing,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: count > 0 ? '#fff' : '#999',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              overflow: 'hidden',
            }}
          >
            <Animated.Text
              style={{
                fontWeight: '700',
                fontSize: indicatorFontSize * 0.6,
                color: count > 0 ? color : '#eee',
              }}
            >
              x
            </Animated.Text>
            <Animated.Text
              key={count + `${fancyAnimation ? '-fancy' : ''}`}
              entering={FadeInDown.duration(fancyAnimation ? 300 : 1)}
              exiting={FadeOutUp.duration(fancyAnimation ? 300 : 1)}
              style={{
                fontWeight: '700',
                fontSize: indicatorFontSize,
                color: count > 0 ? color : '#eee',
              }}
            >
              {count}
            </Animated.Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
    </MotiView>
  )
}
