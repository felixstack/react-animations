// Inspiration: https://dribbble.com/shots/15107351-Grenouille-animation

import * as React from 'react';
import {
  StatusBar,
  Image,
  FlatList,
  Pressable,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Constants from 'expo-constants';
import { faker } from '@faker-js/faker';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Animated, {
  Easing,
  Layout,
  FadeOut,
  FadeInRight,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { withAnchorPoint } from 'react-native-anchor-point';
import { MotiText, MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Montserrat_500Medium,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { Lobster_400Regular } from '@expo-google-fonts/lobster';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// Grabbed from https://www.flaticon.com/stickers-pack/karaoke-5
const _icons = [
  'https://cdn-icons-png.flaticon.com/256/7915/7915528.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915529.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915530.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915531.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915532.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915533.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915534.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915535.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915536.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915537.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915538.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915539.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915540.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915541.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915542.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915543.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915544.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915547.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915549.png',
  'https://cdn-icons-png.flaticon.com/256/7915/7915551.png',
];

const { width, height } = Dimensions.get('screen');

faker.seed(2);

const _colors = {
  primary: '#f9f9f9',
  secondary: '#AEADA8',
  ternary: '#FEFFFE',
  accent: '#FEEBD4',
};

const _layout = {
  indicatorWidth: 12,
  indicatorHeight: 50,
  itemWidth: width * 0.6,
  itemHeight: width * 0.6 * 1.2,
  spacing: 20,
  borderRadius: 16,
  indicatorHeightPercentage: 0.75,
  headingBig: 54,
  headingSmall: 28,
};

const _tabs = [...Array(3).keys()].map(() => faker.music.genre());
const _data = _tabs.reduce((acc, item) => {
  acc[item] = [...Array(10).keys()].map(() => {
    return {
      key: faker.datatype.uuid(),
      name: faker.music.songName(),
      image: faker.helpers.arrayElement(_icons),
    };
  });

  return acc;
}, {});

const Tabs = ({ tabs, onTabSelect, activeTab, style }) => {
  const _tabRefs = React.useRef({});
  const [isReady, setIsReady] = React.useState(false);
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        width: '20%',
        backgroundColor: _colors.primary,
      }}>
      <View
        style={[
          {
            flex: _layout.indicatorHeightPercentage,
            justifyContent: 'space-between',
            position: 'relative',
          },
          style,
        ]}>
        {isReady && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: _layout.indicatorWidth,
            }}>
            <MotiView
              style={{
                height: _layout.indicatorHeight,
                width: _layout.indicatorWidth,
                backgroundColor: '#000',
                borderRadius: _layout.indicatorWidth / 2,
                left: -_layout.indicatorWidth / 2,
              }}
              animate={{
                // center it
                translateY:
                  _tabRefs.current[activeTab]?.y +
                  _tabRefs.current[activeTab]?.height / 2 -
                  _layout.indicatorHeight / 2,
              }}
              transition={{
                type: 'spring',
                mass: 1,
                stiffness: 300,
                damping: 600,
              }}
            />
          </View>
        )}
        {_tabs.map((tab) => {
          return (
            <Pressable
              key={tab}
              onPress={() => onTabSelect(tab)}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                transform: [{ rotate: '-90deg' }],
                flex: 1,
              }}
              onLayout={(ev) => {
                _tabRefs.current = {
                  ..._tabRefs.current,
                  [tab]: { ...ev.nativeEvent.layout },
                };

                if (
                  Object.keys(_tabRefs.current).length === tabs.length &&
                  !isReady
                ) {
                  setIsReady(true);
                }
              }}>
              <Text
                style={[
                  activeTab === tab
                    ? styles.montserrat700
                    : styles.montserrat400,
                  {
                    fontWeight: activeTab === tab ? '900' : '500',
                    textAlign: 'center',
                    fontSize: 18,
                  },
                ]}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const ListItem = ({ item, index }) => {
  return (
    <Animated.View
      entering={FadeInRight.duration(index > 3 ? 0 : 400)
        .delay(index > 3 ? 0 : 100 + 300 * index)
        .easing(Easing.linear)}
      exiting={FadeOut}
      style={{
        width: _layout.itemWidth,
        height: _layout.itemHeight,
        marginBottom: '30%',
        padding: _layout.spacing,
      }}>
      <View
        style={{
          flex: 1,
          borderRadius: _layout.borderRadius,
          justifyContent: 'flex-end',
          alignItems: 'center',
          backgroundColor: _colors.accent,
          padding: _layout.spacing / 2,
          paddingVertical: '15%',
        }}>
        <Image
          source={{ uri: item.image }}
          style={{
            width: '110%',
            aspectRatio: 1,
            // marginTop: '-60%',
            // marginLeft: '30%',
            marginBottom: _layout.spacing,
            position: 'absolute',
            top: '-50%',
            left: '15%',
          }}
        />
        <Text
          style={[
            styles.lobster400,
            {
              marginRight: _layout.spacing * 2.5,
              fontSize: 26,
              fontWeight: '900',
              textAlign: 'left',
            },
          ]}
          numberOfLines={3}
          // adjustsFontSizeToFit
        >
          {item.name}
        </Text>
        <View
          style={{
            width: '30%',
            aspectRatio: 1,
            backgroundColor: _colors.secondary,
            position: 'absolute',
            right: '-15%',
            bottom: '15%',
            borderRadius: '20%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Feather name="plus" size={20} color="white" />
        </View>
      </View>
    </Animated.View>
  );
};

const Lists = ({ activeTab, data, onScroll }) => {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <AnimatedFlatList
      key={activeTab}
      layout={Layout}
      onScroll={onScroll}
      entering={FadeInRight.delay(100)}
      exiting={FadeOut.duration(400)}
      data={data}
      scrollIndicatorInsets={{ right: -1 }}
      scrollEventThrottle={16}
      animatedProps={Layout}
      renderItem={ListItem}
      style={{ flexGrow: 0 }}
      contentContainerStyle={{
        paddingTop: top + height * (1 - _layout.indicatorHeightPercentage),
        paddingBottom: bottom,
        paddingHorizontal: _layout.spacing,
      }}
    />
  );
};

const Header = ({ scrollY }) => {
  const { top } = useSafeAreaInsets();
  const threshold = React.useMemo(() => {
    return height * (1 - _layout.indicatorHeightPercentage);
  }, []);
  const inputRange = React.useMemo(() => {
    return [-1, 0, 1, threshold - 1, threshold, threshold + 1];
  }, []);
  const headingStyle = useAnimatedStyle(() => {
    return {
      fontSize: interpolate(
        scrollY.value,
        [-1, 0, 1, threshold - 1, threshold, threshold + 1],
        [
          _layout.headingBig,
          _layout.headingBig,
          _layout.headingBig,
          _layout.headingSmall,
          _layout.headingSmall,
          _layout.headingSmall,
        ]
      ),
    };
  });
  const descriptionStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [-1, 0, 1, threshold / 2 - 1, threshold / 2, threshold / 2 + 1],
        [1, 1, 1, 0, 0, 0]
      ),
    };
  });
  return (
    <View
      style={{
        height: height * (1 - _layout.indicatorHeightPercentage),
        position: 'absolute',
        top: 0,
        left: '5%',
        right: '10%',
        zIndex: 1,
        padding: _layout.spacing,
        paddingTop: top,
      }}>
      <Animated.Text
        style={[
          styles.lobster400,
          {
            fontSize: _layout.headingBig,
            color: '#000',
            marginBottom: _layout.spacing,
          },
          headingStyle,
        ]}>
        Learning
      </Animated.Text>
      <Animated.Text
        style={[styles.montserrat400, { fontSize: 12 }, descriptionStyle]}>
        For the things we have to learn before we can do them, we learn by doing
        them.
      </Animated.Text>
    </View>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = React.useState(_tabs[0]);
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
    Lobster_400Regular,
  });
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((ev) => {
    scrollY.value = ev.contentOffset.y;
  });

  React.useEffect(() => {
    scrollY.value = withTiming(0, { duration: 400 });
  }, [activeTab]);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <View style={styles.container}>
        <Header scrollY={scrollY} />
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Tabs
            tabs={_tabs}
            onTabSelect={(tab) => {
              setActiveTab(tab);
            }}
            activeTab={activeTab}
          />
          <Lists
            activeTab={activeTab}
            data={_data[activeTab]}
            onScroll={onScroll}
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  montserrat400: {
    fontFamily: 'Montserrat_400Regular',
  },
  montserrat500: {
    fontFamily: 'Montserrat_500Medium',
  },
  montserrat700: {
    fontFamily: 'Montserrat_700Bold',
  },
  lobster400: {
    fontFamily: 'Lobster_400Regular',
  },
});
