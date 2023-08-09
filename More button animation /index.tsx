/*
    Inspiration: https://dribbble.com/shots/15066078-Add-button
*/
import * as React from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import { View as MView, Text as MText, Image as MImage, AnimatePresence } from 'moti';
import { Feather } from '@expo/vector-icons';

const Button = ({ icon = 'plus', onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <MView style={{ width: 36, height: 36, borderRadius: 36, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name={icon} size={20} color='black' />
            </MView>
        </TouchableOpacity>
    );
};

export default function MoreButton() {
    const [active, setActive] = React.useState(false);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F3F5' }}>
            <View style={{ alignItems: 'center' }}>
                <AnimatePresence>
                    {!!active && (
                        <MView
                            from={{ opacity: 0, translateY: 0, paddingBottom: 0 }}
                            animate={{ opacity: 1, translateY: 0, paddingBottom: 50 }}
                            exit={{ opacity: 0, translateY: 10, paddingBottom: 0 }}
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: 25,
                                width: 40,
                                alignItems: 'center',
                                paddingBottom: 50,
                                position: 'absolute',
                                bottom: 0,
                            }}
                        >
                            <Button icon='bell' onPress={() => setActive(false)} />
                            <Button icon='bluetooth' onPress={() => setActive(false)} />
                            <Button icon='cast' onPress={() => setActive(false)} />
                            <Button icon='coffee' onPress={() => setActive(false)} />
                        </MView>
                    )}
                </AnimatePresence>
                <TouchableOpacity onPress={() => setActive((active) => !active)} activeOpacity={1}>
                    <MView
                        animate={{
                            backgroundColor: !active ? '#FCD259' : '#dfdfdf',
                            rotate: active ? '-45deg' : '0deg',
                        }}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 50,
                            backgroundColor: '#FCD259',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Feather name='plus' size={24} color='black' />
                    </MView>
                </TouchableOpacity>
            </View>
        </View>
    );
}
