// Inspiration: https://dribbble.com/shots/19727846-Money-Transfer-App
import './polyfills'

import * as React from 'react';
import { Pressable, StatusBar, TextStyle, View } from 'react-native';
import { MotiView } from 'moti';

import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

function Splash({ text, style, dotColor }: { text: string; dotColor?: string; style?: TextStyle }) {
    const _delay = 100;
    const reversedText = React.useMemo(() => {
        return text.split('').reverse();
    }, [text]);

    return (
        <View>
            <MotiView
                key={text}
                entering={FadeInUp.delay(reversedText.length * _delay).springify()}
                exiting={FadeOutUp.delay(reversedText.length * _delay).springify()}
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    type: 'timing',
                    loop: true,
                    duration: 700,
                    repeatReverse: true,
                    delay: reversedText.length * _delay,
                }}
                style={{
                    backgroundColor: dotColor || 'lime',
                    width: (style.fontSize ?? 94) / 6,
                    height: (style.fontSize ?? 94) / 6,
                    alignSelf: 'flex-end',
                }}
            />
            {reversedText.map((char, index) => {
                return (
                    <Animated.View
                        key={`char_${char}_index_${index}}`}
                        entering={FadeInUp.delay((reversedText.length - index) * _delay).springify()}
                        exiting={FadeOutUp.delay((reversedText.length - index) * _delay).springify()}
                    >
                        <Animated.Text
                            style={[
                                { fontWeight: 'bold', fontFamily: 'Menlo', color: '#fff' },
                                style,
                                {
                                    fontSize: style.fontSize ?? 94,
                                    lineHeight: style.fontSize ?? 94,
                                    textAlign: 'center',
                                    marginVertical: -(style.fontSize ?? 94) / 8,
                                    transform: [{ rotate: '-90deg' }],
                                },
                            ]}
                        >
                            {char}
                        </Animated.Text>
                    </Animated.View>
                );
            })}
        </View>
    );
}

export default function App() {
    const [shouldShow, setShouldShow] = React.useState(false);
    return (
        <Pressable onPress={() => setShouldShow(!shouldShow)} style={{flex: 1}}>
            <View
                style={{ backgroundColor: '#333', flex: 1, justifyContent: 'center', alignItems: 'center' }}
            >
                <StatusBar hidden />
                {shouldShow && <Splash text='transfer' style={{ fontSize: 94 }} dotColor='gold' />}
            </View>
        </Pressable>
    );
}
