import * as React from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import { HabitButton, HabitButtonProps } from './animation/HabitButton'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useReducer, useState } from 'react'
import { Feather } from '@expo/vector-icons'
import Animated, { Layout } from 'react-native-reanimated'

type Data = Omit<HabitButtonProps, 'onChange'>
const initialData: Data[] = [
  {
    color: 'gold',
    name: 'Drink water',
    count: 0,
    icon: 'watch',
  },
  {
    color: '#fdbf93',
    name: 'Catch fish',
    count: 0,
    icon: 'anchor',
  },
  {
    color: '#f2789e',
    name: 'Take selfie',
    count: 0,
    icon: 'aperture',
  },
  {
    color: '#85BB65',
    name: 'Make a sale',
    count: 0,
    icon: 'dollar-sign',
  },
  {
    color: '#84c7f0',
    name: 'Animations',
    count: 0,
    icon: 'zap',
  },
]

function reducer(state: Data[], action: { name: string; count: number }) {
  return state.map((item) => {
    if (item.name === action.name) {
      return {
        ...item,
        count: action.count,
      }
    }
    return item
  })
}

const Buttoner = ({
  onPress,
  icon,
  size = 24,
}: {
  size?: number
  icon: HabitButtonProps['icon']
  onPress: () => void
}) => (
  <TouchableOpacity onPress={onPress}>
    <Feather style={{ fontWeight: '900', fontSize: size }} name={icon} />
  </TouchableOpacity>
)

export default function App() {
  const [habits, dispatch] = useReducer(reducer, initialData)
  const [size, setSize] = useState(104)
  const [longPressDuration, setLongPressDuration] = useState(400)
  const [fancyAnimation, setFancyAnimation] = useState(false)

  return (
    <GestureHandlerRootView style={[styles.container, { padding: size / 8 }]}>
      <StatusBar hidden />
      <Animated.View
        layout={Layout}
        style={[
          {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: size / 8,
            marginBottom: 54,
          },
        ]}
      >
        {habits.map((habit) => {
          return (
            <HabitButton
              key={habit.name}
              icon={habit.icon}
              color={habit.color}
              count={habit.count}
              name={habit.name}
              size={size}
              longPressDuration={longPressDuration}
              fancyAnimation={fancyAnimation}
              onChange={(value) => {
                dispatch({
                  count: value,
                  name: habit.name,
                })
              }}
            />
          )
        })}
      </Animated.View>
      <View
        style={{
          backgroundColor: '#ffffffcc',
          paddingHorizontal: 40,
          paddingVertical: 10,
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          gap: 4,
          // alignItems: 'center',
        }}
      >
        <Text style={{ fontFamily: 'Menlo', fontSize: 16 }}>
          Change <Text style={{ fontWeight: '900' }}>{'<HabitButton />'}</Text> config
        </Text>
        <View style={{ height: 2, marginVertical: 8, backgroundColor: 'rgba(0,0,0,0.1)' }} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Menlo' }}>
            Current size: <Text style={{ fontWeight: '900' }}>{size}</Text>
          </Text>

          <View style={{ flexDirection: 'row', backgroundColor: '#f3f3f3', marginLeft: 10 }}>
            <Buttoner icon="minus-square" onPress={() => setSize(size - 10)} />
            <Buttoner icon="plus-square" onPress={() => setSize(size + 10)} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Menlo' }}>
            Long Press duration: <Text style={{ fontWeight: '900' }}>{longPressDuration}ms</Text>
          </Text>

          <View style={{ flexDirection: 'row', backgroundColor: '#f3f3f3', marginLeft: 10 }}>
            <Buttoner
              icon="minus-square"
              onPress={() => setLongPressDuration(longPressDuration - 100)}
            />
            <Buttoner
              icon="plus-square"
              onPress={() => setLongPressDuration(longPressDuration + 100)}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Menlo' }}>
            <Text style={{ fontWeight: '900' }}>Fancy</Text> counter animation
          </Text>

          <View style={{ flexDirection: 'row', marginLeft: 10 }}>
            <Switch
              style={{
                transform: [
                  {
                    scale: 0.8,
                  },
                ],
              }}
              ios_backgroundColor={'#fff'}
              trackColor={{
                false: '#767577',
                true: 'gold',
              }}
              value={fancyAnimation}
              onValueChange={(v) => {
                setFancyAnimation(v)
              }}
            />
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
})
