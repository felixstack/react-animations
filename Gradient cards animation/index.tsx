// Inspiration: https://dribbble.com/shots/13267613-Payments-Card-Animation
import { StatusBar } from 'expo-status-bar';
import { faker } from '@faker-js/faker';
import { AnimatePresence, Image as MImage, View as MView } from 'moti';
import * as React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { Easing } from 'react-native-reanimated';

const { width, height } = Dimensions.get('screen');
// `https://images.pexels.com/photos/310452/pexels-photo-310452.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350&w=660`,
// `https://images.pexels.com/photos/3109807/pexels-photo-3109807.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350&w=660`,
const images = [
    `https://images.pexels.com/photos/2887710/pexels-photo-2887710.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=350&w=660`,
    `https://images.pexels.com/photos/1561020/pexels-photo-1561020.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350&w=660`,
    `https://images.pexels.com/photos/1212407/pexels-photo-1212407.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350&w=660`,
    `https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350&w=660`,
];

const cardType = [
    'https://img-premium.flaticon.com/png/512/179/179457.png?token=exp=1620036375~hmac=055dff03ba131ec3c2025a6f710b03d1',
    'https://img-premium.flaticon.com/png/512/179/179449.png?token=exp=1620036397~hmac=6b9f6e3d0f2b1a07307261cf7be159a4',
];

const cards = images.map((image) => ({
    amount: faker.finance.amount(50, 9999, faker.random.number(2), '$'),
    bg: image,
    cardType: faker.helpers.randomize(cardType),
    type: faker.helpers.randomize(['gold', 'silver', 'platinum']),
    key: faker.random.uuid(),
    cc: faker.finance.mask(4),
}));

const _width = width * 0.9;
const _height = _width * 0.6;
export default function ColorfulCard() {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const selectedCard = React.useMemo(() => {
        return cards[activeIndex];
    }, [activeIndex]);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View
                style={{
                    width: _width,
                    height: _height,
                    overflow: 'hidden',
                    borderRadius: 20,
                    padding: 10,
                    justifyContent: 'center',
                }}>
                <AnimatePresence>
                    <MView
                        from={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 2 }}
                        transition={{ duration: 1000, type: 'timing' }}
                        key={selectedCard.key}>
                        <MImage
                            source={{ uri: selectedCard.bg }}
                            from={{
                                transform: [{ rotate: '0deg' }, { scale: 1.8 }],
                            }}
                            animate={{
                                transform: [
                                    { rotate: '360deg' },
                                    {
                                        scale: 3,
                                    },
                                ],
                            }}
                            transition={{
                                loop: true,
                                type: 'timing',
                                duration: 8000,
                                easing: Easing.linear,
                            }}
                            blurRadius={60}
                            style={{
                                width: _width * 1.5,
                                height: _height * 1.5,
                                resizeMode: 'cover',
                                position: 'absolute',
                                alignSelf: 'center',
                            }}
                        />
                    </MView>
                </AnimatePresence>
                <View style={{ flex: 1, padding: 10 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                        <Text style={{ color: 'white', fontFamily: 'Menlo', fontSize: 18 }}>
                            **** **** **** {selectedCard.cc}
                        </Text>
                        <MImage
                            source={{ uri: selectedCard.cardType }}
                            style={{
                                width: 40,
                                height: 40,
                                resizeMode: 'contain',
                            }}
                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ color: 'white' }}>Balance</Text>
                        <Text style={{ color: 'white', fontSize: 32, fontWeight: '600' }}>
                            {selectedCard.amount}
                        </Text>
                    </View>
                    <Text
                        style={{
                            color: 'white',
                            textTransform: 'uppercase',
                            fontWeight: '900',
                            opacity: 0.6,
                            marginTop: 20,
                        }}>
                        {selectedCard.type}
                    </Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 20 }}>
                {cards.map((card, index) => {
                    return (
                        <TouchableOpacity
                            key={card.key}
                            onPress={() => {
                                setActiveIndex(index);
                            }}>
                            <MImage
                                source={{ uri: card.bg }}
                                from={{ borderColor: 'rgba(0,0,0,0)' }}
                                animate={{
                                    borderColor:
                                        activeIndex === index ? 'rgba(0,0,0,.5)' : 'rgba(0,0,0,0)',
                                }}
                                style={{
                                    marginRight: 10,
                                    width: 50,
                                    height: 50,
                                    resizeMode: 'cover',
                                    borderRadius: 25,
                                    borderWidth: 2,
                                    borderColor: 'transparent',
                                }}
                                transition={{ type: 'timing', duration: 400 }}
                                blurRadius={20}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
            <StatusBar hidden />
        </View>
    );
}
