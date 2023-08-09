// Inspiration: https://dribbble.com/shots/6757806-Discover-scroll-interface
// temporary workaround for expo 45 bug:
// https://github.com/expo/snack/pull/292


import * as React from 'react';
import {
    TouchableOpacity,
    StatusBar,
    Dimensions,
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native';
import Constants from 'expo-constants';
import Animated, {interpolate, useSharedValue, useAnimatedStyle, Extrapolate} from 'react-native-reanimated';
import { faker } from '@faker-js/faker';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import {useLayout} from './useLayout'

const { width, height } = Dimensions.get('window');
const headerHeight = 64;
const _spacing = 10;

faker.seed(10);

const data = [...Array(10).keys()].map(() => {
    const key = faker.datatype.uuid();
    const sentenceNumber = faker.datatype.number(2) + 2;
    console.log(sentenceNumber)
    return {
        key,
        title: `${faker.name.jobTitle()} ${faker.name.jobType()}`,
        tags: [...Array(faker.datatype.number(3) + 2).keys()].map(() => faker.name.jobDescriptor()),
        content: faker.lorem.paragraphs(sentenceNumber),
        author: {
            name: faker.name.findName(),
            avatar: `https://i.pravatar.cc/200?u=${key}`,
        },
    };
});

const Item = ({ item, itemY, itemX, itemWidth, itemHeight, animatedIndex, index }) => {
    const {itemY: headerY, itemHeight: headerHeight, onLayout} = useLayout();
    const stylez = useAnimatedStyle(() => {
        return {
            // opacity: interpolate(animatedIndex.value, [0,1], [.2, 1]),
            transform: [{
                translateY: interpolate(animatedIndex.value, [0,1], [-itemY.value + (_spacing * 5 + 48) * index, 0])
            }]
        }
    })
    return (
        <Animated.View
            style={[{
                marginBottom: _spacing * 3,
                backgroundColor: '#fff',
                padding: _spacing * 3,
                borderRadius: 32,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: .2,
                shadowRadius: 10
            }, stylez]}>
            <Text style={{ fontWeight: '700', fontSize: 22 }} numberOfLines={2} adjustsFontSizeToFit>{item.title}</Text>
            <View style={{ flexDirection: 'row', marginVertical: _spacing * 2, flexWrap: 'wrap' }} onLayout={onLayout}>
                {item.tags.map((tag, index) => {
                    return (
                        <View
                            key={`${tag}-${index}`}
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.05)',
                                paddingVertical: _spacing,
                                paddingHorizontal: _spacing * 1.4,
                                marginRight: _spacing,
                                marginBottom: _spacing,
                                borderRadius: _spacing,
                            }}>
                            <Text style={{ opacity: 0.3 }}>{tag}</Text>
                        </View>
                    );
                })}
            </View>
            <Text style={{ marginBottom: _spacing * 3 }}>{item.content}</Text>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: _spacing * 2,
                }}>
                <Image
                    source={{ uri: item.author.avatar }}
                    style={{ marginRight: 10, width: 40, height: 40, borderRadius: 20 }}
                />
                <Text>{item.author.name}</Text>
            </View>
            <TouchableOpacity onPress={() => {}} style={{ alignSelf: 'center' }}>
                <View
                    style={{
                        backgroundColor: '#222',
                        borderRadius: _spacing,
                        paddingVertical: _spacing * 1.5,
                        paddingHorizontal: _spacing * 6,
                        flexGrow: 0,
                    }}>
                    <Text style={{ fontWeight: '800', color: '#fff', fontSize: 16 }}>Boost</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const CustomCellRendererComponent = React.memo(({ children, ...props }) => {
    const {onLayout, itemY, itemX, itemHeight, itemWidth} = useLayout();
    return (
        <View
            {...props}
            onLayout={onLayout}
        >
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, { itemY, itemX, itemWidth, itemHeight });
                }
                return child;
            })}
        </View>
    );
});

export default function App() {
    const animatedIndex = useSharedValue(0);
    const bottomSheetRef = React.useRef(null);
    const {itemWidth: headingWidth, onLayout} = useLayout()

    // variables
    const snapPoints = React.useMemo(
        () => [height / 2, height - headerHeight - Constants.statusBarHeight],
        []
    );

    // callbacks
    const handleSheetChanges = React.useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const stylez = useAnimatedStyle(() => {
        return {
            bottom: interpolate(animatedIndex.value, [0, 1], snapPoints)
        }
    })

    const headingStyles = useAnimatedStyle(() => {
        return {
            left: interpolate(animatedIndex.value, [0, 1], [_spacing * 2, width / 2 - headingWidth.value / 2], Extrapolate.CLAMP),
            top: interpolate(animatedIndex.value, [0, 1], [0, (headerHeight + Constants.statusBarHeight - 24) / 2], Extrapolate.CLAMP)
        }
    })
    const subHeadingStyles = useAnimatedStyle(() => {
        return {
            opacity: interpolate(animatedIndex.value, [0, 1], [1, 0]),
            transform: [{
                translateY: interpolate(animatedIndex.value, [0, 1], [0, headerHeight + Constants.statusBarHeight], Extrapolate.CLAMP)
            }]
        }
    })

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Animated.View style={[{position: 'absolute', top: 0, left: 0, right: 0, justifyContent: 'center'}, stylez]}>
                <View style={{paddingHorizontal: _spacing * 2}}>
                    <Animated.View style={[{position: 'absolute', left: 0, flexDirection: 'row'}, headingStyles]} onLayout={onLayout}>
                        <Text style={{fontWeight: '800', color: 'white', fontSize: 28}}>Discover</Text>
                        <Text style={{fontWeight: '800', color: '#F60822', fontSize: 28}}>.</Text>
                    </Animated.View>
                    <Animated.Text style={[{color: 'white', marginTop: 50}, subHeadingStyles]}>Discover design article,{'\n'}illustrations & interfaces.</Animated.Text>
                </View>

            </Animated.View>
            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                animateOnMount
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                animatedIndex={animatedIndex}
                handleComponent={() => {
                    return null;
                }}
                backgroundStyle={{
                    backgroundColor: 'transaprent',
                }}>
                <BottomSheetFlatList
                    data={data}
                    keyExtractor={(item) => item.key}
                    CellRendererComponent={CustomCellRendererComponent}
                    contentContainerStyle={{
                        padding: _spacing,
                    }}
                    renderItem={({ item, index }) => {
                        return <Item item={item} animatedIndex={animatedIndex} index={index}/>;
                    }}
                />
            </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#222',
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
