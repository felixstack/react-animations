import * as React from 'react';
import { Pressable, StatusBar, Dimensions, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
const Random = require('canvas-sketch-util/random');
const {width, height} = Dimensions.get('window');

import pack from 'pack-spheres';
const colors = require('nice-color-palettes');

const borderWidth = 0;
const bounds = width * .48;
const size = bounds * 2 + borderWidth * 2;

const config = {
    maxCount: 200,
    dimensions: 2,
    minRadius: 2,
    maxRadius: 40,
    padding: 0.5,
    bounds,
};
const isCircle = false;
const initialCircles = (isCircle) => pack(isCircle ? {
  ...config, 
  sample: () => Random.insideCircle(bounds),
  outside: (position, radius) => {
      // See if length of circle + radius
      // exceeds the bounds
      const length = Math.sqrt(
        position[0] * position[0] + position[1] * position[1]
      );
      return length + radius >= bounds;
    }
} : config);

function Circles({bgs, isCircle}) {
  const [circles, setCircles] = React.useState(initialCircles(isCircle));
  React.useEffect(() => {
    setCircles(initialCircles(isCircle))
  }, [bgs])
  return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: isCircle ? size : 0,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth,
          // overflow: 'hidden',
          borderColor: `${bgs[0]}66`,
          backgroundColor: `${bgs[0]}33`
        }}>
        {circles.map((circle) => {
          const bg = bgs[Math.floor(Math.random() * bgs.length)];
          const border = bgs[Math.floor(Math.random() * bgs.length)];
          return (
            <View
              style={{
                width: circle.radius * 2,
                height: circle.radius * 2,
                borderRadius: circle.radius * 2,
                backgroundColor: bg,
                position: 'absolute',
                // borderWidth: 1,
                // borderColor: border,
                transform: [
                  {
                    translateX: circle.position[0],
                  },
                  {
                    translateY: circle.position[1],
                  },
                ],
              }}
            />
          );
        })}
      </View>
  );
}

export default function App() {
  const [bgs, setBgs] = React.useState(
    colors[Math.floor(Math.random() * colors.length)]
  );

  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     setBgs(colors[Math.floor(Math.random() * colors.length)]);
  //   }, 2000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [bgs]);

  return <View style={[styles.container, {backgroundColor: `${bgs[0]}22`}]}>
    <StatusBar hidden/>
    <Pressable onPress={() => {
    setBgs(colors[Math.floor(Math.random() * colors.length)])
  }}>
      <Circles bgs={bgs} isCircle={true}/>
  </Pressable>
  </View>
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
