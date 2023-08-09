// https://dribbble.com/shots/4167815-Switcher-XXXIV

import * as React from 'react';
import { Pressable, View } from 'react-native';
import { View as MView } from 'moti';
import { Easing } from 'react-native-reanimated';

const SIZE = 60;
const TRACK_SIZE = SIZE * 1.5;
const TRACK_HEIGHT = SIZE * 0.4;
const transition = {
    type: 'timing',
    duration: 300,
    easing: Easing.inOut(Easing.ease),
};
const Switch = ({ size = SIZE, onPress, isActive }) => {
    return (
        <Pressable onPress={onPress}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <MView
                    from={{ backgroundColor: isActive ? '#2C2C2C' : '#DCDCDC' }}
                    animate={{ backgroundColor: isActive ? '#2C2C2C' : '#DCDCDC' }}
                    transition={transition}
                    style={{
                        position: 'absolute',
                        width: TRACK_SIZE,
                        height: TRACK_HEIGHT,
                        borderRadius: TRACK_HEIGHT,
                    }}
                />
                <MView
                    transition={transition}
                    from={{
                        translateX: isActive ? TRACK_SIZE / 4 : -TRACK_SIZE / 4,
                    }}
                    animate={{
                        translateX: isActive ? TRACK_SIZE / 4 : -TRACK_SIZE / 4,
                    }}
                    style={{
                        width: SIZE,
                        height: SIZE,
                        borderRadius: SIZE,
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <MView
                        transition={transition}
                        from={{
                            width: isActive ? 0 : SIZE * 0.6,
                            borderColor: isActive ? '#2C2C2C' : '#DCDCDC',
                        }}
                        animate={{
                            width: isActive ? 0 : SIZE * 0.6,
                            borderColor: isActive ? '#2C2C2C' : '#DCDCDC',
                        }}
                        style={{
                            width: SIZE * 0.6,
                            height: SIZE * 0.6,
                            borderRadius: SIZE * 0.6,
                            borderWidth: SIZE * 0.1,
                        }}
                    />
                </MView>
            </View>
        </Pressable>
    );
};
export default function SwitcherXXXIV() {
    const [isActive, setIsActive] = React.useState(false);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F3F4' }}>
            <Switch
                isActive={isActive}
                onPress={() => {
                    setIsActive((isActive) => !isActive);
                }}
            />
        </View>
    );
}
