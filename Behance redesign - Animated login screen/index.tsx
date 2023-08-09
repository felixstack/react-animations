// Video by MART PRODUCTION from Pexels
// Video Url: https://www.pexels.com/video/dropping-paint-on-clear-water-7565623/
// Inspiration: https://dribbble.com/shots/5850406--02-Behance-Login

import * as React from 'react';
import {
    StatusBar,
    Pressable,
    Image,
    Text,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Constants from 'expo-constants';
import { Video } from 'expo-av';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetTextInput,
    BottomSheetBackground,
} from '@gorhom/bottom-sheet';
import Animated from 'react-native-reanimated';
import { MotiView, MotiText, useDynamicAnimation } from 'moti';
import {
    useFonts,
    Lato_300Light,
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
} from '@expo-google-fonts/lato';
const { width, height } = Dimensions.get('screen');
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const _logoSize = Math.max(width * 0.14, 64);
const _spacing = 16;
const BehanceLogo = () => {
    return (
        <View style={styles.logo}>
            <Image
                source={{
                    uri:
                        'https://user-images.githubusercontent.com/2805320/126218158-2c5b55d1-6eec-4553-b516-ecede5027329.png',
                }}
                style={{ width: _logoSize, height: _logoSize, resizeMode: 'center' }}
            />
        </View>
    );
};
export default function App() {
    let [fontsLoaded] = useFonts({
        LatoRegular: Lato_400Regular,
        LatoBold: Lato_700Bold,
        LatoLight: Lato_300Light,
    });

    const bottomSheetModalRef = React.useRef(null);
    const dynamicAnimation = useDynamicAnimation(() => ({
        opacity: 0,
        translateY: 40,
    }));
    // variables
    const snapPoints = React.useMemo(() => ['60%'], []);

    // callbacks
    const showModal = React.useCallback(() => {
        bottomSheetModalRef.current?.present();
        setTimeout(
            () =>
                dynamicAnimation.animateTo((current) => ({
                    ...current,
                    opacity: 1,
                    translateY: 0,
                })),
            200
        );
    }, []);
    const hideModal = React.useCallback(() => {
        bottomSheetModalRef.current?.dismiss()
        dynamicAnimation.animateTo((current) => ({ ...current, opacity: 0, translateY: 40 }));
    }, []);
    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }
    return (
        <BottomSheetModalProvider>
            <StatusBar hidden />
            <View style={styles.container}>
                <Video
                    shouldPlay
                    isLooping
                    source={{
                        uri:
                            'https://user-images.githubusercontent.com/2805320/126218253-bae143d4-ed8e-4dd0-8ae6-eb0065883e6c.mp4',
                    }}
                    resizeMode="cover"
                    style={[StyleSheet.absoluteFillObject, { opacity: 1 }]}
                />
                <BehanceLogo />
                <View
                    style={{
                        padding: _spacing,
                        flex: 1,
                        justifyContent: 'flex-end',
                        paddingBottom: height * 0.2,
                    }}>
                    <Image
                        source={{
                            uri:
                                'https://user-images.githubusercontent.com/2805320/126218163-6736ba78-e7ae-4575-8486-0eadc90753fc.png',
                        }}
                        style={{
                            width: width * 0.3,
                            height: 30,
                            resizeMode: 'contain',
                            marginBottom: _spacing * 3,
                        }}
                    />
                    <Text style={[styles.light, styles.heading]}>
                        Imagine {'\n'}a community of infinite creativity
                    </Text>
                    <View
                        style={{
                            height: 2,
                            width: width * 0.2,
                            backgroundColor: '#fff',
                            marginTop: _spacing * 3,
                        }}
                    />
                </View>
                <Pressable onPress={showModal}>
                    <View
                        style={{
                            paddingVertical: _spacing,
                            paddingBottom: _spacing * 2,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#fff',
                            borderRadius: 32,
                        }}>
                        <AntDesign name="lock1" size={32} color="#053eff" />
                    </View>
                </Pressable>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    keyboardBehavior="interactive"
                    keyboardBlurBehavior="restore"
                    snapPoints={snapPoints}
                    handleComponent={() => {
                        return (
                            <Pressable onPress={hideModal}>
                                <View
                                    style={{
                                        height: 64,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#053eff30',
                                        backgroundColor: '#053eff10',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <MaterialIcons
                                        name="keyboard-arrow-down"
                                        size={36}
                                        color="#053eff"
                                        style={{ transform: [{ scaleX: 1.4 }] }}
                                    />
                                </View>
                            </Pressable>
                        );
                    }}>
                    <View
                        style={{
                            paddingHorizontal: _spacing * 2,
                            paddingVertical: _spacing * 3,
                            justifyContent: 'space-between',
                            flex: 1,
                        }}>
                        <MotiText
                            state={dynamicAnimation}
                            style={[
                                styles.regular,
                                { fontSize: 32, color: '#000', marginBottom: _spacing * 2 },
                            ]}>
                            Share your work {'\n'}with us
                        </MotiText>
                        <MotiView state={dynamicAnimation} delay={300}>
                            <BottomSheetTextInput
                                placeholderTextColor="rgba(0,0,0,0.3)"
                                shouldCancelWhenOutside
                                placeholder="Name"
                                style={[
                                    styles.regular,
                                    {
                                        borderBottomWidth: 2,
                                        borderBottomColor: 'rgba(0,0,0,0.1)',
                                        height: 64,
                                        fontSize: 24,
                                        marginBottom: _spacing * 2,
                                        paddingHorizontal: _spacing / 2,
                                    },
                                ]}
                            />
                            <BottomSheetTextInput
                                placeholderTextColor="rgba(0,0,0,0.3)"
                                placeholder="******"
                                secureTextEntry
                                style={[
                                    styles.regular,
                                    {
                                        borderBottomWidth: 2,
                                        borderBottomColor: 'rgba(0,0,0,0.1)',
                                        height: 64,
                                        fontSize: 24,
                                        marginBottom: _spacing * 2,
                                        paddingHorizontal: _spacing / 2,
                                    },
                                ]}
                            />
                        </MotiView>
                        <MotiView
                            state={dynamicAnimation}
                            delay={500}
                            style={{ justifyContent: 'center' }}>
                            <Pressable style={{ marginBottom: _spacing }}>
                                <View
                                    style={{
                                        backgroundColor: '#053eff',
                                        borderRadius: 16,
                                        paddingVertical: _spacing,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <Text style={[styles.bold, { fontSize: 16, color: '#fff' }]}>
                                        Sign in
                                    </Text>
                                </View>
                            </Pressable>
                            <View
                                style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                }}>
                                <Text style={[styles.bold, { fontSize: 16 }]}>
                                    You have no account?
                                </Text>
                                <Pressable>
                                    <Text
                                        style={[
                                            styles.bold,
                                            {
                                                fontSize: 16,
                                                color: '#053eff',
                                                marginLeft: _spacing / 2,
                                            },
                                        ]}>
                                        Sign up now
                                    </Text>
                                </Pressable>
                            </View>
                        </MotiView>
                    </View>
                </BottomSheetModal>
            </View>
        </BottomSheetModalProvider>
    );
}

const styles = StyleSheet.create({
    light: {
        fontFamily: 'LatoLight',
    },
    regular: {
        fontFamily: 'LatoRegular',
    },
    bold: {
        fontFamily: 'LatoBold',
    },
    heading: {
        fontSize: 46,
        color: '#fff',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    logo: {
        padding: _spacing,
        backgroundColor: '#fff',
        position: 'absolute',
        top: Constants.statusBarHeight,
        left: 0,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
