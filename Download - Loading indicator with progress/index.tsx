/*
    Inspiration: https://dribbble.com/shots/4937735-Download-Progress-PRD
*/
import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { View as MView, Text as MText, AnimatePresence } from 'moti';
import { StatusBar } from 'expo-status-bar';
const { width, height } = Dimensions.get('screen');

const _spacing = 20;
const _barHeight = 60;
const _colors = {
    inactive: '#6823BB',
    active: '#FFFFFF',
    bg: '#9A2DED',
};

export default function DownloadBar() {
    const [progress, setProgress] = React.useState('00');
    const [bar, setBar] = React.useState(1000);

    React.useEffect(() => {
        let timeoutId;
        if (parseInt(progress, 10) === 100) {
            timeoutId = setTimeout(() => {
                setProgress('00');
            }, 3000);
            return;
        }
        timeoutId = setTimeout(() => {
            const newProgress = parseInt(progress, 10) + Math.floor(Math.random() * 10) + 2;
            setProgress(newProgress < 10 ? `0${newProgress}` : Math.min(newProgress, 100).toString());
        }, 500);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [progress]);
    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: _spacing, backgroundColor: _colors.bg }}>
            <StatusBar hidden />
            <View
                style={{
                    height: _barHeight,
                    backgroundColor: _colors.inactive,
                    justifyContent: 'center',
                    paddingHorizontal: _spacing,
                    overflow: 'hidden',
                    maxWidth: width,
                }}
            >
                <MView
                    onLayout={(ev) => {
                        // console.log()
                        setBar(ev.nativeEvent.layout.width);
                    }}
                    from={{ translateX: -bar }}
                    animate={{ translateX: Math.min(-bar + (bar * parseInt(progress, 10)) / 100, 60) }}
                    transition={{
                        type: 'timing',
                        duration: 200,
                    }}
                    style={[
                        StyleSheet.absoluteFillObject,
                        {
                            backgroundColor: _colors.active,
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            paddingHorizontal: _spacing,
                        },
                    ]}
                >
                    <View style={{ overflow: 'hidden', height: 20, alignItems: 'center' }}>
                        <AnimatePresence>
                            {progress === '100' && (
                                <MText
                                    from={{ translateY: 20 }}
                                    animate={{ translateY: 0 }}
                                    exit={{ translateY: 20 }}
                                    transition={{ delay: progress === '100' ? 100 : 0, type: 'timing', duration: 200 }}
                                    key='done'
                                    style={{
                                        fontFamily: 'Menlo',
                                        fontWeight: '800',
                                        fontSize: 18,
                                        color: _colors.inactive,
                                    }}
                                >
                                    DONE
                                </MText>
                            )}
                        </AnimatePresence>
                    </View>
                </MView>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    {parseInt(progress, 10) < 100 && parseInt(progress, 10) > 0 && (
                        <View style={{ flexDirection: 'row' }}>
                            {progress.split('').map((t, i) => {
                                return (
                                    <View
                                        key={i}
                                        style={{ overflow: 'hidden', height: 20, justifyContent: 'center', width: 10 }}
                                    >
                                        <AnimatePresence>
                                            <MText
                                                from={{ translateY: 20 }}
                                                animate={{ translateY: 0 }}
                                                exit={{ translateY: -20 }}
                                                transition={{
                                                    duration: 200,
                                                    type: 'timing',
                                                }}
                                                key={`progress-${t}-${i}`}
                                                // transition={{duration: 350, type: 'timing'}}
                                                style={{
                                                    fontFamily: 'Menlo',
                                                    position: 'absolute',
                                                    fontWeight: '800',
                                                    fontSize: 18,
                                                    color: _colors.inactive,
                                                }}
                                            >
                                                {t}
                                            </MText>
                                        </AnimatePresence>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}
