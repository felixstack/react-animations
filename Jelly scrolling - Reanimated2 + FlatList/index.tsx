// Icon: https://www.flaticon.com/free-icon/joystick_3142027?term=controller&related_id=3142027
// Inspiration: https://dribbble.com/shots/5199881-Recipe-app-Concept
import * as React from 'react';
import { FlatList, Text, Dimensions } from 'react-native';

import { faker } from '@faker-js/faker';
import Animated, {
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withDecay,
} from 'react-native-reanimated';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

faker.seed(10);

const { width, height } = Dimensions.get('screen');
const data = [...Array(40).keys()].map((i) => ({
    key: faker.random.uuid(),
    color: faker.internet.color(),
    title: faker.company.companyName(),
    description: faker.company.catchPhrase(),
}));
const spacing = 20;

const Item = ({ item, velocity }) => {
    const stylez = useAnimatedStyle(() => {
        const degrees = 8;
        return {
            transform: [
                {
                    skewY: interpolate(
                        velocity.value,
                        [-5, 0, 5],
                        [(degrees * Math.PI) / 180, 0, (-degrees * Math.PI) / 180]
                    ),
                },
            ],
        };
    });
    return (
        <Animated.View
            style={[
                { alignItems: 'center', justifyContent: 'center', backgroundColor: item.color, height: height / 5 },
                stylez,
            ]}
        >
            <Text
                style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 24,
                    fontWeight: '900',
                    fontFamily: 'American Typewriter',
                    marginBottom: spacing / 2,
                }}
            >
                {item.title}
            </Text>
            <Text style={{ opacity: 0.8, fontFamily: 'Apple SD Gothic Neo', color: 'white' }}>{item.description}</Text>
        </Animated.View>
    );
};
export default function JellyScroll() {
    const velocity = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler((event, ctx = { y: 0, time: Date.now() }) => {
        const now = Date.now();
        const { y } = event.contentOffset;
        const dt = now - ctx.time;
        const dy = y - ctx.y;
        const xxx = withDecay({
            velocity: dy / dt,
        });
        velocity.value = xxx.velocity;
        // reset time and y position
        ctx.time = now;
        ctx.y = y;
    });
    return (
        <AnimatedFlatList
            data={data}
            keyExtractor={(item) => item.key}
            style={{ backgroundColor: '#000' }}
            onScroll={onScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => {
                return <Item item={item} velocity={velocity} />;
            }}
        />
    );
}
