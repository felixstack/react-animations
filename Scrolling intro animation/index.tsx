/*
    Inspiration: https://dribbble.com/shots/5402223-Wander-app-interactions-2
*/
import * as React from 'react';
import { Animated, Text, ScrollView, Image, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { View as MView, Text as MText, Image as MImage, AnimatePresence, useAnimationState } from 'moti';
import { faker } from '@faker-js/faker';
import { StatusBar } from 'expo-status-bar';
faker.seed(10);
const {width, height} = Dimensions.get('screen');

// https://www.pexels.com/photo/cabin-at-the-farm-2437291/
const _image = `https://images.pexels.com/photos/2437291/pexels-photo-2437291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;
const _heightOffset = height * .25;

export default function ScrollingEffectV1() {
    const scrollY = React.useRef(new Animated.Value(0)).current;
    const ref = React.useRef();

    const opacity = scrollY.interpolate({
        inputRange: [0, height-_heightOffset],
        outputRange: [1, 0]
    })
    const opacityReversed = scrollY.interpolate({
        inputRange: [0, height-_heightOffset],
        outputRange: [0, 1]
    })
    const scale = scrollY.interpolate({
        inputRange: [0, height-_heightOffset],
        outputRange: [1, 2],
        extrapolateLeft: 'clamp'
    })

    const useFadeInDown = useAnimationState({
        from: {
            opacity: 0,
            translateY: 100,
        },
        to: {
            opacity: 1,
            translateY: 0,
        },
    })

    React.useEffect(() => {
        scrollY.addListener(({value}) => {
            if (value >= height-_heightOffset) {
                useFadeInDown.transitionTo('to')
                return;
            }

            useFadeInDown.transitionTo(state => {
                if (state === 'to') {
                    return 'from';
                }
            })

            // Uncomment this if you'd like to blur the image while hitting the threshold.
            // ref?.current?.setNativeProps({
            //     blurRadius: Math.round(value / 30)
            // })
        })

        // return () => {
        //     scrollY.removeAllListeners();
        // }
    }, [])


    return <Animated.ScrollView
        snapToOffsets={[height-_heightOffset, height-_heightOffset + 1, height-_heightOffset + 2]}
        decelerationRate="fast"
        contentContainerStyle={{paddingTop: height - _heightOffset}}
        scrollEventThrottle={16}
        onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            { useNativeDriver: true }
        )}
    >
        <StatusBar hidden/>
        <View style={{width, height, position: 'absolute', top: 0, left: 0, overflow: 'hidden'}}>
            <Animated.Image
                ref={ref}
                source={{uri: _image}}
                style={{flex: 1, opacity, transform: [{scale}]}}
            />
        </View>
        <View style={{padding: 20, minHeight: height}}>
            <View style={{alignItems: 'center', height: _heightOffset, justifyContent: 'center'}}>
                <Animated.Text style={{fontSize: 12, textTransform: 'uppercase', fontWeight: '800', letterSpacing: 4, marginBottom: 10, color: 'white', opacity}} numberOfLines={1} adjustsFontSizeToFit>12-apr-2021</Animated.Text>
                <View>
                    <Animated.Text style={{fontSize: 42, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 14, color: 'white', opacity}} numberOfLines={1} adjustsFontSizeToFit>farmers camp</Animated.Text>
                    <Animated.Text style={{fontSize: 42, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 14, position: 'absolute', opacity: opacityReversed}} numberOfLines={1} adjustsFontSizeToFit>farmers camp</Animated.Text>
                </View>
            </View>
            {[...Array(10).keys()].map((index) => (
                <MText transition={{delay: 50 * index}} state={useFadeInDown} key={faker.random.uuid()} style={{marginBottom: 20, fontSize: 16, lineHeight: 24, fontFamily: 'Georgia'}}>{faker.lorem.sentences(faker.random.number(3) + 2)}</MText>
            ))}
        </View>
    </Animated.ScrollView>
}