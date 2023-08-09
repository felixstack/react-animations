/*
    Inspiration: https://dribbble.com/shots/3235564-Chalendar
*/
import * as React from 'react';
import { View, Dimensions, TouchableOpacity, StyleSheet, _ScrollView, ScrollView, LayoutAnimation } from 'react-native';
import { View as MView, Text as MText, Image as MImage, useDynamicAnimation } from 'moti';
import { StatusBar } from 'expo-status-bar';

const DATA = [
    { value: 'personal', label: 'Personal', textColor: '#fff', color: '#42427B' },
    { value: 'work', label: 'Work', textColor: '#fff', color: '#4275F3' },
    { value: 'friends', label: 'Friends', textColor: '#fff', color: '#5DB4F4' },
    { value: 'family', label: 'Family', textColor: '#000', color: '#F5E7D7' },
    { value: 'business', label: 'Business', textColor: '#fff', color: '#9CD05D' },
];

export default function Chalendar() {
    const [data, setData] = React.useState(DATA.slice(0, 1));
    React.useEffect(() => {
        if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    const bg = useDynamicAnimation(() => ({
        backgroundColor: `${data[0].color}dd`,
    }));
    const textState = useDynamicAnimation(() => ({
        color: data[0].textColor,
    }));

    return (
        <MView style={{ flex: 1, justifyContent: 'center' }} state={bg} transition={{ duration: 1000 }}>
            <StatusBar hidden />
            <View style={{ paddingHorizontal: 20 }}>
                <MText
                    transition={{ duration: 600 }}
                    state={textState}
                    style={{
                        fontSize: 24,
                        fontWeight: '600',
                        fontFamily: 'Menlo'
                    }}
                >
                    Record YouTube video
                </MText>
                <MText
                    transition={{ duration: 600 }}
                    state={textState}
                    style={{ fontWeight: '300', letterSpacing: 1, opacity: 0.5 }}
                >
                    10:30 - 11:30PM, Monday, May 17
                </MText>
                <MText
                    transition={{ duration: 600 }}
                    state={textState}
                    style={{ fontWeight: '400', marginTop: 20, fontSize: 16, opacity: 0.8, paddingRight: 20 }}
                >
                    This is just an example. Right now I'm not in the mood of recording any YouTube tutorials. Some
                    people are calling it laziness, procrastination, but I call it burnout.
                </MText>
                <MText
                    transition={{ duration: 600 }}
                    state={textState}
                    style={{ fontWeight: '300', marginTop: 50, marginBottom: 10, fontSize: 12, opacity: 0.8 }}
                >
                    Select your category
                </MText>
            </View>
            <ScrollView
                horizontal
                style={{ flexGrow: 0 }}
                contentContainerStyle={{ paddingLeft: 20 }}
                showsHorizontalScrollIndicator={false}
            >
                {data.map((item) => {
                    return (
                        <TouchableOpacity
                            key={item.value}
                            onPress={() => {
                                LayoutAnimation.configureNext(
                                    LayoutAnimation.create(
                                        500,
                                        LayoutAnimation.Types.easeInEaseOut,
                                        LayoutAnimation.Properties.opacity
                                    )
                                    // LayoutAnimation.Presets.easeInEaseOut
                                );
                                setData((d) => {
                                    return data.length === DATA.length ? [item] : DATA;
                                });
                                bg.animateTo({
                                    ...bg.current,
                                    backgroundColor: `${item.color}dd`,
                                });
                                textState.animateTo({
                                    ...textState.current,
                                    color: item.textColor,
                                });
                            }}
                        >
                            <MView
                                style={{
                                    backgroundColor: item.color,
                                    paddingVertical: 6,
                                    paddingHorizontal: 18,
                                    borderRadius: 16,
                                    marginRight: 10,
                                }}
                            >
                                <MText style={{ color: item.textColor }}>{item.label}</MText>
                            </MView>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </MView>
    );
}
