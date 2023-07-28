import * as React from 'react';
import { StatusBar, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import { MotiView, MotiText } from 'moti';

const numZeroToNine = [...Array(10).keys()];
// Hook
function usePrevious(value) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
const Tick = ({ num, textSize, textStyle, index }) => {
  const xxx = usePrevious(num);
  return (
    <MotiView style={{ height: textSize, overflow: 'hidden' }}>
      <MotiView
        from={{ translateY: -textSize * (xxx ?? 0) }}
        animate={{ translateY: -textSize * num }}
        transition={{
          type: 'timing',
          duration: 500,
          delay: 80 * index,
        }}>
        {numZeroToNine.map((number, index) => {
          return (
            <MotiText
              key={index}
              style={[
                textStyle,
                {
                  height: textSize,
                  fontSize: textSize,
                  lineHeight: textSize * 1.1,
                  textAlign: 'center',
                },
              ]}>
              {number}
            </MotiText>
          );
        })}
      </MotiView>
    </MotiView>
  );
};
const Ticker = ({ number, textSize, textStyle }) => {
  const numArray = React.useMemo(() => String(number).split(''), [number]);
  return (
    <MotiView style={{ flexDirection: 'row' }}>
      {numArray.map((num, index) => {
        return (
          <Tick
            key={index}
            num={parseFloat(num)}
            textSize={textSize}
            textStyle={textStyle}
            index={index}
          />
        );
      })}
    </MotiView>
  );
};

export default function App() {
  const [number, setNumber] = React.useState(
    Math.floor(Math.random() * 89999) + 10000
  );
  React.useEffect(() => {
    const interval = setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * 89999) + 10000;
      // console.log(randomNumber)
      // setNumber(number => number + 1)
      setNumber(randomNumber);
    }, 2000);

    return () => {
      clearTimeout(interval);
    };
  }, [number]);
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Ticker
        number={number}
        textSize={72}
        textStyle={{ fontWeight: '900', color: '#000' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
