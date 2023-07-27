import { Entypo } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import * as React from 'react';
import { Dimensions, Pressable, View } from 'react-native';

const { width, height } = Dimensions.get('screen');
const colors = {
  primary: '#F85A89',
  secondary: '#FFEDF3',
};

export default function HeartLikeV2() {
  const [isActive, setIsActive] = React.useState(false);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Pressable onPress={() => setIsActive((isActive) => !isActive)}>
        <View
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            borderRadius: 20,
          }}>
          <StatusBar hidden />
          <MotiView
            style={{
              padding: 20,
              borderRadius: 20,
              backgroundColor: colors.secondary,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
            <MotiView
              from={{
                scale: 1,
              }}
              animate={{
                scale: isActive ? 5 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 72,
                damping: 12,
              }}>
              <Entypo name='heart' size={42} color={colors.primary} />
            </MotiView>
            <MotiView
              from={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: isActive ? 1 : 0,
                opacity: isActive ? 1 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 72,
                damping: 12,
                delay: isActive ? 400 : 0,
              }}
              style={{ position: 'absolute' }}>
              <Entypo name='heart' size={42} color={'#fff'} />
            </MotiView>
            <MotiView
              from={{
                scale: 0.2,
                opacity: 0,
                borderWidth: 4,
              }}
              animate={{
                scale: isActive ? [0, 1.6, 1.7] : 0.2,
                opacity: isActive ? [1, 1, 0] : 0,
                borderWidth: isActive ? [2, 2, 0] : 0,
              }}
              transition={{
                type: 'timing',
                duration: 250,
              }}
              style={{
                position: 'absolute',
                borderColor: 'white',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
              }}
            />
          </MotiView>
        </View>
      </Pressable>
    </View>
  );
}
