// Inspiration: https://ro.pinterest.com/pin/270497521358783664/

import * as React from 'react';
import {StatusBar, Image, FlatList, Dimensions, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import Animated, {Extrapolate, useAnimatedProps, useDerivedValue, useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate} from 'react-native-reanimated'
import chroma from 'chroma-js'

const {width, height} = Dimensions.get('window');

const colors = chroma.scale(['#fafa6e','#2A4858'])
    .mode('lch').colors(14)


    console.log({colors})

const data = colors.map((color, index) => ({
  key: color,
  bg: color,
  image: `https://source.unsplash.com/collection/31433654/300x${560 + index}`
}))

const _itemWidth = width * .65;
const _itemHeight = _itemWidth * 1.67;
const _spacing = 10;
const withTranslateY = true;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Item = React.memo(({item, index, scrollX}) => {
  const activeIndex = useDerivedValue(() => {
    return scrollX.value / (_itemWidth + _spacing)
  })
  const stylez = useAnimatedStyle(() => {
    return {
      transform: [{perspective: _itemWidth}, {
        rotateY: `${interpolate(activeIndex.value, [index -1 , index, index + 1], [-45, 0, 45], Extrapolate.CLAMP)}deg`
      }, {
        translateX: interpolate(activeIndex.value, [index -1 , index, index + 1], [-_itemWidth / 2 * Math.cos(45), 0, _itemWidth / 2 * Math.cos(45)], Extrapolate.CLAMP)
      }
      , {
        translateY: withTranslateY ? interpolate(activeIndex.value, [index -1 , index, index + 1], [-_itemHeight / 4 * Math.sin(45), 0, _itemHeight / 4 * Math.sin(45)], Extrapolate.CLAMP) : 0
      }
      ]
    }
  });


  return <Animated.Image
    source={{uri: item.image}}
    style={[{width: _itemWidth, height: _itemHeight, backgroundColor: item.bg, marginRight: _spacing, resizeMode: "cover", borderRadius: 32}, stylez]}
  />
})



export default function App() {
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(ev => {
    scrollX.value = ev.contentOffset.x
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden={true}/>
      <AnimatedFlatList 
        data={data}
        keyExtractor={item => item.key}
        horizontal
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={_itemWidth + _spacing}
        contentContainerStyle={{
          paddingRight: width - (_itemWidth + _spacing),
          paddingVertical: _spacing
        }}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        renderItem={({item, index}) => {
          return <Item item={item} index={index} scrollX={scrollX}/>
        }}
      />
      <Text style={{padding: _spacing, marginBottom: _spacing * 3, fontSize: 32, letterSpacing: -1, fontWeight: '800'}}>{withTranslateY ? 'with translateY' : 'without translateY'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: _spacing,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
