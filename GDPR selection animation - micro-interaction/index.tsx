/*
    Inspiration: https://dribbble.com/shots/15635034-Saifty-GDPR-Settings
*/
import * as React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { View as MView, Text as MText, AnimatePresence } from 'moti';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const { width, height } = Dimensions.get('screen');
import { faker } from '@faker-js/faker';

faker.seed(10);

const _spacing = 20;
const _colors = {
    iconInactive: '#C9C6CC',
    iconActive: '#6E01EF',
    text: '#323749',
};

const getBubbles = () =>
    [...Array(8).keys()].map((i) => ({
        size: faker.random.number(10) + 5,
        x: (10 + faker.random.number(40)) * faker.helpers.randomize([-1, 1]),
        y: faker.random.number(40) * faker.helpers.randomize([-1, 1]),
        opacity: faker.random.number(2) / 10 + 0.05,
    }));

const data = [
    { type: 'Push', icon: 'smartphone', bubbles: getBubbles() },
    { type: 'Email', icon: 'mail', bubbles: getBubbles() },
    { type: 'SMS', icon: 'message-square', bubbles: getBubbles() },
];

export default function GDPRSettings() {
    const [items, setItems] = React.useState(data);
    const currentlySelected = React.useRef(null);

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: _spacing * 2 }}>
            <StatusBar hidden />
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: _spacing * 2,
                }}
            >
                <MText style={{ fontSize: 20, fontWeight: '600', marginBottom: _spacing / 2 }}>GDPR Settings</MText>
                <MText style={{ fontWeight: '300', fontSize: 13, letterSpacing: 0.5, textAlign: 'center' }}>
                    Please confirm that you accept receiving content in the following ways:
                </MText>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: _spacing * 2 }}>
                {items.map((item) => {
                    return (
                        <TouchableOpacity
                            key={`icon-${item.icon}`}
                            onPress={() => {
                                // set this just for initial animation
                                // and to avoid the rest of selected items
                                // to animate.
                                // Once the moti animation will finish
                                // we're going to reset this value.
                                currentlySelected.current = item.icon;

                                setItems((items) => {
                                    return items.reduce(
                                        (acc, i) => [
                                            ...acc,
                                            { ...i, selected: i.icon === item.icon ? !i.selected : i.selected },
                                        ],
                                        []
                                    );
                                });
                            }}
                        >
                            <View style={{ alignItems: 'center' }}>
                                <MView
                                    animate={{
                                        scale: currentlySelected.current === item.icon && item.selected ? [1.1, 1] : 1,
                                    }}
                                    transition={{ delay: 150, duration: 200, type: 'timing' }}
                                    onDidAnimate={(_, finished) => {
                                        if (finished) {
                                            currentlySelected.current = null;
                                        }
                                    }}
                                    style={{ marginBottom: _spacing, alignItems: 'center' }}
                                >
                                    <View
                                        style={{
                                            position: 'absolute',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    >
                                        {item.bubbles.map(({ size, x, y, opacity, delay }, index) => {
                                            return (
                                                <MView
                                                    animate={{
                                                        opacity: !!item.selected ? opacity : 0,
                                                        translateX: item.selected ? x : 0,
                                                        translateY: item.selected ? y : 0,
                                                    }}
                                                    transition={{ delay: index * 40 }}
                                                    key={`bubble-${item.icon}-${index}`}
                                                    style={{
                                                        position: 'absolute',
                                                        width: size,
                                                        height: size,
                                                        borderRadius: size,
                                                        backgroundColor: _colors.iconActive,
                                                        opacity,
                                                    }}
                                                />
                                            );
                                        })}
                                    </View>
                                    <Feather name={item.icon} color={_colors.iconActive} size={42} />
                                    <MView
                                        from={{ height: 42 }}
                                        animate={{ height: item.selected ? 0 : 42 }}
                                        transition={{ type: 'timing', duration: 300, delay: item.selected ? 0 : 250 }}
                                        style={{ position: 'absolute' }}
                                    >
                                        <Feather name={item.icon} color={_colors.iconInactive} size={42} />
                                    </MView>
                                </MView>
                                <MView
                                    animate={{
                                        backgroundColor: `${item.selected ? _colors.iconActive : _colors.text}11`,
                                    }}
                                    style={{
                                        backgroundColor: `${_colors.iconInactive}33`,
                                        paddingHorizontal: _spacing * 0.8,
                                        paddingVertical: _spacing * 0.3,
                                        borderRadius: 10,
                                    }}
                                >
                                    <MText
                                        animate={{
                                            color: item.selected ? _colors.iconActive : _colors.text,
                                        }}
                                        style={{ color: _colors.iconActive, fontSize: 12, fontWeight: '500' }}
                                    >
                                        {item.type}
                                    </MText>
                                </MView>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <TouchableOpacity style={{ marginBottom: _spacing }}>
                <View
                    style={{
                        backgroundColor: _colors.iconActive,
                        borderRadius: 4,
                        height: 44,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <MText style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Save settings</MText>
                </View>
            </TouchableOpacity>
            <TouchableOpacity>
                <View style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}>
                    <MText style={{ color: _colors.iconActive, fontWeight: '500', fontSize: 14 }}>Learn more</MText>
                </View>
            </TouchableOpacity>
        </View>
    );
}
