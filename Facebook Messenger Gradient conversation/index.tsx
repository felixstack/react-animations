import React from 'react';
import {
    FlatList,
    StatusBar,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Animated,
    ScrollView,
} from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { faker } from '@faker-js/faker';

const { width, height } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

faker.seed(10);

const data = [...Array(100).keys()].map((i) => ({
    key: faker.datatype.uuid(),
    text: faker.lorem.sentences(faker.helpers.arrayElement([1, 2])),
    mine: faker.helpers.arrayElement([true, false]),
}));

export default () => {
    const [measures, setMeasures] = React.useState({ height });
    const scrollY = React.useRef(new Animated.Value(0)).current;
    return (
        <Animated.ScrollView
            style={{ backgroundColor: 'transparent' }}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
            )}>
            <StatusBar hidden={true}/>
            <MaskedView
                maskElement={
                    <View
                        onLayout={(ev) => setMeasures(ev.nativeEvent.layout)}
                        style={{ backgroundColor: 'transparent' }}>
                        {data.map((item) => (
                            <View
                                key={item.key}
                                style={[
                                    styles.messageItem,
                                    {
                                        backgroundColor: 'red', // Important to apply the gradient effect as a mask
                                        alignSelf: item.mine ? 'flex-end' : 'flex-start',
                                    },
                                ]}>
                                <Text style={{ opacity: 0 }}>{item.text}</Text>
                            </View>
                        ))}
                    </View>
                }>
                <View style={{ height: measures.height }}>
                    <FlatList
                        scrollEnabled={false}
                        data={data}
                        keyExtractor={(item) => item.key}
                        style={[StyleSheet.absoluteFillObject, { zIndex: 1 }]}
                        removeClippedSubviews={false}
                        renderItem={({ item }) => {
                            return (
                                <View
                                    style={[
                                        styles.messageItem,
                                        {
                                            zIndex: item.mine ? -1 : 1, // only display the other messages above the gradient mask, we want to avoid gradient being applied to the other message other than mine.
                                            backgroundColor: item.mine ? 'transparent' : '#E4E7EB', // remove the background for my messages because we're using the gradient mask
                                            alignSelf: item.mine ? 'flex-end' : 'flex-start',
                                        },
                                    ]}>
                                    <Text style={{ color: item.mine ? 'white' : '#111927' }}>
                                        {item.text}
                                    </Text>
                                </View>
                            );
                        }}
                    />
                    <AnimatedLinearGradient
                        style={{
                            height,
                            transform: [
                                {
                                    translateY: scrollY,
                                },
                            ],
                        }}
                        colors={['#FD84AA', '#A38CF9', '#09E0FF']}
                    />
                </View>
            </MaskedView>
        </Animated.ScrollView>
    );
};

const styles = StyleSheet.create({
    messageItem: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        margin: 12,
        marginBottom: 8,
        borderRadius: 12,
        maxWidth: width * 0.65,
    },
});
