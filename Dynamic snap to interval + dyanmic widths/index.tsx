/*
    Inspiration: -
*/
import * as React from 'react';
import { StatusBar, Animated, FlatList, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { View as MView, Text as MText, Image as MImage, AnimatePresence } from 'moti';
import { Easing } from 'react-native-reanimated';
import { faker } from '@faker-js/faker';
import { Feather, Entypo } from '@expo/vector-icons';
const { width, height } = Dimensions.get('screen');

faker.seed(10);

const data = [...Array(10).keys()].map(() => ({
    key: faker.random.uuid(),
    job: faker.commerce.productName(),
}));

export default function UberEats() {
    const [index, setIndex] = React.useState(0);
    const [viewPosition, setViewPosition] = React.useState(0)
    const ref = React.useRef();

    React.useEffect(() => {
        ref?.current?.scrollToIndex({
            index,
            animated: true,
            viewOffset: viewPosition === .5 ? 0 : viewPosition === 1 ? 0 : 10,
            viewPosition
        })
    }, [index, viewPosition])
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.FlatList
                ref={ref}
                style={{ flexGrow: 0 }}
                data={data}
                initialScrollIndex={index}
                keyExtractor={(item) => item.key}
                contentContainerStyle={{ paddingLeft: 10 }}
                showsHorizontalScrollIndicator={false}
                horizontal
                renderItem={({ item, index: fIndex }) => {
                    return (
                        <TouchableOpacity onPress={() => {
                            setIndex(fIndex)
                        }}>
                            <MView
                                animate={{
                                    backgroundColor: fIndex === index ? '#FCD259ff' : '#FCD25900',
                                    borderColor: fIndex === index ? '#FCD25900' : '#FCD259ff',
                                    opacity: fIndex === index ? 1 : .6,
                                }}
                                transition={{
                                    delay: 200
                                }}
                                style={{ marginRight: 10, padding: 10, borderWidth: 2, backgroundColor: '#FCD259', borderRadius: 12 }}
                            >
                                <MText
                                    from={{opacity: 0.8}}
                                    animate={{opacity: 1}}
                                    style={{ color: '#36303F', fontWeight: '700' }}>{item.job}</MText>
                            </MView>
                        </TouchableOpacity>
                    );
                }}
            />
            <View style={{alignItems: 'center', flexDirection: 'row', marginTop: 100}}>
                <View style={{alignItems: 'center'}}>
                    <Text style={{ color: '#36303F', fontWeight: '700', marginBottom: 10 }}>Scroll position</Text>
                    <View style={{flexDirection: 'row', width: width / 2, justifyContent: 'center'}}>
                        <TouchableOpacity onPress={() => {
                            setViewPosition(0)
                        }}>
                            <View style={{ padding: 10, backgroundColor: '#FCD259', borderRadius: 12, marginRight: 10 }}>
                                <Entypo name='align-left' size={24} color='#36303F' />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setViewPosition(.5)
                        }}>
                            <View style={{ padding: 10, backgroundColor: '#FCD259', borderRadius: 12, marginRight: 10 }}>
                                <Entypo name='align-horizontal-middle' size={24} color='#36303F' />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setViewPosition(1)
                        }}>
                            <View style={{ padding: 10, backgroundColor: '#FCD259', borderRadius: 12 }}>
                                <Entypo name='align-right' size={24} color='#36303F' />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View><View style={{alignItems: 'center'}}>
                <Text style={{ color: '#36303F', fontWeight: '700', marginBottom: 10 }}>Navigation</Text>
                <View style={{flexDirection: 'row', width: width / 2, justifyContent: 'center'}}>
                    <TouchableOpacity onPress={() => {
                        if (index === 0) {
                            return;
                        }
                        setIndex(index => index - 1)
                    }}>
                        <View style={{ padding: 10, backgroundColor: '#FCD259', borderRadius: 12, marginRight: 10 }}>
                            <Feather name='arrow-left' size={24} color='#36303F' />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        if (index === data.length - 1) {
                            return;
                        }
                        setIndex(index => index + 1)
                    }}>
                        <View style={{ padding: 10, backgroundColor: '#FCD259', borderRadius: 12 }}>
                            <Feather name='arrow-right' size={24} color='#36303F' />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            </View>
        </View>
    );
}
