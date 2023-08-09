// Icon: https://www.flaticon.com/free-icon/joystick_3142027?term=controller&related_id=3142027
// Inspiration: https://dribbble.com/shots/2900330-Color-picker
import * as React from 'react';
import { View, FlatList, Text, Dimensions, Pressable } from 'react-native';
import { View as MView, Text as MText, AnimatePresence } from 'moti';
import { StatusBar } from 'expo-status-bar';

const data = [
    {
        hex: '#009EFF',
        rgb: 'rgb(0,158,255)',
        name: 'Blue',
    },
    {
        hex: '#FF715D',
        rgb: 'rgb(255,113,93)',
        name: 'Red',
    },
    {
        hex: '#97C300',
        rgb: 'rgb(151,195,0)',
        name: 'Green',
    },
    {
        hex: '#E29DFA',
        rgb: 'rgb(219,121,255)',
        name: 'Purple',
    },
];

const SIZE = 50;
const SPACING = 10;
const CONTAINER_WIDTH = SIZE * data.length + SPACING * (data.length + 1);

const Swatch = (props) => {
    const { hex, rgb, name, activeColor, index, activeIndex } = props;
    return (
        <MView
            key={hex}
            from={{
                width: SIZE,
                height: SIZE,
                opacity: 0,
                translateX: 0,
                zIndex: index,
                scale: 1,
            }}
            animate={{
                zIndex: 99,
                width: activeColor === hex ? CONTAINER_WIDTH - SPACING * 2 : SIZE,
                height: activeColor === hex ? SIZE * 2 - SPACING * 2 : SIZE,
                opacity: 1,
                translateX: activeColor === hex ? -activeIndex * (SIZE + SPACING) : 0,
                scale: 1,
            }}
            exit={{
                width: 0,
                height: 0,
                opacity: 0,
                translateX: 0,
                zIndex: 0,
                scale: 0,
            }}
            transition={{
                type: 'timing',
                duration: 300,
            }}
            style={{
                left: index * (SIZE + SPACING) + SPACING,
                backgroundColor: hex,
                position: 'absolute',
                borderRadius: 6,
                overflow: 'hidden',
            }}
        >
            <Pressable onPress={props.onPress}>
                <AnimatePresence>
                    {activeColor !== null ? (
                        <MView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ padding: 10, width: '100%', height: '100%' }}
                        >
                            <MText
                                from={{ opacity: 0 }}
                                transition={{
                                    delay: activeColor === hex ? 200 : 0,
                                    type: 'timing',
                                    duration: activeColor === hex ? 500 : 0,
                                }}
                                animate={{ opacity: 1 }}
                                style={{
                                    position: 'absolute',
                                    left: 10,
                                    top: 10,
                                    color: 'white',
                                    fontWeight: '300',
                                    fontSize: 18,
                                    lineHeight: 18,
                                }}
                            >
                                {name}
                            </MText>
                            <MText
                                from={{ opacity: 0 }}
                                transition={{
                                    delay: activeColor === hex ? 200 : 0,
                                    type: 'timing',
                                    duration: activeColor === hex ? 500 : 0,
                                }}
                                animate={{ opacity: 1 }}
                                style={{
                                    position: 'absolute',
                                    right: 10,
                                    top: 10,
                                    color: 'white',
                                    fontWeight: '300',
                                    fontSize: 12,
                                }}
                            >
                                {hex}
                            </MText>
                            <MText
                                from={{ opacity: 0 }}
                                transition={{
                                    delay: activeColor === hex ? 200 : 0,
                                    type: 'timing',
                                    duration: activeColor === hex ? 500 : 0,
                                }}
                                animate={{ opacity: 1 }}
                                style={{
                                    position: 'absolute',
                                    right: 10,
                                    bottom: 10,
                                    color: 'white',
                                    fontWeight: '300',
                                    fontSize: 12,
                                }}
                            >
                                {rgb}
                            </MText>
                        </MView>
                    ) : (
                        <View style={{ width: '100%', height: '100%' }} />
                    )}
                </AnimatePresence>
            </Pressable>
        </MView>
    );
};
export default function ColorPicker() {
    const [activeColor, setActiveColor] = React.useState(null);
    return (
        <MView
            from={{ backgroundColor: '#00000000' }}
            animate={{ backgroundColor: activeColor !== null ? `${activeColor}55` : '#00000000' }}
            transition={{ type: 'timing', duration: 1000 }}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <StatusBar hidden />
            <View
                style={{
                    height: SIZE * 2,
                    width: CONTAINER_WIDTH,
                    backgroundColor: 'white',
                    borderRadius: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    shadowRadius: 20,
                    shadowOpacity: 0.2,
                    shadowColor: '#000',
                }}
            >
                <AnimatePresence>
                    {data.map((color, index) => {
                        if (activeColor !== color.hex && activeColor !== null) {
                            return null;
                        }
                        return (
                            <Swatch
                                {...color}
                                index={index}
                                activeIndex={index}
                                key={color.hex}
                                activeColor={activeColor}
                                onPress={() => {
                                    setActiveColor((activeColor) => {
                                        return activeColor === color.hex ? null : color.hex;
                                    });
                                }}
                            />
                        );
                    })}
                </AnimatePresence>
            </View>
            <View
                style={{
                    position: 'absolute',
                    bottom: 50,
                    height: 100,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                }}
            >
                <Text style={{ fontFamily: 'Menlo', opacity: 0.6 }}>
                    Built with <Text style={{ fontWeight: '900' }}>Moti</Text> by{' '}
                    <Text style={{ fontWeight: '900' }}>@mironcatalin</Text>
                </Text>
            </View>
        </MView>
    );
}
