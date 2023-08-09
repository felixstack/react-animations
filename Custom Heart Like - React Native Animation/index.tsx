import * as React from 'react';
import { CameraRoll, Image, View, Text, FlatList, Dimensions, StyleSheet, Pressable } from 'react-native';

import { AnimatePresence, motify, View as MView } from 'moti';

import Svg, { Circle, G } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('screen');
import { Entypo } from '@expo/vector-icons';

const colors = {
    primary: '#F85A89',
    secondary: '#FFEDF3'
}

export default function HeartLike() {
    const [buttonState, setButtonState] = React.useState('EMPTY');
    const [count, setCount] = React.useState(24);
    return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Pressable
            onPressIn={() => setButtonState('PRESSED')}
            onPressOut={() => {
                setCount(count => count + 1)
                setButtonState('ACTIVE')
            }}
        >
            <>
                <StatusBar hidden/>
                <AnimatePresence>
                    <MView
                        key={`bg-${count}`}
                        from={{
                            scale: 0,
                            opacity: 1,
                        }}
                        animate={{
                            scale: .5,
                            opacity: .7
                        }}
                        exit={{
                            scale: 3,
                            opacity: 0
                        }}
                        transition={{
                            type: 'timing',
                            duration: 600
                        }}
                        style={[StyleSheet.absoluteFillObject, {
                            backgroundColor: colors.primary,
                            // zIndex: -1,
                            borderRadius: '50%'
                        }]}
                    />
                </AnimatePresence>
                <AnimatePresence>
                    {buttonState === 'ACTIVE' && <MView
                        key={`label-${count}`}
                        from={{
                            translateY: 40,
                            opacity: 0
                        }}
                        animate={{
                            translateY: [-40, -40, 0],
                            opacity: [1, 1, 0]
                        }}
                        exit={{
                            translateY: 0,
                            opacity: 0
                        }}
                        transition={{
                            type: 'timing',
                            duration: 400,
                        }}
                        style={{
                            position: 'absolute',
                            alignSelf: 'center',
                            backgroundColor: colors.primary,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            width: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 20
                        }}
                    >
                        <Text style={{fontFamily: 'Menlo', fontSize: 16,color: '#fff', fontWeight: '900'}}>{count}</Text>
                    </MView>}
                </AnimatePresence>
                <MView
                    style={{
                        padding: 20,
                        borderRadius: 20,
                        backgroundColor: colors.secondary
                    }}
                    from={{
                        scale: 1
                    }}
                    animate={{
                        scale: buttonState === 'PRESSED' ? .9 : 1
                    }}
                    transition={{
                        type: 'timing',
                        duration: 200
                    }}
                >

                    <MView
                        from={{
                            scale: 1
                        }}
                        animate={{
                            scale: buttonState=== 'PRESSED' ? .8 : [1.4, 1]
                        }}
                        transition={{
                            type: 'timing',
                            duration: 300
                        }}
                    >
                        <Entypo name="heart" size={42} color={colors.primary} />
                    </MView>
                </MView>
            </>
        </Pressable>
    </View>
}