// Inspiration: https://dribbble.com/shots/6555779-Menu-Transition
import { Feather } from '@expo/vector-icons';
import { MotiScrollView, MotiText, MotiView } from '@motify/components';
import { motify, useDynamicAnimation } from '@motify/core';
import { faker } from '@faker-js/faker';
import { AnimatePresence } from 'framer-motion';
import * as React from 'react';
import { Dimensions, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Easing } from 'react-native-reanimated';

const { width, height } = Dimensions.get('screen');
const _color = '#1E37FE';
const _headerHeight = 64;
const _spacing = 20;

const menu = ['About', 'Work', 'Philosophy', 'Services', 'Contact'];
const colors = ['papayawhip', 'coral', 'purple', 'gold', '#333'];

const AnimatedFeather = motify(Feather)();

faker.seed(10);
export default function MenuTransition() {
  const [state, setState] = React.useState('closed');
  const [selectedItem, setSelectedItem] = React.useState(menu[0]);
  const sentences = React.useMemo(() => {
    return [...Array(5).keys()].map(() => faker.lorem.paragraph(1));
  }, []);
  const animated = useDynamicAnimation(() => ({
    transform: [{ translateX: width }, { translateY: 0 }],
  }));

  React.useEffect(() => {
    switch (state) {
      default:
      case 'opened':
        animated.animateTo({
          transform: [{ translateX: 0 }, { translateY: 0 }],
        });
        break;
      case 'closed':
        animated.animateTo({
          transform: [{ translateX: width }, { translateY: 0 }],
        });
        break;
      case 'closed-top':
        animated.animateTo({
          transform: [{ translateX: 0 }, { translateY: -height }],
        });
        break;
    }
  }, [state]);

  const isVisible = state === 'opened';
  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <View style={styles.header}>
        <MotiText
          animate={{ color: isVisible ? '#fff' : '#000' }}
          transition={{ delay: 500 }}
          style={{
            fontFamily: 'Menlo',
            fontSize: 20,
            letterSpacing: 3,
            opacity: 0.8,
          }}>
          Batman&Codes
        </MotiText>
        <Pressable
          onPress={() => {
            setState((state) => (state === 'opened' ? 'closed' : 'opened'));
          }}>
          <View style={styles.burgerMenu}>
            <AnimatePresence>
              {!isVisible ? (
                <MotiView
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key='closed'
                  style={{ position: 'absolute' }}
                  transition={{ type: 'timing', delay: 500 }}>
                  <Feather name='menu' size={24} color='#000' />
                </MotiView>
              ) : (
                <MotiView
                  key='opened'
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'timing', delay: 500 }}
                  style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Feather name='x' size={24} color='#fff' />
                </MotiView>
              )}
            </AnimatePresence>
          </View>
        </Pressable>
      </View>

      <MotiScrollView contentContainerStyle={{ padding: _spacing }}>
        <AnimatePresence>
          {menu.map((m, i) => {
            return (
              m === selectedItem && (
                <MotiView key={m}>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={styles.heading}>
                    {selectedItem}
                  </Text>
                  {sentences.map((sentence, index) => {
                    return (
                      <Text key={`sentence-${index}`} style={styles.body}>
                        {sentences}
                      </Text>
                    );
                  })}
                </MotiView>
              )
            );
          })}
        </AnimatePresence>
      </MotiScrollView>
      <MotiView
        state={animated}
        animateInitialState={false}
        onDidAnimate={(_, finished, value) => {
          const yValue = animated.current?.transform?.filter((v) =>
            v.hasOwnProperty('translateY')
          )[0].translateY;

          if (yValue === -height && finished) {
            // Reset to the initial position in case when the user
            // pressed on the button.

            // Initial open -> close is just modifying the translateX
            // When the user is pressing on a menu item we would like to
            // translate on the Y-axis and after this is finished,
            // reset the values so it will always start from the closed state
            // but we don't want to animate this changes so that's why there's a
            // duration: 1 to make it instant.
            // setState('closed')
            animated.animateTo({
              transform: [
                {
                  translateX: [
                    { value: width, duration: 1, type: 'timing' },
                    { value: width, duration: 1, type: 'timing' },
                  ],
                },
                {
                  translateY: [
                    { value: 0, duration: 1, type: 'timing' },
                    { value: 0, duration: 1, type: 'timing' },
                  ],
                },
              ],
            });
          }
        }}
        transition={{
          type: 'timing',
          duration:
            animated.current?.transform?.filter((v) =>
              v.hasOwnProperty('translateY')
            )[0].translateY === -height
              ? 1
              : 1000,
          easing: Easing.bezier(0.85, 0, 0.15, 1),
          // duration: 1000
        }}
        style={[StyleSheet.absoluteFillObject, styles.menu]}>
        <MotiView
          animate={{
            opacity: isVisible ? 1 : 0,
          }}
          transition={{
            delay: isVisible ? 500 : 0,
            type: 'timing',
          }}
          style={styles.innerMenu}>
          {menu.map((item) => {
            return (
              <Pressable
                key={item}
                onPress={() => {
                  setState('closed-top');
                  setSelectedItem(item);
                }}>
                <MotiText style={styles.text}>{item}</MotiText>
              </Pressable>
            );
          })}
        </MotiView>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 42,
    height: _headerHeight + 42,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: _spacing,
    flexDirection: 'row',
    // this is because we would like to have this container + the menu container
    // on the same zIndex so they'll both be visible when the menu is visible.
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  menu: {
    backgroundColor: _color,
    paddingVertical: Math.max(_headerHeight + _spacing, height / 4),
    flex: 1,
    paddingHorizontal: _spacing,
    justifyContent: 'center',
    // alignItems: 'center'
  },
  innerMenu: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  text: {
    fontSize: 42,
    color: '#fff',
    fontFamily: 'Menlo',
  },
  burgerMenu: {
    height: _headerHeight,
    width: _headerHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 20,
    textTransform: 'uppercase',
    marginBottom: _spacing * 2,
  },
  body: {
    marginBottom: _spacing,
    lineHeight: 24,
    letterSpacing: 0.5,
    fontFamily: 'Menlo',
    opacity: 0.7,
  },
});
