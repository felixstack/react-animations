import { MotiView, AnimatePresence, motify } from 'moti';
import faker from '@faker-js/faker';
import * as React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';
import Svg, { G } from 'react-native-svg';

const { width } = Dimensions.get('screen');
const AnimatedG = motify(G)();

faker.seed(2);

const colors = {
  primary: '#3F226D',
  secondary: '#FA75BB',
  bg: '#3E1870',
};
const icons = ['🎸', '🏝', '💻'];
const name = ['Buy a Guitar', 'Travelling', 'New laptop'];
const data = icons.map((icon, index) => ({
  key: faker.random.uuid(),
  goal: faker.commerce.price(2000, 4000, 0),
  saved: faker.commerce.price(300, 1500, 0),
  icon,
  name: name[index],
}));

const _spacing = 20;
const _borderRadius = 30;
const _iconSize = 32;

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const ReText = (props) => {
  const { text, style } = { style: {}, ...props };
  const animatedProps = useAnimatedProps(() => {
    return {
      text: `${Math.round(text.value)}%`,
      defaultValue: `${Math.round(text.value)}%`,
    };
  });
  return (
    <AnimatedTextInput
      underlineColorAndroid='transparent'
      editable={false}
      animatedProps={animatedProps}
      style={style}
    />
  );
};

const Indicator = ({ percentage }) => {
  const [barWidth, setBarWidth] = React.useState(-300);
  const xxx = useDerivedValue(() => {
    return barWidth < 0
      ? barWidth
      : withTiming(-barWidth + (barWidth * percentage) / 100, {
          duration: 1000,
          easing: Easing.inOut(Easing.poly(4)),
        });
  }, [barWidth]);

  const animated = useDerivedValue(() => {
    return barWidth < 0
      ? 0
      : withTiming(percentage, {
          duration: 1000,
          easing: Easing.inOut(Easing.poly(4)),
        });
  }, [barWidth]);

  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: xxx.value,
        },
      ],
    };
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ReText
        text={animated}
        style={{
          fontSize: 14,
          marginBottom: _spacing / 2,
          alignSelf: 'center',
          color: colors.secondary,
          fontWeight: '700',
        }}
      />
      <View
        onLayout={(ev) => {
          setBarWidth(ev.nativeEvent.layout.width);
        }}
        style={{
          height: 8,
          backgroundColor: colors.bg,
          overflow: 'hidden',
          borderRadius: '50%',
        }}>
        <View style={{ backgroundColor: 'red', width: '100%' }} />
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              rigth: 0,
              width: '100%',
              backgroundColor: colors.secondary,
              height: 10,
            },
            stylez,
          ]}
        />
      </View>
    </View>
  );
};

const Item = ({ item }) => {
  const [selected, setSelected] = React.useState();
  return (
    <Pressable
      key={item.key}
      onPress={() => {
        setSelected((selected) => !selected);
      }}>
      <View
        style={{
          borderRadius: _borderRadius,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.1)',
          marginBottom: _spacing,
          height: 120,
          justifyContent: 'center',
        }}>
        <AnimatePresence>
          {!selected && (
            <MotiView
              key='front'
              style={{
                borderRadius: _borderRadius,
                flexDirection: 'row',
                alignItems: 'center',
                padding: _spacing,
                transform: [
                  {
                    perspective: 1000,
                  },
                ],
              }}
              from={{
                transform: [{ perspective: width }, { rotateX: '-90deg' }],
                opacity: 0,
              }}
              animate={{
                transform: [{ perspective: width }, { rotateX: '0deg' }],
                opacity: 1,
              }}
              exit={{
                transform: [{ perspective: width }, { rotateX: '-180deg' }],
                opacity: 0,
              }}
              transition={{
                type: 'timing',
                // repeatReverse: true
              }}>
              <View
                style={{
                  padding: _spacing / 2,
                  borderRadius: '100%',
                  backgroundColor: 'rgba(0,0,0,0.03)',
                }}>
                <Text style={{ fontSize: _iconSize }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1, paddingHorizontal: _spacing }}>
                <Text style={{ fontWeight: '800', color: colors.primary }}>
                  {item.name}
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    fontWeight: '700',
                    color: colors.primary,
                    fontSize: 12,
                  }}>
                  ${item.saved}
                </Text>
                <Text
                  style={{
                    fontWeight: '300',
                    color: 'rgba(0,0,0,0.4)',
                    fontSize: 12,
                  }}>
                  Saved
                </Text>
              </View>
            </MotiView>
          )}
          {selected && (
            <MotiView
              from={{
                transform: [{ perspective: width * 2 }, { rotateY: '90deg' }],
              }}
              animate={{
                transform: [{ perspective: width * 2 }, { rotateY: '0deg' }],
              }}
              exit={{
                transform: [{ perspective: width * 2 }, { rotateY: '-90deg' }],
              }}
              transition={{
                type: 'timing',
                // repeatReverse: true
              }}
              key='back'
              style={[
                StyleSheet.absoluteFillObject,
                {
                  borderRadius: _borderRadius,
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: _spacing,
                  backgroundColor: colors.primary,
                  transform: [
                    {
                      perspective: 1000,
                    },
                    { scale: 10 },
                  ],
                },
              ]}>
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{ fontWeight: '700', color: '#fff', fontSize: 16 }}>
                  ${item.saved}
                </Text>
                <Text
                  style={{
                    fontWeight: '300',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: 12,
                  }}>
                  Saved
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: _spacing,
                  justifyContent: 'center',
                }}>
                <Indicator
                  percentage={parseInt(
                    ((100 * item.saved) / item.goal).toFixed(0),
                    10
                  )}
                  // percentage={20}
                />
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{ fontWeight: '700', color: '#fff', fontSize: 16 }}>
                  ${item.goal}
                </Text>
                <Text
                  style={{
                    fontWeight: '300',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: 12,
                  }}>
                  Goal
                </Text>
              </View>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </Pressable>
  );
};

export default function Goals() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: _spacing }}>
      {data.map((item) => {
        return <Item item={item} key={item.key} />;
      })}
    </View>
  );
}