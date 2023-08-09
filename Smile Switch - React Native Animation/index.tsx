import * as React from 'react';
import { View, Dimensions, Pressable } from 'react-native';

import { AnimatePresence, View as MView, Text as MText } from 'moti';

const { width, height } = Dimensions.get('screen');

export default function SmileSwitch({ size = 30 }) {
    const [isOn, setIsOn] = React.useState(true);
    const trackSize = width * 0.3;
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Pressable onPress={() => setIsOn((isOn) => !isOn)}>
                <MView
                    style={{
                        height: 50,
                        borderRadius: '50%',
                        width: trackSize,
                        backgroundColor: '#EBE9E7',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ height: '100%', position: 'absolute', justifyContent: 'space-evenly', left: 10 }}>
                        <MText style={{ fontSize: 40, lineHeight: 40, fontFamily: 'Menlo', color: '#008000' }}>:</MText>
                    </View>
                    <View style={{ height: '100%', position: 'absolute', justifyContent: 'space-evenly', right: 10 }}>
                        <MText style={{ fontSize: 40, lineHeight: 40, fontFamily: 'Menlo', color: '#ACACAC' }}>:</MText>
                    </View>

                    <MText
                        from={{ color: '#ACACAC', translateX: 0 }}
                        animate={{
                            color: isOn ? '#008000' : '#ACACAC',
                            translateX: isOn ? -trackSize / 2 + 10 + 25 : trackSize / 2 - 10 - 25,
                        }}
                        style={{ fontSize: 32, lineHeight: 34, fontWeight: '900', fontFamily: 'Menlo' }}
                        transition={{
                            type: 'timing',
                            duration: 500,
                        }}
                    >
                        )
                    </MText>
                </MView>
                <AnimatePresence>
                    {isOn ? (
                        <MView
                            key='on'
                            from={{
                                rotate: '0deg',
                                opacity: 0,
                            }}
                            animate={{
                                rotate: '10deg',
                                opacity: 1,
                            }}
                            trasition={{
                                duration: 1000,
                                type: 'timing',
                            }}
                            exit={{
                                rotate: '0deg',
                                opacity: 0,
                            }}
                            style={{
                                position: 'absolute',
                                width: trackSize * 0.6,
                                right: 13,
                                height: 30,
                                bottom: 6,
                                flex: 1,
                                backgroundColor: '#EBE9E7',
                                borderRadius: '50%',
                                shadowColor: '#000',
                                zIndex: -1,
                                shadowRadius: 6,
                                shadowOpacity: 0.3,
                                shadowOffset: {
                                    width: 10,
                                    height: 4,
                                },
                            }}
                        />
                    ) : (
                        <MView
                            key='isOff'
                            from={{
                                rotate: '0deg',
                                opacity: 0,
                            }}
                            animate={{
                                rotate: '-10deg',
                                opacity: 1,
                            }}
                            trasition={{
                                duration: 1000,
                                type: 'timing',
                            }}
                            exit={{
                                rotate: '0deg',
                                opacity: 0,
                            }}
                            style={{
                                position: 'absolute',
                                width: trackSize * 0.6,
                                left: 13,
                                height: 30,
                                bottom: 6,
                                flex: 1,
                                backgroundColor: '#EBE9E7',
                                borderRadius: '50%',
                                shadowColor: '#000',
                                zIndex: -1,
                                transform: [{ rotate: '18deg' }],
                                shadowRadius: 6,
                                shadowOpacity: 0.3,
                                shadowOffset: {
                                    width: -10,
                                    height: 4,
                                },
                            }}
                        />
                    )}
                </AnimatePresence>
            </Pressable>
        </View>
    );
}
