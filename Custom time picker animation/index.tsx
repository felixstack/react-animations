import * as React from 'react';
import { Animated, FlatList, Text, View, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const minutes = [...Array(60).keys()].map((i) => {
    return {
        key: `minute-${i}`,
        index: i,
        label: i < 10 ? `0${i}` : `${i}`,
    };
});
const hours = [...Array(24).keys()].map((i) => {
    const start = i;
    return {
        key: `hour-${i}`,
        index: i,
        // numbers: 0..9..12..23
        // output 00..09..12..01..11
        label: start === 12 ? '12' : start % 12 < 10 ? `0${start % 12}` : `${start % 12}`,
    };
});
const t = ['AM', 'PM'].map((v, i) => {
    return {
        index: i,
        key: v,
        label: v,
    };
});
const isAMorPM = (hour) => {
    return hour.index > 11 ? 'PM' : 'AM';
};

const ITEM_HEIGHT = 42;
const PICKER_HEIGHT = ITEM_HEIGHT * 3;
const Item = ({ opacity, item }) => {
    return (
        <View style={{ height: ITEM_HEIGHT, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.Text style={{ fontWeight: '700', opacity, fontSize: ITEM_HEIGHT - 4 }}>
                {item.label}
            </Animated.Text>
        </View>
    );
};

const CustomPicker = React.forwardRef(({ data, onChange, scrollEnabled = true }, ref) => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
        if (!onChange) {
            return;
        }
        animatedValue.addListener(({ value }) => {
            const y = Math.max(Math.min(value, ITEM_HEIGHT * (data.length - 1)), 0);
            const i = Math.floor(y / ITEM_HEIGHT);
            if (onChange) {
                onChange(data[i]);
            }
        });

        return () => {
            animatedValue.removeAllListeners();
        };
    }, []);

    return (
        <Animated.FlatList
            scrollEnabled={scrollEnabled}
            ref={ref}
            data={data}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                useNativeDriver: true,
            })}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            keyExtractor={(item) => item.key}
            style={{ height: PICKER_HEIGHT, flexGrow: 0 }}
            contentContainerStyle={{
                paddingVertical: PICKER_HEIGHT / 2 - ITEM_HEIGHT / 2,
            }}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate='fast'
            renderItem={({ item, index }) => {
                const opacity = Animated.divide(animatedValue, ITEM_HEIGHT).interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [0.15, 1, 0.15],
                });
                return <Item opacity={opacity} item={item} />;
            }}
        />
    );
});

export default function TimePicker() {
    const [hour, setHour] = React.useState(hours[0]);
    const [minute, setMinute] = React.useState(minutes[0]);
    const [dayOrNight, setDayOrNight] = React.useState(t[0].label);
    const d = React.useRef();

    // scroll the AM | PM
    React.useEffect(() => {
        const type = isAMorPM(hour);
        if (dayOrNight !== type) {
            setDayOrNight(type);
            d?.current?.scrollToOffset({
                offset: type === 'AM' ? 0 : ITEM_HEIGHT,
                animated: true,
            });
        }
    }, [hour]);

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <StatusBar hidden />
            <View style={{ padding: 20, paddingVertical: 40 }}>
                <Text style={{ fontSize: 14 }}>Selected time:</Text>
                <Text style={{ fontWeight: '700', fontSize: 24, fontFamily: 'Menlo' }}>
                    {hour.label}:{minute.label} {dayOrNight}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <CustomPicker ref={d} data={t} scrollEnabled={false} />
                <CustomPicker
                    data={hours}
                    onChange={(item) => {
                        if (item.index === hour.index) {
                            return;
                        }
                        setHour(item);
                    }}
                />
                <CustomPicker
                    data={minutes}
                    onChange={(item) => {
                        if (item.index === minute.index) {
                            return;
                        }
                        setMinute(item);
                    }}
                />
            </View>
        </View>
    );
}
