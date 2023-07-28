// Inspiration: https://dribbble.com/shots/15057600-Wallpapers-App-Interactions
import { MotiView } from '@motify/components';
import { AnimatePresence } from 'framer-motion';
import * as React from 'react';
import { Animated, Dimensions, ImageBackground, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

const API_KEY = 'YOUR_PEXELS_API_KEY';
const COLLECTION = 'k4yque3';
// const URL = `https://api.pexels.com/v1/collections/${COLLECTION}`;
const URL = `https://api.pexels.com/v1/search?query=wallpaper&orientation=portrait`;

const { width, height } = Dimensions.get('screen');

const IMAGE_WIDTH = width * 0.8;
const IMAGE_HEIGHT = height * 0.75;
const SPACING = 10;

export default function Wallpapers() {
  const [data, setData] = React.useState([]);
  const memoData = React.useRef(null);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    (async function getData() {
      if (!!memoData.current) {
        setData(memoData.current);
        return;
      }

      const data = await fetch(URL, {
        headers: {
          Authorization: API_KEY,
        },
      }).then((x) => x.json());

      console.log(data[0]);
      memoData.current = data.photos;
      setData(data.photos);
    })();
  }, []);

  return (
    <View
      style={{ flex: 1, backgroundColor: '#000', justifyContent: 'flex-end' }}>
      <StatusBar barStyle='light-content' />
      <AnimatePresence>
        {data.length === 0 && (
          <MotiView
            key='loading'
            from={{ opacity: 0.8, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{
              type: 'timing',
              duration: 1000,
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              width,
              height,
            }}>
            <Text>Loading ...</Text>
          </MotiView>
        )}
      </AnimatePresence>
      <View style={[StyleSheet.absoluteFillObject]}>
        {data.map((item, index) => {
          // doing it faster instead of halfway through
          const inputRange = [index - 0.8, index, index + 0.8];
          const animated = Animated.divide(scrollX, IMAGE_WIDTH + SPACING * 2);

          const opacity = animated.interpolate({
            inputRange,
            outputRange: [0, 0.4, 0],
          });
          const textOpacity = animated.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
          });
          const textTranslate = animated.interpolate({
            inputRange,
            outputRange: [200, 0, -200],
          });
          return (
            <SafeAreaView
              key={`bg-item-${item.id}`}
              style={[StyleSheet.absoluteFillObject]}>
              <Animated.Image
                source={{ uri: item.src.portrait }}
                style={[StyleSheet.absoluteFillObject, { opacity }]}
                blurRadius={30}
              />
              <View
                style={[
                  {
                    flex: 0.25,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: data.length + 1,
                  },
                ]}>
                <Animated.View
                  style={{
                    opacity: textOpacity,
                    transform: [{ translateX: textTranslate }],
                    marginBottom: SPACING * 2,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 28,
                      marginBottom: SPACING / 2,
                      fontWeight: '800',
                      textTransform: 'capitalize',
                    }}>
                    {item.photographer}
                  </Text>
                  <Text
                    style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}
                    numberOfLines={1}
                    adjustsFontSizeToFit>
                    Explore awesome wallpapers
                  </Text>
                </Animated.View>
                <Animated.View
                  style={{
                    opacity: textOpacity,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: '600',
                      marginRight: SPACING,
                    }}>
                    100 Wallpapers
                  </Text>
                  <ImageBackground
                    source={{ uri: item.src.tiny }}
                    style={{
                      backgroundColor: 'red',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: SPACING / 2,
                      paddingHorizontal: SPACING,
                      borderRadius: 20,
                      overflow: 'hidden',
                    }}
                    blurRadius={80}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: '800',
                      }}>
                      50 new
                    </Text>
                  </ImageBackground>
                </Animated.View>
              </View>
            </SafeAreaView>
          );
        })}
      </View>
      <Animated.FlatList
        data={data}
        extraData={data}
        keyExtractor={(item) => String(item.id)}
        scrollEventThrottle={16}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: (width - (IMAGE_WIDTH + SPACING * 2)) / 2,
        }}
        style={{ flexGrow: 0, backgroundColor: 'transparent' }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: true,
          }
        )}
        snapToInterval={IMAGE_WIDTH + SPACING * 2}
        decelerationRate='fast'
        renderItem={({ item, index }) => {
          const inputRange = [index - 1, index, index + 1];
          const animated = Animated.divide(scrollX, IMAGE_WIDTH + SPACING * 2);

          const translateY = animated.interpolate({
            inputRange,
            outputRange: [100, 40, 100],
            extrapolate: 'clamp',
          });
          const scale = animated.interpolate({
            inputRange,
            outputRange: [1.5, 1, 1.5],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              style={{
                width: IMAGE_WIDTH,
                height: IMAGE_HEIGHT,
                transform: [
                  {
                    translateY,
                  },
                ],
                margin: SPACING,
                overflow: 'hidden',
                borderRadius: 30,
              }}>
              <Animated.Image
                style={{
                  borderRadius: 20,
                  width: IMAGE_WIDTH,
                  height: IMAGE_HEIGHT,
                  resizeMode: 'cover',
                  transform: [{ scale }],
                }}
                source={{ uri: item.src.medium }}
              />
            </Animated.View>
          );
        }}
      />
    </View>
  );
}
