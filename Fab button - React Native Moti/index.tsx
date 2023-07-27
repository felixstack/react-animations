import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatePresence, View as MView } from 'moti';
import * as React from 'react';
import { Dimensions, Pressable, View } from 'react-native';

const { width, height } = Dimensions.get('screen');

export default function FabButton({
  activeBg = '#CA3A60',
  bg = '#F23462',
  size = 60,
}) {
  const [isOn, setIsOn] = React.useState(false);
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: size,
          height: size,
          position: 'absolute',
          bottom: size / 2,
          right: size / 2,
        }}>
        <MView
          key='bg'
          from={{ scale: 0.3 }}
          animate={{
            scale: isOn ? 5 : 0.3,
          }}
          transition={{
            delay: isOn ? 0 : 150,
          }}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: bg,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
          }}></MView>
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            left: size / 2,
            top: size / 2,
          }}>
          {[
            'account-settings',
            'square-edit-outline',
            'folder-edit-outline',
          ].map((icon, i) => {
            return (
              <AnimatePresence key={`parent-${i}`}>
                {isOn && (
                  <MView
                    key={i}
                    from={{
                      transform: [
                        {
                          scale: 0,
                        },
                        {
                          rotate: `${i * 45}deg`,
                        },
                      ],
                      opacity: 0,
                    }}
                    animate={{
                      transform: [
                        {
                          scale: 1,
                        },
                        {
                          rotate: `${i * 45}deg`,
                        },
                      ],
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                      transform: [
                        {
                          scale: 0,
                        },
                        {
                          rotate: `${i * 45}deg`,
                        },
                      ],
                    }}
                    transition={{
                      // type: 'timing',
                      delay: i * 50,
                    }}
                    style={{
                      width: size * 5,
                      height: size * 5,
                      borderRadius: size * 5,
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      position: 'absolute',
                    }}>
                    <View
                      style={{
                        width: size,
                        height: size,
                        borderRadius: size,
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: size / 2,
                        transform: [
                          {
                            rotate:
                              i == 1 ? '-45deg' : i == 2 ? '-90deg' : '0deg',
                          },
                        ],
                      }}>
                      <MaterialCommunityIcons
                        name={icon}
                        size={size * 0.4}
                        color='white'
                      />
                    </View>
                  </MView>
                )}
              </AnimatePresence>
            );
          })}
        </View>
        <Pressable onPress={() => setIsOn((isOn) => !isOn)}>
          <MView
            from={{
              rotate: '0deg',
              backgroundColor: bg,
            }}
            animate={{
              rotate: isOn ? '45deg' : '0deg',
              backgroundColor: isOn ? activeBg : bg,
            }}
            style={{
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: bg,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
            }}>
            <MaterialCommunityIcons
              name='plus'
              size={size * 0.5}
              color='white'
            />
          </MView>
        </Pressable>
      </View>
    </View>
  );
}
