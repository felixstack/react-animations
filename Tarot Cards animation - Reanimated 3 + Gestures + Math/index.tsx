// Inspiration: https://dribbble.com/shots/7696045-Tarot-App-Design

import { useEffect, useState } from 'react'
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import type { SharedValue } from 'react-native-reanimated'
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
// const tarodCardImg = `https://user-images.githubusercontent.com/2805320/245194123-d1fc79fd-c8e1-48a8-b229-59b3f3ec04fb.jpg`
const tarodCardImg = `https://img.freepik.com/free-vector/hand-drawn-esoteric-pattern-design_23-2149346196.jpg?size=500&ext=jpg`
const { width, height } = Dimensions.get('window')

const numberOfCards = 30
type TarotCard = {
  key: string
  uri: string
}
const tarotCards: TarotCard[] = [...Array(numberOfCards).keys()].map((i) => ({
  key: `tarot-card-${i}`,
  uri: tarodCardImg,
}))
const minSize = 120
const tarotCardSize = {
  width: minSize,
  height: minSize * 1.67,
  borderRadius: 12,
}
const TWO_PI = 2 * Math.PI
const theta = TWO_PI / numberOfCards
const tarotCardSizeVisiblePercentage = 0.9
const tarotCardSizeOnCircle =
  tarotCardSizeVisiblePercentage * tarotCardSize.width
const circleRadius = Math.max(
  (tarotCardSizeOnCircle * numberOfCards) / TWO_PI,
  width,
)
const circleCircumference = TWO_PI * circleRadius

// We can also extract x,y based on theta and radius, I am leaving the code here
// but we are going to use a different hack. which is, we are going to make the
// tarod card wrapper height the circle diameter, so that we can use just the
// rotate with `theta * index`, because the transform origin will be the middle
// of the circle and the rotation will work perfectly.
const x = (index: number) => Math.cos(theta) * index * circleRadius
const y = (index: number) => Math.sin(theta) * index * circleRadius
const changeFactor = circleCircumference / width

function TarotCard({
  card,
  cardIndex,
  index,
}: {
  card: TarotCard
  index: SharedValue<number>
  cardIndex: number
}) {
  const mounted = useSharedValue(0)

  useEffect(() => {
    mounted.value = withTiming(1, { duration: 500 })
  }, [])

  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(
            mounted.value,
            [0, 1],
            [0, theta * cardIndex],
          )}rad`,
        },
        {
          translateY: interpolate(
            index.value,
            [cardIndex - 1, cardIndex, cardIndex + 1],
            [0, -tarotCardSize.height / 2, 0],
            Extrapolate.CLAMP,
          ),
        },
      ],
    }
  })
  return (
    <Animated.View
      style={[
        {
          width: tarotCardSize.width,
          height: circleRadius * 2,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 4,
        },
        stylez,
      ]}
    >
      <Image
        key={card.key}
        source={{ uri: card.uri }}
        style={styles.tarotCardBackImage}
      />
    </Animated.View>
  )
}

function TarotWheel({
  cards,
  onCardChange,
}: {
  cards: TarotCard[]
  onCardChange: (cardIndex: number) => void
}) {
  const distance = useSharedValue(0)
  const angle = useDerivedValue(() => {
    return distance.value / circleCircumference
  })
  const interpolatedIndex = useDerivedValue(() => {
    const x = Math.abs((angle.value % TWO_PI) / theta)
    return angle.value < 0 ? x : numberOfCards - x
  })
  const activeIndex = useDerivedValue(() => {
    return Math.round(interpolatedIndex.value)
  })

  const pan = Gesture.Pan()
    .onChange((ev) => {
      distance.value += ev.changeX * changeFactor
    })
    .onFinalize((ev) => {
      distance.value = withDecay(
        {
          velocity: ev.velocityX,
          velocityFactor: changeFactor,
          // deceleration: 0.998,
        },
        () => {
          const v = numberOfCards - activeIndex.value
          const newAngleFloat = -interpolatedIndex.value * theta
          const newAngle = -activeIndex.value * theta
          // Snap to the closest interpolated index and than animate to the actual slide.
          // This is because we would like to "fake" the snap and avoid rotating the entire
          // circle in case when moving from positive to negative (and viceversa) angles.
          // If we are using directly the withSpring animation, this will look awful, because
          // we will move from let's say from -circleCircumference / 2 to  +circleCircumference / 4
          // the animation will be really fast because it should rotate the circle 275 degrees
          // So the below math equation will actually position the distance exactly where it is so that
          // the distance it's directly changed (using the float index value) and than start the spring
          // animation
          distance.value = newAngleFloat * circleCircumference
          distance.value = withSpring(newAngle * circleCircumference)
          runOnJS(onCardChange)(activeIndex.value)
        },
      )
    })

  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${angle.value}rad`,
        },
      ],
    }
  })
  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          {
            width: circleRadius * 2,
            height: circleRadius * 2,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            // bottom: -circleRadius,
            top: height - tarotCardSize.height * 2,
          },
          stylez,
        ]}
      >
        {cards.map((card, cardIndex) => {
          return (
            <TarotCard
              card={card}
              key={card.key}
              index={interpolatedIndex}
              cardIndex={cardIndex}
            />
          )
        })}
      </Animated.View>
    </GestureDetector>
  )
}

export function TarotCards() {
  const [activeCardIndex, setActiveCardIndex] = useState<null | number>(null)
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#164aa1',
      }}
    >
      <StatusBar hidden />

      {activeCardIndex && (
        <Text
          style={{
            position: 'absolute',
            top: 100,
            color: 'white',
            fontWeight: '700',
          }}
        >
          Selected card: {activeCardIndex}
        </Text>
      )}
      <TarotWheel
        cards={tarotCards}
        onCardChange={(cardIndex) => setActiveCardIndex(cardIndex)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  tarotCardBackImage: {
    width: tarotCardSize.width,
    height: tarotCardSize.height,
    borderRadius: tarotCardSize.borderRadius,
    resizeMode: 'repeat',
    borderWidth: 4,
    borderColor: 'white',
  },
})