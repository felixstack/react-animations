// Inspiration: https://dribbble.com/shots/16367172-Social-media-app-UI-screen

import * as React from 'react';
import {
  StatusBar,
  TouchableWithoutFeedback,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Constants from 'expo-constants';
import faker from 'faker';
import Animated, {
  useAnimatedStyle,
  useAnimatedProps,
  useSharedValue,
  withTiming,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';
const { width, height } = Dimensions.get('window');
import { ReText } from 'react-native-redash';
import AppLoading from 'expo-app-loading';
import AnimatedText from './AnimatedText';
import { AntDesign } from '@expo/vector-icons';
import {
  useFonts,
  Inter_500Medium,
  Inter_300Light,
  Inter_400Regular,
  Inter_700Bold,
  Inter_900Black,
} from '@expo-google-fonts/inter';

const _months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
faker.seed(21);
const _min = 3000;
const _max = 10000;
const _limit = _min + _max;
const _minH = height * 0.1;
const _maxH = height * 0.4;
const _maxItems = 6;
const _itemWidth = width / (_maxItems + 2);
const _colors = {
  active: '#329F82',
  inactive: '#E9F0EE',
  up: '#329F82',
  down: '#E7B824',
};

// Code grabbed from https://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value
function scaleBetween(
  value,
  minH = _minH,
  maxH = _maxH,
  min = _min,
  max = _limit
) {
  return Math.round(((maxH - minH) * (value - min)) / (max - min) + minH);
}

const _data = _months.map((month) => {
  const visitors = faker.datatype.number(_max) + _min;

  return {
    key: month,
    visitors,
    visitorsHeight: scaleBetween(visitors),
    usage: faker.datatype.number(4000) + _min,
  };
});

const Item = ({ d, activeIndex, index, onPress }) => {
  const v = useDerivedValue(() => {
    return withTiming(activeIndex.value - index === 0 ? 1 : 0.15);
  });
  const stylez = useAnimatedStyle(() => {
    return {
      // backgroundColor: interpolateColor(v.value, [index -1.3, index, index +1.3], [_colors.inactive, _colors.active, _colors.inactive])
      opacity: v.value,
    };
  });
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        key={d.key}
        style={{ width: _itemWidth, justifyContent: 'flex-end' }}>
        <Animated.View
          style={[
            {
              height: d.visitorsHeight,
              backgroundColor: _colors.active,
              borderRadius: 16,
              marginBottom: 10,
            },
            stylez,
          ]}
        />
        <Text
          style={{
            textTransform: 'uppercase',
            fontSize: 10,
            fontWeight: '700',
            alignSelf: 'center',
            fontFamily: 'Inter_900Black',
          }}>
          {d.key}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
const AnimatedAntDesign = Animated.createAnimatedComponent(AntDesign);
const BottomStats = ({ label, activeIndex, percentage, data, value }) => {
  const direction = useDerivedValue(() => {
    return withTiming(percentage.value < 0 ? -1 : 1);
  });
  const newPercentage = useDerivedValue(() => {
    return Math.abs(percentage.value);
  });
  const animatedProps = useAnimatedProps(() => {
    return {
      color: interpolateColor(
        direction.value,
        [-1, 1],
        [_colors.down, _colors.up]
      ),
    };
  });
  const iconStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${-direction.value * 45}deg`,
        },
      ],
    };
  });
  return (
    <View style={{ width: width / 2 }}>
      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 32 }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        <AnimatedText
          text={value}
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 32,
            lineHeight: 32 * 1.4,
            width: 90,
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <AnimatedAntDesign
            name="arrowright"
            size={24}
            animatedProps={animatedProps}
            style={iconStyles}
          />
          <AnimatedText
            text={newPercentage}
            formatter="%"
            style={{ fontFamily: 'Inter_500Medium', fontSize: 16 }}
          />
        </View>
      </View>
    </View>
  );
};

export default function App() {
  const activeIndex = useSharedValue(0);
  const visitorsValue = useSharedValue(_data[activeIndex.value].visitors);
  const usageValue = useSharedValue(_data[activeIndex.value].usage);
  const prevVisitorsPercentage = useSharedValue(0);
  const prevUsagePercentage = useSharedValue(0);
  const totalVisitors = React.useMemo(() =>
    _data.reduce((acc, item) => (acc += item.visitors), 0)
  );
  let [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Inter_900Black,
  });
  // const value = useDerivedValue(() => {
  //   return withTiming(_data[activeIndex.value].visitors);
  // })

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={{ alignItems: 'center', marginBottom: height * 0.1 }}>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 52 }}>
          {totalVisitors}
        </Text>
        <Text style={{ fontFamily: 'Inter_300Light', fontSize: 32 }}>
          Last 6 months
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: height * 0.05,
        }}>
        {_data.slice(0, _maxItems).map((d, index) => {
          return (
            <Item
              d={d}
              activeIndex={activeIndex}
              index={index}
              onPress={() => {
                activeIndex.value = index;
                visitorsValue.value = withTiming(d.visitors);
                usageValue.value = withTiming(d.usage);
                const prevVisitors = _data[index - 1]
                  ? _data[index - 1].visitors
                  : d.visitors;
                const prevUsage = _data[index - 1]
                  ? _data[index - 1].usage
                  : d.usage;
                prevVisitorsPercentage.value = withTiming(
                  (d.visitors * 100) / prevVisitors - 100
                );
                prevUsagePercentage.value = withTiming(
                  (d.usage * 100) / prevUsage - 100
                );
              }}
            />
          );
        })}
      </View>
      <View style={{ flexDirection: 'row' }}>
        <BottomStats
          data={_data}
          activeIndex={activeIndex}
          percentage={prevVisitorsPercentage}
          value={visitorsValue}
          label="Visitors"
        />
        <BottomStats
          data={_data}
          activeIndex={activeIndex}
          percentage={prevUsagePercentage}
          value={usageValue}
          label="Usage"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
    padding: 20,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
