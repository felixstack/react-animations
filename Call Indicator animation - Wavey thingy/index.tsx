/*
    Inspiration: -
*/
import * as React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { View as MView, Text as MText, AnimatePresence } from 'moti';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { Easing } from 'react-native-reanimated';
const { width, height } = Dimensions.get('screen');

const _color = "#6E01EF";
const _size = 100;

export default function WaveThingy() {
    return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <StatusBar hidden/>
        <MView
            style={[styles.dot, styles.center]}
        >
            {[...Array(3).keys()].map(i => (
                <MView
                    key={i}
                    from={{scale: 1, opacity: .3,}}
                    animate={{scale: 4, opacity: 0}}
                    transition={{
                        loop: true,
                        repeatReverse: false,
                        duration: 2000,
                        delay: i * 400,
                        type: 'timing',
                        easing: Easing.out(Easing.ease)
                    }}
                    style={[StyleSheet.absoluteFillObject, styles.dot]}
                />
            ))}
            <Feather name="phone-outgoing" size={32} color="#fff"/>
        </MView>
    </View>
}

const styles = StyleSheet.create({
    dot: {width: _size, height: _size, borderRadius: _size, backgroundColor: _color},
    center: {alignItems: 'center', justifyContent: 'center'}
})