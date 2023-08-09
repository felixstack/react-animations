/*
    Inspiration: https://dribbble.com/shots/5694244-Scroll-and-Selected-Tab
    VR Image: https://www.klipartz.com/en/sticker-png-lekuz
*/
import * as React from 'react';
import { Text, ScrollView, Image, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { View as MView, Text as MText, Image as MImage, AnimatePresence, useAnimationState } from 'moti';
import { faker } from '@faker-js/faker';
import { StatusBar } from 'expo-status-bar';
import Animated, {
    Extrapolate,
    interpolate,
    interpolateColor,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
faker.seed(10);
const { width, height } = Dimensions.get('screen');

const colors = {
    header: '#E3D2CD',
    headerText: '#2A2659',
    tab: '#351F9C',
    tabText: '#AAA2C7',
    text: '#504C62',
};

const _headerHeight = height * 0.4;
const _headerHeightShrink = _headerHeight / 2;
const _tabsHeight = height * 0.2;
const _tabsHeightShrink = _tabsHeight / 2;

const inputRange = [0, _headerHeightShrink + _tabsHeightShrink];
const Header = ({ scrollY }) => {
    const stylez = useAnimatedStyle(() => {
        return {
            height: interpolate(scrollY.value, inputRange, [_headerHeight, _headerHeightShrink], Extrapolate.CLAMP),
        };
    });
    const headerTextStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(scrollY.value, inputRange, [1, 0], Extrapolate.CLAMP),
            transform: [
                {
                    translateY: interpolate(scrollY.value, inputRange, [0, -_headerHeight], Extrapolate.CLAMP),
                },
            ],
        };
    });

    return (
        <Animated.View style={[{ backgroundColor: colors.header, justifyContent: 'center', padding: 20 }, stylez]}>
            <View
                style={{
                    height: _headerHeightShrink / 4,
                    justifyContent: 'center',
                    position: 'absolute',
                    top: _headerHeightShrink / 2 - _headerHeightShrink / 8,
                    width: 80,
                    alignItems: 'center',
                }}
            >
                <Feather name='chevron-left' size={24} color={colors.headerText} />
            </View>
            <Animated.View style={headerTextStyle}>
                <Text
                    style={{
                        color: colors.headerText,
                        fontSize: 62,
                        letterSpacing: -3,
                        textTransform: 'uppercase',
                        fontWeight: '600',
                        marginTop: 30,
                    }}
                >
                    VR -{'\n'}City VR
                </Text>
                <Image
                    source={{ uri: 'https://i.ibb.co/sFD6bx1/klipartz-com.png' }}
                    style={{
                        position: 'absolute',
                        bottom: '30%',
                        left: '50%',
                        transform: [{ rotate: '-45deg' }],
                        width: width * 0.8,
                        resizeMode: 'cover',
                        height: width * 0.8,
                    }}
                />
            </Animated.View>
        </Animated.View>
    );
};

const tabs = [
    'Today',
    'Fri 18',
    'Sat 19',
    'Sun 20',
    'Mon 21',
    'Tue 22',
    'Wed 23',
    'Thu 24',
    'Fri 25',
    'Sat 26',
    'Sun 27',
];
const Tabs = ({ scrollY }) => {
    const stylez = useAnimatedStyle(() => {
        return {
            height: interpolate(scrollY.value, inputRange, [_tabsHeight, _tabsHeightShrink], Extrapolate.CLAMP),
            margin: interpolate(scrollY.value, inputRange, [0, 20], Extrapolate.CLAMP),
            borderRadius: interpolate(scrollY.value, inputRange, [0, 20], Extrapolate.CLAMP),
            marginTop: interpolate(scrollY.value, inputRange, [0, -_tabsHeightShrink / 2], Extrapolate.CLAMP),
        };
    });
    const navTextStyle = useAnimatedStyle(() => {
        return {
            color: interpolateColor(scrollY.value, inputRange, [colors.tabText, colors.headerText]),
            transform: [
                {
                    translateY: interpolate(
                        scrollY.value,
                        inputRange,
                        [0, -_headerHeightShrink / 2],
                        Extrapolate.CLAMP
                    ),
                },
                {
                    translateX: interpolate(scrollY.value, inputRange, [0, 10], Extrapolate.CLAMP),
                },
            ],
        };
    });
    const scrollStyles = useAnimatedStyle(() => {
        return {
            marginTop: interpolate(scrollY.value, inputRange, [30, 0], Extrapolate.CLAMP),
        };
    });
    return (
        <Animated.View style={[{ backgroundColor: colors.tab, justifyContent: 'center', paddingLeft: 50 }, stylez]}>
            <Animated.Text
                style={[
                    {
                        color: colors.headerText,
                        fontSize: 20,
                        fontWeight: '700',
                        position: 'absolute',
                        top: 30,
                        left: 50,
                    },
                    navTextStyle,
                ]}
            >
                December
            </Animated.Text>
            <Animated.ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={[{ flexGrow: 0 }, scrollStyles]}
            >
                {tabs.map((tab, index) => (
                    <View key={tab} style={{ marginRight: 40 }}>
                        <Text style={{ color: colors.tabText, fontWeight: '700', fontSize: 16 }}>{tab}</Text>
                        {index === 0 && (
                            <View style={{ marginTop: 5, height: 2, backgroundColor: colors.tabText, width: '50%' }} />
                        )}
                    </View>
                ))}
            </Animated.ScrollView>
        </Animated.View>
    );
};

export default function StickyTabs() {
    const scrollY = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler((ev) => {
        // console.log(ev.contentOffset.y)
        scrollY.value = ev.contentOffset.y;
    });

    return (
        <View style={{ flex: 1 }}>
            <Animated.ScrollView
                style={[StyleSheet.absoluteFillObject]}
                contentContainerStyle={{ padding: 20, paddingTop: _headerHeight + _tabsHeight + 20 }}
                // snapToOffsets={[_headerHeightShrink + _tabsHeightShrink]}
                // decelerationRate="fast"
                onScroll={onScroll}
                scrollEventThrottle={16}
            >
                {/* <Animated.View
                style={[{backgroundColor: 'red'}, stylez]}
            /> */}
                <Text style={{ marginBottom: 20, lineHeight: 22 }}>
                    {faker.lorem.sentences(faker.random.number(10) + 2)}
                </Text>
                <Text style={{ marginBottom: 20, lineHeight: 22 }}>
                    {faker.lorem.sentences(faker.random.number(10) + 2)}
                </Text>
                <Text style={{ marginBottom: 20, lineHeight: 22 }}>
                    {faker.lorem.sentences(faker.random.number(10) + 2)}
                </Text>
                <Text style={{ marginBottom: 20, lineHeight: 22 }}>
                    {faker.lorem.sentences(faker.random.number(10) + 2)}
                </Text>
                <Text style={{ marginBottom: 20, lineHeight: 22 }}>
                    {faker.lorem.sentences(faker.random.number(10) + 2)}
                </Text>
            </Animated.ScrollView>

            <View style={{ position: 'absolute' }}>
                <Header scrollY={scrollY} />
                <Tabs scrollY={scrollY} />
            </View>
        </View>
    );
}
