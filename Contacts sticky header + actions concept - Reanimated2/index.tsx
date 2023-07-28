// Inspiration: https://dribbble.com/shots/16413223-Android-Phone-App-Concept

import * as React from 'react';
import {
  Dimensions,
  Image,
  FlatList,
  Text,
  View,
  StyleSheet,
  StatusBar
} from 'react-native';
import Animated, {
  interpolate,
  Extrapolate,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import Constants from 'expo-constants';
import { faker } from '@faker-js/faker';
import chroma from 'chroma-js';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const { width, height } = Dimensions.get('window');
const _columns = 2;
const _itemSize = width / 2;
const _spacing = 10;
const _headerSpacing = height * .3;
const _headerFontSize = 74;

faker.seed(4);

const colors = chroma.scale(['yellow', 'navy']).mode('lch').colors(50);

const data = [...Array(50).keys()].map((i) => {
  const bg = colors[faker.random.number(49)];
  const text = chroma.contrast(bg, 'white') > 4.5 ? 'white' : 'black';
  const hasAvatar = faker.random.boolean();
  const gender = faker.name.gender();
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);
  return {
    key: faker.datatype.uuid(),
    hasAvatar,
    avatar: hasAvatar && `https://i.pravatar.cc/200?u=${faker.datatype.uuid()}`,
    firstName,
    lastName,
    initials: `${firstName.substring(0, 1)}${lastName.substring(0, 1)}`,
    bg,
    text,
  };
});

export default function App() {
  const scrollY = useSharedValue(0);
  const headerHeight = useSharedValue(height);

  const onScroll = useAnimatedScrollHandler((event) => {
    console.log(event.contentOffset.y);
    scrollY.value = event.contentOffset.y;
  });

  const textStylez = useAnimatedStyle(() => {
    return {
      fontSize: interpolate(
        scrollY.value,
        // stick the headerSpacing
        [0, _headerSpacing, headerHeight.value],
        [_headerFontSize, 24, 24],
        Extrapolate.CLAMP
      )
    }
  })
  const headerContainerStyle = useAnimatedStyle(() => {
    return {
      // marginTop: interpolate(scrollY.value, [0, 100], [50, 0], Extrapolate.CLAMP),
      marginBottom: interpolate(
        scrollY.value,
        // stick the headerSpacing
        [-1, 0, _headerSpacing + _headerFontSize, headerHeight.value + _headerFontSize],
        [_headerSpacing+1, _headerSpacing, 0, 0],
      ),
    };
  });

  const dummyHeaderStylez = useAnimatedStyle(() => {
    return {
      height: headerHeight.value,
    };
  });

  return (
    <View style={styles.container}>
    <StatusBar hidden/>
    <View style={[{zIndex: 1, position: 'absolute', left: 0, right: 0, padding: _spacing, backgroundColor: '#0B1C33'}, styles.statusBar]}
          onLayout={(ev) => {
          if (headerHeight.value === ev.nativeEvent.layout.height || headerHeight.value !== height) {
            return;
          }
          headerHeight.value = withTiming(ev.nativeEvent.layout.height, {
            duration: 0,
          });
        }}
      >
        <Animated.View
        >
          <Animated.Text
            style={[{
              color: 'white',
              fontSize: 54,
              fontWeight: '700',
              letterSpacing: -1,
              paddingRight: width / 4 - _spacing * 2,
            }, textStylez]}
            numberOfLines={1}
            adjustsFontSizeToFit>
            Favorites
          </Animated.Text>
          <Text style={{ color: 'white' }}>{data.length} contacts</Text>
        </Animated.View>
        <Animated.View 
          style={headerContainerStyle}
        />
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-end',
            position: 'absolute',
            bottom: _spacing,
            right: _spacing,
            width: width / 4,
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <Feather name="search" size={24} color="white" />
          <Feather name="plus" size={24} color="white" />
          <Feather name="more-vertical" size={24} color="white" />
        </View>
      </View>
      <AnimatedFlatList
        data={data}
        numColumns={_columns}
        keyExtractor={(item) => item.key}
        scrollEventThrottle={16}
        onScroll={onScroll}
        ListHeaderComponent={<Animated.View style={dummyHeaderStylez} />}
        stickyHeaderIndices={[0]}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                width: _itemSize,
                height: _itemSize,
                backgroundColor: item.bg,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {item.hasAvatar ? (
                <Image
                  source={{ uri: item.avatar }}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <Text
                  style={{
                    color: item.text,
                    fontSize: 94,
                    fontWeight: 'bold',
                    opacity: 0.1,
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit>
                  {item.initials}
                </Text>
              )}
              <LinearGradient
                colors={
                  item.hasAvatar
                    ? ['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,.8)']
                    : ['transparent', 'transparent']
                }
                style={[
                  StyleSheet.absoluteFillObject,
                  { justifyContent: 'flex-end', padding: _spacing },
                ]}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: item.hasAvatar ? '#fff' : item.text,
                    fontWeight: '600',
                  }}>
                  {item.firstName} {item.lastName}
                </Text>
              </LinearGradient>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1C33',
  },
  statusBar: {
    paddingTop: Constants.statusBarHeight
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
