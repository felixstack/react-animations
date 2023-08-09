// Icon: https://www.flaticon.com/free-icon/joystick_3142027?term=controller&related_id=3142027
// Inspiration: https://dribbble.com/shots/11568643-Multi-player-interaction
import * as React from 'react';
import {
    Switch,
    Image,
    View,
    Text,
    Dimensions,
    StyleSheet,
    Pressable,
    Button,
    SafeAreaView,
    ScrollView,
} from 'react-native';

import { AnimatePresence, View as MView, Text as MText, motify } from 'moti';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import SvgController from './SvgController';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('screen');
const colors = ['#085BFF', '#FF7995', '#31DC5C', '#F7B02A'];

const maxPlayers = 4;
const spacing = 20;
const containerWidth = width - spacing * 2;
const iconSize = (containerWidth * 0.95) / maxPlayers;
export default PlayersCount = () => {
    const [numberOfPlayers, setNumberOfPlayers] = React.useState(1);
    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: spacing }}>
            <StatusBar hidden />
            <View
                style={{
                    shadowOffset: { width: 0, height: 6 },
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowRadius: 10,
                }}
            >
                <View style={{ borderRadius: 12, overflow: 'hidden', backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', height: width / 2 }}>
                        <AnimatePresence>
                            {colors.map((color, index) => {
                                if (index > numberOfPlayers) {
                                    return
                                }
                                return (
                                    <MView
                                        from={{ width: containerWidth, translateX: (width * index) / 4 }}
                                        animate={{ width: containerWidth / numberOfPlayers, translateX: 0 }}
                                        exit={{ width: 0, translateX: (width * index) / 4 }}
                                        transition={{
                                            type: 'timing',
                                        }}
                                        key={color}
                                        style={{
                                            backgroundColor: `${color}44`,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <SvgController color={color} key={color} size={iconSize} />
                                    </MView>
                                );
                            })}
                        </AnimatePresence>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            padding: 20,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text style={{ fontFamily: 'Menlo' }}>Number of players</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Pressable
                                onPress={() => {
                                    if (numberOfPlayers === 1) {
                                        return;
                                    }
                                    setNumberOfPlayers((numberOfPlayers) => numberOfPlayers - 1);
                                }}
                            >
                                <MaterialCommunityIcons name='minus-circle' size={24} color='rgba(0,0,0,0.4)' />
                            </Pressable>
                            <Text style={{ marginHorizontal: 10, fontFamily: 'Menlo' }}>{numberOfPlayers}</Text>
                            <Pressable
                                onPress={() => {
                                    if (numberOfPlayers === maxPlayers) {
                                        return;
                                    }
                                    setNumberOfPlayers((numberOfPlayers) => numberOfPlayers + 1);
                                }}
                            >
                                <MaterialCommunityIcons name='plus-circle' size={24} color='rgba(0,0,0,0.4)' />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ alignItems: 'center', position: 'absolute', bottom: 100, width }}>
                <Text
                    style={{ fontFamily: 'Menlo', fontSize: 11, color: '#504774', fontWeight: '600', marginBottom: 10 }}
                >
                    {'>>>'} multi-player interaction {'<<<'}
                </Text>
                <Text style={{ fontFamily: 'Menlo', opacity: 1, color: '#504774' }}>
                    Built with <Text style={{ fontWeight: '900' }}>Moti</Text> by{' '}
                    <Text style={{ fontWeight: '900' }}>@mironcatalin ❤️</Text>
                </Text>
            </View>
        </View>
    );
};
