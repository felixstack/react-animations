/*
    Inspiration: https://dribbble.com/shots/3317668-Preloader-V010100
*/
import * as React from 'react';
import { View, Dimensions, TouchableOpacity, StyleSheet, _ScrollView } from 'react-native';
import { View as MView, Text as MText, Image as MImage, AnimatePresence, motify } from 'moti';
import { StatusBar } from 'expo-status-bar';
const { width, height } = Dimensions.get('screen');

const _size = 80;
const _border = Math.round(_size / 10);

export default function PreloaderV() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#010100' }}>
            <StatusBar hidden />
            <MView
                from={{
                    borderWidth: 0,
                    width: _size,
                    height: _size,
                    opacity: 0,
                    shadowOpacity: 0.5,
                }}
                animate={{
                    borderWidth: _border,
                    width: _size + 12,
                    height: _size + 12,
                    opacity: 1,
                    shadowOpacity: 1,
                }}
                transition={{
                    type: 'timing',
                    duration: 1000,
                    loop: true,
                }}
                style={{
                    width: _size,
                    height: _size,
                    borderRadius: _size,
                    borderWidth: _border,
                    borderColor: '#fff',
                    shadowColor: '#fff',
                    shadowRadius: 10,
                    shadowOpacity: 1,
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                }}
            />
        </View>
    );
}
