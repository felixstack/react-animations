import Constants from 'expo-constants'
import { useState } from 'react'
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
const { width } = Dimensions.get('window')

import { Entypo } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import Animated, {
  Extrapolate,
  FadeIn,
  FadeInRight,
  FadeOut,
  FadeOutRight,
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import data, { DataItem, locationImage } from './data'

const duration = 300
const _size = width * 0.9
const layout = {
  borderRadius: 16,
  width: _size,
  height: _size * 1.27,
  spacing: 12,
  cardsGap: 22,
}
const colors = {
  primary: '#6667AB',
  light: '#fff',
  dark: '#111',
}

// Define how many items you'd like to make visible
const maxVisibleItems = 6

type CardProps = {
  totalLength: number
  activeIndex: SharedValue<number>
  index: number
  info: DataItem
}

function Card({ info, index, totalLength, activeIndex }: CardProps) {
  const stylez = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      zIndex: totalLength - index,
      opacity: interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [1 - 1 / maxVisibleItems, 1, 1],
      ),
      transform: [
        {
          translateY: interpolate(
            activeIndex.value,
            [index - 1, index, index + 1],
            [-layout.cardsGap, 0, layout.height - layout.cardsGap * 2],
            {
              // If you'd like to stack the bottom cards on top of eachother
              // add CLAMP instead of EXTEND.
              // extrapolateRight: Extrapolate.CLAMP,
              extrapolateRight: Extrapolate.EXTEND,
            },
          ),
        },
        {
          scale: interpolate(
            activeIndex.value,
            [index - 1, index, index + 1],
            [0.95, 1, 1],
          ),
        },
      ],
    }
  })
  return (
    <Animated.View style={[styles.card, stylez]}>
      <Text
        style={[
          styles.title,
          {
            position: 'absolute',
            top: -layout.spacing,
            right: layout.spacing,
            fontSize: 102,
            color: colors.primary,
            opacity: 0.05,
          },
        ]}
      >
        {index}
      </Text>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{info.type}</Text>
        <View style={styles.row}>
          <Entypo name="clock" size={16} style={styles.icon} />
          <Text style={styles.subtitle}>
            {info.from} - {info.to}
          </Text>
        </View>
        <View style={styles.row}>
          <Entypo name="location" size={16} style={styles.icon} />
          <Text style={styles.subtitle}>{info.distance} km</Text>
        </View>
        <View style={styles.row}>
          <Entypo name="suitcase" size={16} style={styles.icon} />
          <Text style={styles.subtitle}>{info.role}</Text>
        </View>
      </View>
      <Image source={{ uri: locationImage }} style={styles.locationImage} />
    </Animated.View>
  )
}

// Menu component + data
const menu = ['Home', 'About', 'Contact', 'Settings', 'Logout']
type MenuProps = {
  menu: typeof menu
  activeMenuIndex?: number
  onClose: () => void
  onMenuPress: (index: number) => void
  isMenuVisible: boolean
}

function Menu({
  menu,
  activeMenuIndex = 0,
  onClose,
  onMenuPress,
  isMenuVisible,
}: MenuProps) {
  // We use LayoutAnimations to toggle mount/unmount
  if (!isMenuVisible) {
    return null
  }
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut.delay(500)}
      style={[StyleSheet.absoluteFillObject, { zIndex: 9999999 }]}
      pointerEvents={'box-none'}
    >
      <Pressable onPress={onClose} style={StyleSheet.absoluteFillObject}>
        <View
          style={{ backgroundColor: colors.dark, opacity: 0.45, flex: 1 }}
        />
      </Pressable>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          padding: layout.cardsGap * 2,
          gap: layout.spacing,
        }}
        pointerEvents="box-none"
      >
        {menu.map((item, index) => {
          return (
            <Pressable onPress={() => onMenuPress(index)} key={index}>
              <Animated.Text
                entering={FadeInRight.delay(50 * index)}
                exiting={FadeOutRight.delay((menu.length - index) * 50)}
                style={{
                  fontSize: 32,
                  fontWeight: 'bold',
                  color: colors.light,
                }}
              >
                {index === activeMenuIndex ? '👉 ' : ''}
                {item}
              </Animated.Text>
            </Pressable>
          )
        })}
      </View>
    </Animated.View>
  )
}

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const floatActiveIndex = useSharedValue(0)
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const flingUp = Gesture.Fling()
    .direction(Directions.UP)
    .onStart(() => {
      if (floatActiveIndex.value <= 0) {
        floatActiveIndex.value = 0
        return
      }
      floatActiveIndex.value = withTiming(floatActiveIndex.value - 1, {
        duration,
      })
    })

  const flingDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .onStart(() => {
      if (floatActiveIndex.value === data.length) {
        return
      }

      floatActiveIndex.value = withTiming(floatActiveIndex.value + 1, {
        duration,
      })
    })
  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onStart(() => {
      'worklet'
      runOnJS(setIsMenuVisible)(false)
    })
  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onStart(() => {
      'worklet'
      runOnJS(setIsMenuVisible)(true)
    })

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar hidden />
      <Menu
        menu={menu}
        activeMenuIndex={activeIndex}
        onMenuPress={(index) => {
          setActiveIndex(index)
          setIsMenuVisible(false)
        }}
        onClose={() => setIsMenuVisible(false)}
        isMenuVisible={isMenuVisible}
      />
      <GestureDetector
        // We use Exclusive to prevent using different gestures at the same time
        // There's only one gesture that can be performed. This is by design.
        // If you would like to support multiple gestures, you can use `Simultaneous`
        gesture={Gesture.Exclusive(flingUp, flingDown, flingRight, flingLeft)}
      >
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: layout.cardsGap * 2,
          }}
          pointerEvents="box-none"
        >
          {data.map((c, index) => {
            return (
              <Card
                info={c}
                key={c.id}
                index={index}
                totalLength={data.length - 1}
                activeIndex={floatActiveIndex}
              />
            )
          })}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: colors.primary,
    padding: layout.spacing,
  },
  card: {
    borderRadius: layout.borderRadius,
    width: layout.width,
    height: layout.height,
    padding: layout.spacing,
    backgroundColor: colors.light,
  },
  title: { fontSize: 32, fontWeight: '600' },
  subtitle: {},
  cardContent: {
    gap: layout.spacing,
    marginBottom: layout.spacing,
  },
  locationImage: {
    flex: 1,
    borderRadius: layout.borderRadius - layout.spacing / 2,
  },
  row: {
    flexDirection: 'row',
    columnGap: layout.spacing / 2,
    alignItems: 'center',
  },
  icon: {},
})
