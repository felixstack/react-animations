/*
    Inspiration: https://dribbble.com/shots/4858673-Button-PRD
*/
import * as React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { View as MView, Text as MText, AnimatePresence } from 'moti';
import { StatusBar } from 'expo-status-bar';
const { width, height } = Dimensions.get('screen');

const _spacing = 20;
const _buttonHeight = 60;
const _colors = {
    disabled: '#010100',
    enabled: '#FFFFFF',
    enabledText: '#032AE3',
    disabledText: '#FFFFFF',
    bg: '#3333E4',
};

export default function ButtonState() {
    const [enabled, setEnabled] = React.useState(true);
    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: _spacing * 2, backgroundColor: _colors.bg }}>
            <StatusBar hidden/>
            <TouchableOpacity onPress={() => setEnabled((enabled) => !enabled)}>
                <View style={styles.button}>
                    <AnimatePresence>
                        {!enabled && (
                            <MView
                                key='bg-enabled'
                                from={{ translateY: -_buttonHeight }}
                                animate={{ translateY: 0 }}
                                exit={{ translateY: -_buttonHeight }}
                                transition={{ delay: 200, type: 'timing' }}
                                style={[
                                    StyleSheet.absoluteFillObject,
                                    {
                                        backgroundColor: _colors.disabled,
                                    },
                                ]}
                            />
                        )}
                    </AnimatePresence>
                    <View style={{ overflow: 'hidden' }}>
                        <AnimatePresence exitBeforeEnter>
                            {enabled ? (
                                <MText
                                    from={{ opacity: 0, translateY: 20 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    exit={{ opacity: 0, translateY: 20 }}
                                    transition={{ type: 'timing', duration: 350 }}
                                    key='text-enabled'
                                    style={[styles.text, styles.textEnabled]}
                                >
                                    Enabled
                                </MText>
                            ) : (
                                <MText
                                    from={{ opacity: 0, translateY: -20 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    exit={{ opacity: 0, translateY: -20 }}
                                    transition={{ type: 'timing', duration: 350 }}
                                    key='text-disabled'
                                    style={styles.text}
                                >
                                    Disabled
                                </MText>
                            )}
                        </AnimatePresence>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontWeight: '700',
        fontSize: 18,
        letterSpacing: -0.5,
        textTransform: 'uppercase',
        color: _colors.disabledText,
    },
    textEnabled: {
        color: _colors.enabledText,
    },
    button: {
        height: _buttonHeight,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: _colors.enabled,
    },
});
