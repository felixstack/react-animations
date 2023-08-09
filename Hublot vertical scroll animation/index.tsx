/*
    Inspiration: https://dribbble.com/shots/6901939-Watch-Showroom-Mobile-App
*/
import * as React from 'react';
import { StatusBar, Animated, FlatList, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { View as MView, Image as MImage, AnimatePresence } from 'moti';
import { Easing } from 'react-native-reanimated';
import { faker } from '@faker-js/faker';
const { width, height } = Dimensions.get('screen');
import data from './hublot.json';

const _height = height * 0.7;
const _imageWidth = width * 0.8;
const _imageHeight = _imageWidth * 1.47;

export default function RolexWatches() {
    const scrollY = React.useRef(new Animated.Value(0)).current;
    const ref = React.useRef();
    React.useEffect(() => {
        StatusBar.setHidden(true);
        // Dinamically scroll to let the user know what direction is the scroll :)
        // const bottom = setTimeout(() => {
        //     ref?.current?.scrollToOffset({
        //         offset: 100,
        //         animated: true
        //     })
        // }, 400)
        // const back = setTimeout(() => {ref?.current?.scrollToOffset({
        //     offset: 0,
        //     animated: true
        // })}, 600);

        // return () => {
        //     clearTimeout(back)
        //     clearTimeout(bottom)
        // }
    }, []);
    return (
        <Animated.FlatList
            ref={ref}
            data={data}
            keyExtractor={(item) => item.img}
            snapToInterval={_height}
            decelerationRate='fast'
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
            contentContainerStyle={{
                backgroundColor: '#EEEFF3',
                paddingVertical: (height - _height) / 4,
            }}
            renderItem={({ item, index }) => {
                const inputRange = [index - 1, index, index + 1];
                const translateY = Animated.divide(scrollY, _height).interpolate({
                    inputRange,
                    outputRange: [300, 0, -300],
                });
                const scale = Animated.divide(scrollY, _height).interpolate({
                    inputRange,
                    outputRange: [0.5, 1, 0.5],
                    extrapolate: 'clamp',
                });
                const opacity = Animated.divide(scrollY, _height).interpolate({
                    inputRange,
                    outputRange: [0, 1, 0],
                    extrapolate: 'clamp',
                });
                const translateYText = Animated.divide(scrollY, _height).interpolate({
                    inputRange,
                    outputRange: [-200, 0, -200],
                });
                return (
                    <View style={{ width: width, height: _height, alignItems: 'center', justifyContent: 'flex-start' }}>
                        <Animated.Image
                            source={{ uri: item.img }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                opacity: 0.5,
                                transform: [
                                    {
                                        rotate: '50deg',
                                    },
                                    {
                                        translateY,
                                    },
                                ],
                                width: _imageWidth * 0.8,
                                height: _imageHeight * 0.75,
                                resizeMode: 'contain',
                            }}
                            blurRadius={4}
                        />
                        <Animated.Image
                            source={{ uri: item.img }}
                            style={{
                                transform: [
                                    {
                                        scale,
                                    },
                                ],
                                width: _imageWidth,
                                height: _imageHeight,
                                resizeMode: 'cover',
                            }}
                        />
                        <Animated.View
                            style={{
                                backgroundColor: '#fff',
                                paddingVertical: 40,
                                width: width * 0.8,
                                borderRadius: 12,
                                transform: [
                                    {
                                        translateY: translateYText,
                                    },
                                ],
                                opacity,
                                alignItems: 'center',
                                marginTop: -20,
                                zIndex: -1,
                            }}
                        >
                            <Text
                                style={{
                                    opacity: 0.4,
                                    fontSize: 12,
                                    fontWeight: '700',
                                    maxWidth: width * 0.7,
                                    marginBottom: 20,
                                    textAlign: 'center',
                                    letterSpacing: 3
                                }}
                            >
                                {item.collection}
                            </Text>
                            <Text
                                style={{
                                    opacity: 0.8,
                                    marginBottom: 20,
                                    maxWidth: width * 0.7,
                                    textAlign: 'center',
                                    fontSize: 16,
                                    fontWeight: '800',
                                    fontFamily: 'Georgia'
                                }}
                            >
                                {item.subcollection}
                            </Text>
                            <Text style={{ fontFamily: 'Georgia', fontSize: 32, marginBottom: 10 }}>{item.price}</Text>
                            <TouchableOpacity style={{ position: 'absolute', bottom: -40 }}>
                                <View
                                    style={{
                                        borderRadius: 12,
                                        backgroundColor: '#1C3A80',
                                        margin: 20,
                                        height: 44,
                                        paddingHorizontal: 44,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{ color: 'white', fontWeight: '800', textTransform: 'uppercase' }}>
                                        Add to cart
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                );
            }}
        />
    );
}
