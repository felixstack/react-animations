import * as React from 'react';
import { Dimensions, Image, Pressable, StatusBar, StyleSheet, View } from 'react-native';

import Constants from 'expo-constants';
import { MotiView } from 'moti';
import Animated, {
  Easing,
  FadeInRight,
  FadeOutLeft,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const _data = [
  {
    key: '1',
    location: 'Krabi, Thailand',
    numberOfDays: 9,
    image: `https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=${width}&fit=max&ixid=eyJhcHBfaWQiOjMyMn0`,
    color: '#0C212D',
  },
  {
    key: '2',
    location: 'Bucharest, Romania',
    numberOfDays: 6,
    image: `https://images.unsplash.com/photo-1584646098378-0874589d76b1?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=${width}&fit=max&ixid=eyJhcHBfaWQiOjMyMn0`,
    color: '#F8EACE',
  },
  {
    key: '3',
    location: 'Iceland',
    numberOfDays: 5,
    image: `https://images.unsplash.com/photo-1504893524553-b855bce32c67?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=${width}&fit=max&ixid=eyJhcHBfaWQiOjMyMn0`,
    color: '#E4E5EA',
  },
  {
    key: '4',
    location: 'Dresden, Germany',
    numberOfDays: 6,
    image: `https://images.unsplash.com/photo-1502631868851-1717aca1be29?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=${width}&fit=max&ixid=eyJhcHBfaWQiOjMyMn0`,
    color: '#0C1C28',
  },
  {
    key: '5',
    location: 'Osaka, Japan',
    numberOfDays: 12,
    image: `https://images.unsplash.com/photo-1505069190533-da1c9af13346?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=${width}&fit=max&ixid=eyJhcHBfaWQiOjMyMn0`,
    color: '#151C1D',
  },
  {
    key: '6',
    location: 'New York, United States',
    numberOfDays: 7,
    image: `https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=${width}&fit=max&ixid=eyJhcHBfaWQiOjMyMn0`,
    color: '#EE655E',
  },
  {
    key: '7',
    location: 'Pragser Wildsee, Italy',
    numberOfDays: 6,
    image: `https://images.unsplash.com/photo-1538681105587-85640961bf8b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=${width}&fit=max&ixid=eyJhcHBfaWQiOjMyMn0`,
    color: '#F0F0F3',
  },
  {
    key: '8',
    location: 'Flakstad, Norway',
    numberOfDays: 12,
    image: `https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=${width}&fit=max&ixid=eyJhcHBfaWQiOjMyMn0`,
    color: '#CCE5C9',
  },
  {
    key: '9',
    location: 'Majorca, Spain',
    numberOfDays: 8,
    image: `https://images.unsplash.com/photo-1537042145424-98c3022ed567?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=${width}&fit=max&ixid=eyJhcHBfaWQiOjMyMn0`,
    color: '#EFEDEA',
  },
];

const _spacing = 12;

export default function App() {
  const [selectedItem, setSelectedItem] = React.useState(0);
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', height: width }}>
        {_data.slice(0, 4).map((item, index) => {
          return (
            <MotiView
              key={item.key}
              animate={{
                flex: selectedItem === index ? _data.length - 1 : 1,
              }}
              transition={{
                type: 'timing',
                duration: 500,
                easing: Easing.inOut(Easing.ease),
              }}
              style={{
                borderRadius: _spacing * 2,
                overflow: 'hidden',
                marginRight: index === _data.length - 1 ? 0 : _spacing,
              }}
            >
              <Pressable
                style={{ flex: 1, justifyContent: 'flex-end', padding: _spacing / 2 }}
                onPress={() => {
                  setSelectedItem(index);
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={[StyleSheet.absoluteFillObject, { resizeMode: 'cover' }]}
                />
                <Animated.View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <MotiView
                    animate={{
                      backgroundColor: selectedItem === index ? item.color : '#fff',
                    }}
                    transition={{
                      type: 'timing',
                      duration: 1000,
                    }}
                    style={{
                      width: '100%',
                      maxWidth: 50,
                      maxHeight: 50,
                      aspectRatio: 1,
                      borderRadius: 100,
                    }}
                  />
                  {selectedItem === index && (
                    <Animated.View style={{ marginLeft: 50 + _spacing, position: 'absolute' }}>
                      <Animated.Text
                        style={{ color: item.color, fontWeight: 'bold' }}
                        entering={FadeInRight.delay(50)}
                        exiting={FadeOutLeft.delay(100)}
                      >
                        {item.location}
                      </Animated.Text>
                      <Animated.Text
                        style={{ color: item.color, fontWeight: 'bold' }}
                        entering={FadeInRight.delay(100)}
                        exiting={FadeOutLeft.delay(50)}
                      >
                        {item.location}
                      </Animated.Text>
                    </Animated.View>
                  )}
                </Animated.View>
              </Pressable>
            </MotiView>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});
