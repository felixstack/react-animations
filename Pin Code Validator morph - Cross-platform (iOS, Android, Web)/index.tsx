// Inspiration: https://dribbble.com/shots/2510933-Pin-code-validation

import * as React from 'react';
import {
  TouchableOpacity,
  Pressable,
  Text,
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import Constants from 'expo-constants';
const { width, height } = Dimensions.get('window');
import { Ionicons } from '@expo/vector-icons';
import { MotiView, useAnimationState } from 'moti';
import { Easing } from 'react-native-reanimated';

const dialpad = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'];

const codeLength = 4;
const codeArr = [...Array(codeLength).keys()];
const _size = width * 0.2;
const _spacing = (width - _size * 3) / codeLength / 2;
const _borderWidth = Math.max(Math.floor(_size * 0.02), 1);
const _fontSize = Math.floor(_size * 0.4);
const _circleSize = width / 4 / codeLength;
const _colors = {
  primary: '#F8485E',
  secondary: '#512D6D',
};

const DialPad = ({ onPress }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {dialpad.map((dialPadItem) => {
        return (
          <TouchableOpacity
            key={dialPadItem}
            onPress={() => {
              if (dialPadItem === '') {
                return;
              }

              onPress(dialPadItem);
            }}>
            <MotiView
              style={{
                width: _size,
                height: _size,
                margin: _spacing,
                borderRadius: _size,
                borderWidth: _borderWidth,
                borderColor:
                  typeof dialPadItem !== 'number'
                    ? 'transparent'
                    : _colors.secondary,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {dialPadItem === 'del' ? (
                <Ionicons
                  name="backspace-outline"
                  size={_fontSize}
                  color={_colors.secondary}
                />
              ) : (
                <Text
                  style={{
                    fontSize: _fontSize,
                    color: _colors.secondary,
                  }}>
                  {dialPadItem}
                </Text>
              )}
            </MotiView>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Code = React.memo(({ code }) => {
  return (
    <View
      style={{
        width: _circleSize,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <MotiView
        transition={{
          type: 'timing',
          duration: 400,
          easing: Easing.bezier(0.87, 0, 0.13, 1),
        }}
        animate={{
          width: code ? _circleSize : _circleSize * 1.4,
          height: code ? _circleSize : 2,
          borderRadius: code ? _circleSize : 2,
          marginBottom: code ? _circleSize / 2 : 0,
          backgroundColor: code
            ? `${_colors.secondary}`
            : `${_colors.secondary}44`,
        }}
      />
    </View>
  );
});

export default function App() {
  const [code, setCode] = React.useState('');
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: width / 2,
          alignSelf: 'center',
          marginBottom: _spacing * 4,
          height: _circleSize * 2,
          alignItems: 'flex-end',
        }}>
        {codeArr.map((char, index) => {
          return <Code key={index} code={code[index]} />;
        })}
      </View>
      <DialPad
        onPress={(number) => {
          if (number === 'del') {
            if (code.length === 0) {
              return;
            }
            setCode((code) => code.substring(0, code.length - 1));
          } else {
            if (code.length === codeLength) {
              return;
            }
            setCode((code) => `${code}${number}`);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: _colors.primary,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
