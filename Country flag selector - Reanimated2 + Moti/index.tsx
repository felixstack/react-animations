import * as React from 'react';
import {
  Dimensions,
  Image,
  FlatList,
  Text,
  View,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import Constants from 'expo-constants';
import Animated, {
  interpolate,
  withSpring,
  withTiming,
  useDerivedValue,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useAnimatedRef,
  scrollTo,
  useAnimatedReaction,
} from 'react-native-reanimated';
import flags from './flags';

const { width, height } = Dimensions.get('window');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const _flagSize = Math.floor(width * 0.15);
const _spacing = 4;
const _flatSizeWithMargins = _flagSize + _spacing * 2;
const _selectedFlagBorder = 2;
const _selectedFlagContainer = _flagSize + _selectedFlagBorder * 4;
const _flatlistInnerSpacing = width / 2 - _flagSize / 2 - _spacing;
const _flagSelectorLeftPosition = width / 2 - _selectedFlagContainer / 2;
const scaleFactor = 0.2;

const snapTo = (value, step) => {
  'worklet';
  return Math.round(value / step) * step;
};

const Flag = ({ item, index, scrollX }) => {
  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollX.value / _flatSizeWithMargins,
            [index - 1, index, index + 1],
            [1 - scaleFactor, 1, 1 - scaleFactor]
          ),
        },
      ],
      opacity: interpolate(
        scrollX.value / _flatSizeWithMargins,
        [index - 1, index, index + 1],
        [1 - scaleFactor, 1, 1 - scaleFactor]
      ),
    };
  });
  return (
    <Animated.View
      style={[
        {
          width: _flagSize,
          height: _flagSize,
          borderRadius: _flagSize,
          overflow: 'hidden',
          marginHorizontal: _spacing,
        },
        stylez,
      ]}>
      <Image
        source={{ uri: item.image }}
        style={{ flex: 1, resizeMode: 'contain' }}
      />
    </Animated.View>
  );
};

const ActiveIndex = ({ activeIndicator }) => {
  const stylez = useAnimatedStyle(() => {
    return {
      opacity: withTiming(activeIndicator.value, {
        duration: activeIndicator.value === 0 ? 100 : 300,
      }),
      transform: [
        {
          scale: withTiming(activeIndicator.value, { duration: 300 }),
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        {
          width: _selectedFlagContainer,
          height: _selectedFlagContainer,
          borderWidth: _selectedFlagBorder,
          borderRadius: _selectedFlagContainer,
          borderColor: 'rgba(255,255,255,0.9)',
          backgroundColor: 'transparent',
          position: 'absolute',
          alignSelf: 'center',
          // left: _flagSelectorLeftPosition,
        },
        stylez,
      ]}
    />
  );
};

export default function App() {
  const scrollX = useSharedValue(0);
  const activeIndicator = useSharedValue(1);
  const aref = useAnimatedRef();
  const onScroll = useAnimatedScrollHandler({
    onScroll: (ev) => {
      if (Platform.OS === 'web') {
        // Hack to check when the scroll has finished!
        activeIndicator.value = scrollX.value === ev.contentOffset.x ? 1 : 0;
      }
      scrollX.value = ev.contentOffset.x;
      if (activeIndicator.value !== 0 && Platform.OS !== 'web') {
        activeIndicator.value = 0;
      }
      // animated back the circle indicator
    },
    onMomentumEnd: () => {
      // PS: On web we don't have this event!
      activeIndicator.value = 1;
    },
  });

  useAnimatedReaction(
    () => {
      return { activeIndicator: activeIndicator.value, scrollX: scrollX.value };
    },
    (result, previous) => {
      if (
        (result.activeIndicator === 1 || result.scrollX === previous.scrollX) &&
        Platform.OS === 'web'
      ) {
        aref.current?.scrollToOffset({
          offset: snapTo(scrollX.value, _flatSizeWithMargins),
          animated: true,
        });
        // scrollTo(aref, snapTo(scrollX.value, _flagSize), 0, true)
      }
    }
  );
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActiveIndex activeIndicator={activeIndicator} />
        <AnimatedFlatList
          ref={aref}
          data={flags}
          horizontal
          style={{ flexGrow: 0 }}
          scrollEventThrottle={16}
          onScroll={onScroll}
          // PS: On web this is not working!
          snapToInterval={_flatSizeWithMargins}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: _flatlistInnerSpacing }}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item, index }) => (
            <Flag item={item} index={index} scrollX={scrollX} />
          )}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 100,
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <Text style={{ color: 'white', fontSize: 18 }}>Platform: </Text>
          <Text style={{ color: 'white', fontWeight: '900', fontSize: 18 }}>
            {Platform.OS}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#222',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
