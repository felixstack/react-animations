import * as React from 'react';
import Svg, { Circle, Rect, Ellipse, Defs, LinearGradient, Stop } from 'react-native-svg';
import {StyleSheet, StatusBar,Text,  Image, View, FlatList} from 'react-native'

const _data = [...Array(10).keys()].map(i => {
  return {
    key: `item${i}`,
    uri: `https://source.unsplash.com/random/${i}`
  }
});

const _bgColor = "white"

function SvgComponent({radius = '14%', bgColor = _bgColor, withFade}) {
  return (
    <Svg height={'100%'} width="100%" style={{backgroundColor: 'transparent', position: 'absolute'}}>
      <Defs>
        <LinearGradient id="left_gradient" x1="0" y1="0" x2="1" y2="0" >
          <Stop offset="0" stopColor={"white"} stopOpacity="1" />
          <Stop offset="0.1" stopColor={"white"} stopOpacity="1" />
          <Stop offset="1" stopColor={bgColor} stopOpacity="0" />
        </LinearGradient>
        <LinearGradient id="right_gradient" x1="1" y1="0" x2="0" y2="0">
          <Stop offset="0" stopColor={"white"} stopOpacity="1" />
          <Stop offset="0.1" stopColor={"white"} stopOpacity="1" />
          <Stop offset="1" stopColor={bgColor} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="50%" cy="0%" fill={bgColor} rx={"50%"} ry={radius}/>
      <Ellipse cx="50%" cy="100%" fill={bgColor} rx={"50%"} ry={radius}/>
      {withFade && <Rect 
        width={`${parseFloat(radius)}%`}
        height="100%"
        fill="url(#left_gradient)"
      />}
      {withFade && <Rect 
        width={`${parseFloat(radius)}%`}
        height="100%"
        fill="url(#right_gradient)"
        x={`${100 - parseFloat(radius)}%`}
      />}
    </Svg>
  );
}


export default function App() {
  return <View style={{flex: 1, backgroundColor: _bgColor, justifyContent: 'center'}}>
    <Text style={styles.text}>→ Ellipse radius: <Text style={styles.mark}>14%</Text>, withFade: <Text style={styles.mark}>false</Text></Text>
    <View>
      <FlatList 
      data={_data}
      horizontal
      style={{flexGrow: 0}}
      renderItem={({item}) => {
        return <Image
          source={{uri: item.uri}}
          style={{width: 150, aspectRatio: 1, marginHorizontal: 10}}
        />
      }}
    />
    <SvgComponent radius="15%" withFade={false}/>
    </View>
    <Text style={styles.text}>→ Ellipse radius: <Text style={styles.mark}>14%</Text>, withFade: <Text style={styles.mark}>true</Text></Text>
    <View>
      <FlatList 
      data={_data}
      horizontal
      style={{flexGrow: 0}}
      renderItem={({item}) => {
        return <Image
          source={{uri: item.uri}}
          style={{width: 150, aspectRatio: 1, marginHorizontal: 10}}
        />
      }}
    />
    <SvgComponent radius="15%" withFade={true}/>
    </View>
    <Text style={styles.text}>→ Ellipse radius: <Text style={styles.mark}>30%</Text>, withFade: <Text style={styles.mark}>false</Text></Text>
    <View>
      <FlatList 
      data={_data}
      horizontal
      style={{flexGrow: 0}}
      renderItem={({item}) => {
        return <Image
          source={{uri: item.uri}}
          style={{width: 150, aspectRatio: 1, marginHorizontal: 10}}
        />
      }}
    />
    <SvgComponent radius="30%" withFade={false}/>
    </View>
    <Text style={styles.text}>→ Ellipse radius: <Text style={styles.mark}>30%</Text>, withFade: <Text style={styles.mark}>true</Text></Text>
    <View>
      <FlatList 
      data={_data}
      horizontal
      style={{flexGrow: 0}}
      renderItem={({item}) => {
        return <Image
          source={{uri: item.uri}}
          style={{width: 150, aspectRatio: 1, marginHorizontal: 10}}
        />
      }}
    />
    <SvgComponent radius="30%" withFade={true}/>
    </View>
    <StatusBar hidden/>
  </View>
}

const styles = StyleSheet.create({
  text: {fontFamily: 'Menlo', fontSize: 12, paddingHorizontal: 10, marginVertical: 10},
  mark: {fontWeight:'900', color: 'tomato'}
})