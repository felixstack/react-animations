/*
    Inspiration: https://dribbble.com/shots/14891203-Banking-Mobile-App
*/
import * as React from 'react';
import { FlatList, Text, View, Dimensions, _ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import colors from 'nice-color-palettes';

import { faker } from '@faker-js/faker';
faker.seed(10);
import Animated, {
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

/*
  Here we have a FlatList + a full screen component
  The FlatList will start from index 1 instead of index 0 because on index 0 we have a dummy element
  that will trigger the fullscreen element when it's "visible", basically this means that if the user
  will scroll from index 1 to index 0, we will animate the CustomScreen to stretch the entire device screen
  and also show the inside content.

  The dummy screen is inside the flatlist, initially it has the width as the rest of the elements from the FlatList.
  When the FlatList is scrolled to index 0, this dummy element will grow so that the rest of the FlatList elements will not
  appear in the viewport.
  index = [0, 1, 2]
  width = [width, _width, _width]
*/

const data = [...Array(10).keys()].map((i) => ({
    key: faker.random.uuid(),
    bg: faker.helpers.randomize(colors[faker.random.number(10)]),
    mask: faker.finance.mask(),
    amount: faker.finance.amount(100, 5000, 2, '$'),
}));
data.unshift({
    key: 'dummy',
    bg: 'transparent',
});

const { width, height } = Dimensions.get('screen');
const _width = width * 0.7;
const _height = width * 1.1;
const _spacing = 10;
const _threshold = 100;
const _cellSize = _width + _spacing * 2;
const _keySize = width / 3;
const _keyz = [...Array(10).keys()].map((i) => 9 - i);

const CustomScreen = ({ animatedValue, isActive }) => {
    const stylez = useAnimatedStyle(() => {
        // because initial height is _height * .7, we need to apply a marginTop to align the item to the
        // center of the flatlist items.
        // flatlist item height: _height
        // initial dummy element item height: _height * .7
        // marginTop to align the item to the center _height * .3 / 2 or _height * .15;
        const diffHeight = _height * 0.3;
        const thresholdX = -(width - _cellSize) / 4 + _spacing;
        return {
            transform: [
                {
                    // move the element along with the scrollX of the FlatList
                    translateX: interpolate(
                        animatedValue.value,
                        [0, _cellSize, _cellSize + 1, _cellSize + 2],
                        [0, -thresholdX, -thresholdX - 1, -thresholdX - 2]
                    ),
                },
            ],
            // opacity -> 0 after scrolling the second item
            opacity: interpolate(animatedValue.value, [0, _cellSize, _cellSize * 1.5], [1, 1, 0]),
            margin: interpolate(animatedValue.value, [-1, 0, _width, _cellSize * 2], [0, 0, _spacing, _spacing]),
            borderRadius: interpolate(
                animatedValue.value,
                [-1, 0, _width, _cellSize * 2],
                [0, 0, 30, 30]
            ),
            marginTop: interpolate(
                animatedValue.value,
                [-1, 0, _width, _cellSize * 2],
                [0, 0, diffHeight / 2, diffHeight / 2]
            ),

            width: interpolate(animatedValue.value, [-1, 0, _width, _cellSize * 2], [width, width, _width, _width]),
            height: interpolate(
                animatedValue.value,
                [-1, 0, _width, _cellSize * 2],
                [height, height, _height - diffHeight, _height - diffHeight]
            ),
        };
    });
    const innerStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(animatedValue.value, [-1, 0, _width / 2, _cellSize * 2], [1, 1, 0, 0]),
        };
    });
    return (
        <Animated.View style={[{ position: 'absolute', backgroundColor: '#050833', borderRadius: 30 }, stylez]}>
            <Animated.View
                style={[innerStyle, { flex: 1, padding: _spacing, alignItems: 'center', justifyContent: 'center' }]}
            >
                <Text style={{ fontSize: 18, color: 'white', fontFamily: 'Menlo' }}>Your card number</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: _keySize * 3, justifyContent: 'center' }}>
                    {_keyz.map((i) => {
                        return (
                            <View
                                key={`key-${i}`}
                                style={{
                                    width: _keySize,
                                    height: _keySize,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text style={{ fontSize: 32, color: 'white', fontFamily: 'Menlo', fontFamily: 'Menlo' }}>{i}</Text>
                            </View>
                        );
                    })}
                </View>
            </Animated.View>
        </Animated.View>
    );
};

const DummyItem = ({ animatedValue }) => {
    const stylez = useAnimatedStyle(() => {
        return {
            // we need to make the item larger so the "flatlist" items will dissapear when dummy element
            // is visible.
            width: interpolate(animatedValue.value, [-1, 0, _cellSize, _cellSize + 1], [width, width, _width, _width]),
            margin: _spacing,
        };
    });
    return <Animated.View style={stylez} />;
};

const Item = ({ animatedValue, item, index }) => {
    const stylez = useAnimatedStyle(() => {
        return {
            opacity: interpolate(animatedValue.value / _cellSize, [index - 1, index, index + 1], [0.3, 1, 0.3]),
        };
    });
    return (
        <Animated.View
            style={[
                {
                    backgroundColor: item.bg,
                    width: _width,
                    height: _height,
                    margin: _spacing,
                    borderRadius: 30,
                    padding: 30,
                    justifyContent: 'space-between',
                },
                stylez,
            ]}
        >
            <Text style={{ color: 'white', fontFamily: 'Menlo', fontSize: 16, opacity: .8, fontWeight: '700', alignSelf: 'flex-end' }}>
                **** **** **** {item.mask}
            </Text>
            <Text style={{ color: 'white', fontFamily: 'Menlo', fontSize: 24, fontWeight: '700' }}>{item.amount}</Text>
        </Animated.View>
    );
};

export default function BankingSlider() {
    const animatedValue = useSharedValue(_cellSize);
    const isActive = useSharedValue(false);
    const onScroll = useAnimatedScrollHandler((event, ctx = { y: 0, time: Date.now() }) => {
        const { x } = event.contentOffset;
        if (x < -_threshold) {
            isActive.value = true;
        } else {
            isActive.value = false;
        }
        animatedValue.value = x;
    });
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                {/*
                this is the element that will be displayed when FlatList will be scrolled to
                index 0. At index 0 there's a dummy element which is not visible to the user
                but plays the role of a placeholder. Notice that we start the FlatList
                with scrollOffset the dummy element width.
            */}
                <CustomScreen animatedValue={animatedValue} isActive={isActive} />
                <AnimatedFlatList
                    data={data}
                    keyExtractor={(item) => item.key}
                    onScroll={onScroll}
                    style={{ flexGrow: 0 }}
                    bounces={false}
                    contentContainerStyle={{
                        paddingHorizontal: (width - _cellSize) / 2,
                    }}
                    contentOffset={{
                        // we want to offset the scroll by one item so we don't display the full item element.
                        x: _cellSize,
                    }}
                    decelerationRate='fast'
                    snapToInterval={_cellSize}
                    scrollEventThrottle={16}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    renderItem={({ item, index }) => {
                        if (item.key === 'dummy') {
                            // Display the dummyitem component that plays the role of a placeholder.
                            return <DummyItem animatedValue={animatedValue} />;
                        }
                        return <Item animatedValue={animatedValue} item={item} index={index} />;
                    }}
                />
            </View>
            <StatusBar hidden/>
        </View>
    );
}
