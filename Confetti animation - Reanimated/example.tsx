import { Entypo } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { StatusBar } from 'expo-status-bar'
import { MotiView } from 'moti'
import { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated'

import { BrandedFeatures } from './animations/BrandedFeatures'

const types = ['', 'image', 'text', 'image_alt', 'view', 'multiple elements'] as const
const duration = 6000
export default function App() {
  const [index, setIndex] = useState(4)
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setIndex((index + 1) % types.length)
      }}
    >
      <View style={styles.container}>
        <Animated.Text
          key={index}
          entering={FadeInDown}
          exiting={FadeOutUp}
          style={{
            textTransform: 'uppercase',
            color: 'gold',
            fontWeight: '700',
            fontFamily: 'Menlo',
            fontSize: 20,
            zIndex: 999,
          }}
        >
          {types[index]}
        </Animated.Text>
        <StatusBar hidden />
        {types[index] === 'multiple elements' && (
          <Animated.View
            key={`arrow-${index}`}
            entering={FadeInDown.delay(duration - 2000)}
            style={{
              position: 'absolute',
              top: 120,
              left: 60,
              zIndex: 999,
            }}
          >
            <MotiView
              from={{ translateY: 10 }}
              animate={{ translateY: 0 }}
              transition={{
                type: 'timing',
                loop: true,
              }}
              style={{ alignItems: 'center' }}
            >
              <Entypo size={120} name="arrow-long-up" color="gold" />
              <Text style={{ fontFamily: 'Menlo', color: 'gold' }}>Auto cleanup</Text>
            </MotiView>
          </Animated.View>
        )}
        <BrandedFeatures key={types[index]} count={40} duration={duration}>
          {types[index] === 'view' && (
            <View
              style={{
                width: 50,
                height: 50,
                backgroundColor: 'gold',
                borderRadius: 10,
              }}
            />
          )}
          {types[index] === 'multiple elements' && (
            <View style={{ alignItems: 'center', gap: 10 }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: 'gold',
                  borderRadius: 10,
                }}
              />
              <Text style={{ color: 'gold', fontWeight: '700', fontFamily: 'Menlo' }}>
                Text Element
              </Text>
              <TextInput
                style={{
                  paddingHorizontal: 6,
                  borderWidth: 2,
                  borderColor: 'gold',
                  borderRadius: 10,
                  width: '100%',
                  fontSize: 14,
                }}
                placeholder="TextInput"
                placeholderTextColor="gold"
              />
            </View>
          )}
          {types[index] === 'text' && (
            <Text style={{ color: 'gold', fontWeight: '700', fontFamily: 'Menlo' }}>
              AnimateReactNative.com
            </Text>
          )}
          {types[index] === 'image' && (
            <Image
              source={{
                uri: 'https://user-images.githubusercontent.com/2805320/267785549-2434e337-868c-4a91-a3fb-42277986b12f.png',
              }}
              style={{
                width: 70,
                height: 70,
              }}
              contentFit="contain"
            />
          )}
          {types[index] === 'image_alt' && (
            <Image
              source={{ uri: 'https://www.animatereactnative.com/animatereactnative_dark.svg' }}
              style={{
                width: 120,
                height: 70,
              }}
              contentFit="contain"
            />
          )}
        </BrandedFeatures>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
