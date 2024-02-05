import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Flower } from '../components/Flower';

const gradients = [
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

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function Details() {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <AnimatedLinearGradient
          // Background Linear Gradient
          key={`gradient-${activeIndex}`}
          start={[0, 0]}
          end={[0, 1]}
          exiting={FadeOut.duration(1000)}
          entering={FadeIn.duration(1000)}
          colors={[gradients[activeIndex].start, gradients[activeIndex].end]}
          style={StyleSheet.absoluteFillObject}
        />
        <Flower
          leafs={13}
          size={width * 0.8}
          initialActiveIndex={0}
          gradients={gradients}
          duration={1000}
          onPress={(index) => {
            console.log(index);
            setActiveIndex(index);
          }}
        />
    </View>
  );
}
