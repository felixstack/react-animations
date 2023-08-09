import * as React from 'react';
import {
    TouchableOpacity,
    Animated,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    SectionList,
    StatusBar,
} from 'react-native';
import findLastIndex from 'lodash.findlastindex';
import { MotiView } from 'moti';

const DATA = [
    {
        title: 'Main dishes',
        key: 'Maindishes',
        data: [
            'Pizza',
            'Burger',
            'Risotto',
            'Pizza',
            'Burger',
            'Risotto',
            'Pizza',
            'Burger',
            'Risotto',
            'Pizza',
            'Burger',
            'Risotto',
            'Pizza',
            'Burger',
            'Risotto',
            'Pizza',
            'Burger',
            'Risotto',
        ],
    },
    {
        title: 'Sides',
        key: 'Sides',
        data: [
            'French Fries',
            'Onion Rings',
            'Fried Shrimps',
            'French Fries',
            'Onion Rings',
            'Fried Shrimps',
            'French Fries',
            'Onion Rings',
            'Fried Shrimps',
        ],
    },
    {
        title: 'Extra Sides',
        key: 'ExtraSides',
        data: [
            'French Fries',
            'Onion Rings',
            'Fried Shrimps',
            'French Fries',
            'Onion Rings',
            'Fried Shrimps',
            'French Fries',
            'Onion Rings',
            'Fried Shrimps',
        ],
    },
    {
        title: 'Drinks',
        key: 'Drinks',
        data: ['Water', 'Coke', 'Beer', 'Water', 'Coke', 'Beer'],
    },
    {
        title: 'Desserts',
        key: 'Desserts',
        data: ['Cheese Cake', 'Ice Cream', 'Cheese Cake'],
    },
];

const Item = ({ title, index }) => (
    <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

const App = () => {
    const activeSection = React.useRef(0);
    const ref = React.useRef();
    const sectionRef = React.useRef();
    const headers = React.useMemo(
        () => DATA.map((item) => ({ key: item.key, title: item.title })),
        []
    );
    const [index, setIndex] = React.useState(0);

    const onCheckViewableItems = ({ viewableItems, changed }) => {
        const half = viewableItems.slice(Math.floor(viewableItems.length / 2), -1);
        const lastIndex = findLastIndex(
            viewableItems,
            (i) => i.index === 0 || i.index === null
        );
        const middleSection = viewableItems[lastIndex];
        if (!middleSection) {
            return;
        }
        const {
            section: { key },
        } = middleSection;
        const activeIndex = DATA.findIndex((item) => item.key === key);
        if (activeIndex !== activeSection.current || index !== activeIndex) {
            activeSection.current = activeIndex;
            setIndex(activeIndex);
            console.log('Key: ', key);
            console.log('activeSection.current: ', activeSection.current);
        }
    };

    React.useEffect(() => {
        ref?.current?.scrollToIndex({
            index,
            animated: true,
            viewOffset: 0,
            viewPosition: 0.5,
        });
    }, [index]);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar hidden />
            <Animated.FlatList
                ref={ref}
                data={headers}
                contentContainerStyle={{ padding: 16 }}
                keyExtractor={(item) => item.key}
                initialScrollIndex={index}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index: fIndex }) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                activeSection.current = fIndex;
                                setIndex(fIndex);
                                sectionRef?.current.scrollToLocation({
                                    sectionIndex: fIndex,
                                    itemIndex: 0,
                                    animated: true,
                                    viewOffset: 0,
                                    viewPosition: 0.2,
                                });
                            }}>
                            <MotiView
                                animate={{
                                    backgroundColor: fIndex === index ? '#f9c2ffff' : '#f9c2ff00',
                                    borderColor: fIndex === index ? '#f9c2ff00' : '#f9c2ffff',
                                    opacity: fIndex === index ? 1 : 0.6,
                                }}
                                style={styles.tabs}>
                                <Text style={styles.tabsText}>{item.title}</Text>
                            </MotiView>
                        </TouchableOpacity>
                    );
                }}
            />
            <Animated.SectionList
                sections={DATA}
                ref={sectionRef}
                initialScrollIndex={0}
                contentContainerStyle={{ padding: 16 }}
                keyExtractor={(item, index) => item + index}
                onViewableItemsChanged={onCheckViewableItems}
                scrollEventThrottle={16}
                stickySectionHeadersEnabled={false}
                viewabilityConfig={{
                    minimumViewTime: 300,
                    // viewAreaCoveragePercentThreshold: 20,
                    itemVisiblePercentThreshold: 300, //means if 50% of the item is visible
                }}
                renderItem={({ item, index }) => <Item title={item} index={index} />}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.header}>{title}</Text>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 10,
        marginVertical: 8,
    },
    header: {
        fontSize: 32,
        backgroundColor: '#fff',
        fontFamily: 'Menlo',
        marginVertical: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Menlo',
    },
    tabs: {
        paddingHorizontal: 24,
        borderWidth: 2,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9c2ff',
        marginRight: 10,
        marginVertical: 10,
        borderRadius: 16,
    },
    tabsText: {
        fontSize: 14,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontFamily: 'Menlo',
    },
});

export default App;
