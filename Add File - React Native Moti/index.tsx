// Inspiration: https://dribbble.com/shots/15754381-Motion-UI-Exploration
import { MotiText, MotiView } from '@motify/components';
import { AnimatePresence } from 'framer-motion';
import * as React from 'react';
import { Dimensions, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { Easing } from 'react-native-reanimated';

const { width, height } = Dimensions.get('screen');

const _color = '#3C3B3C';
const _size = width * 0.55;
const _ratio = 0.7;
const _duration = 800;
const _bigDuration = _duration * 0.6;
const _restDuration = _duration - _bigDuration;
const _restHeight = (_size * (1 - _ratio)) / 2;

export default function AddFile() {
  const [isAdded, setIsAdded] = React.useState(false);
  return (
    <View style={[styles.centered, { flex: 1, backgroundColor: '#F7F6F6' }]}>
      <StatusBar hidden />
      <Pressable
        onPress={() => {
          setIsAdded((isAdded) => !isAdded);
        }}>
        <View style={[styles.container]}>
          <MotiView
            animate={{
              opacity: isAdded ? 0 : 1,
              translateY: isAdded ? -_restHeight : 0,
            }}
            style={[styles.headings]}
            transition={{
              opacity: {
                delay: isAdded ? 0 : _bigDuration,
                duration: _restDuration,
                type: 'timing',
                easing: Easing.bezier(0.85, 0, 0.15, 1),
              },
              translateY: {
                delay: isAdded ? 0 : _bigDuration,
                duration: _restDuration,
                type: 'timing',
                easing: Easing.bezier(0.85, 0, 0.15, 1),
              },
            }}>
            <MotiText style={styles.text}>Add to</MotiText>
          </MotiView>
          <View style={[styles.stretch, styles.centered]}>
            <MotiView
              animate={{
                width: isAdded ? _size : 1,
                height: isAdded ? _size : _size * _ratio,
              }}
              transition={{
                height: {
                  delay: isAdded ? 0 : _bigDuration,
                  type: 'timing',
                  easing: Easing.bezier(0.85, 0, 0.15, 1),
                  duration: _restDuration,
                },
                width: {
                  delay: isAdded ? _restDuration : 0,
                  type: 'timing',
                  easing: Easing.bezier(0.85, 0, 0.15, 1),
                  duration: _bigDuration,
                },
              }}
              style={[styles.line, styles.vertical]}
            />
            <MotiView
              animate={{
                width: isAdded ? 0 : _size * _ratio,
              }}
              transition={{
                width: {
                  delay: isAdded ? 0 : _bigDuration,
                  type: 'timing',
                  easing: Easing.bezier(0.85, 0, 0.15, 1),
                },
              }}
              style={[styles.line, styles.horizontal]}
            />
            <AnimatePresence>
              {isAdded && (
                <MotiText
                  key='doneText'
                  style={[styles.text, styles.light, styles.doneText]}
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: 'timing',
                    easing: Easing.bezier(0.85, 0, 0.15, 1),
                    opacity: {
                      delay: isAdded ? _duration : 0,
                    },
                  }}>
                  Done
                </MotiText>
              )}
            </AnimatePresence>
          </View>
          <MotiView
            animate={{
              opacity: isAdded ? 0 : 1,
              translateY: isAdded ? _restHeight : 0,
            }}
            transition={{
              delay: isAdded ? 0 : _bigDuration,
              duration: _restDuration,
              type: 'timing',
              easing: Easing.bezier(0.85, 0, 0.15, 1),
            }}
            style={[styles.headings]}>
            <MotiText style={styles.text}>Library</MotiText>
          </MotiView>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headings: {
    height: (_size * (1 - _ratio)) / 2,
    width: _size,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: _size,
    height: _size,
    overflow: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    textTransform: 'uppercase',
    color: _color,
    fontSize: 18,
    fontWeight: '300',
    fontFamily: 'Menlo',
    fontSize: Math.max(14, _restHeight * 0.5),
  },
  light: {
    color: '#fff',
    position: 'absolute',
  },
  stretch: {
    ...StyleSheet.absoluteFillObject,
  },
  line: {
    position: 'absolute',
    backgroundColor: _color,
  },
  vertical: {
    width: 1,
    height: _size * _ratio,
  },
  horizontal: {
    height: 1,
    width: _size * _ratio,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: {
    position: 'absolute',
  },
});
