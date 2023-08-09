import * as React from 'react';
import { Image, Animated, Text, View, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('screen');
import { Entypo } from '@expo/vector-icons';
import Constants from 'expo-constants';

const articleParagraphs = [
    'One advanced diverted domestic sex repeated bringing you old. Possible procured her trifling laughter thoughts property she met way. Companions shy had solicitude favourable own. Which could saw guest man now heard but. Lasted my coming uneasy marked so should. Gravity letters it amongst herself dearest an windows by. Wooded ladies she basket season age her uneasy saw. Discourse unwilling am no described dejection incommode no listening of. Before nature his parish boy. ',
    'Folly words widow one downs few age every seven. If miss part by fact he park just shew. Discovered had get considered projection who favourable. Necessary up knowledge it tolerably. Unwilling departure education is be dashwoods or an. Use off agreeable law unwilling sir deficient curiosity instantly. Easy mind life fact with see has bore ten. Parish any chatty can elinor direct for former. Up as meant widow equal an share least. ',
    'Another journey chamber way yet females man. Way extensive and dejection get delivered deficient sincerity gentleman age. Too end instrument possession contrasted motionless. Calling offence six joy feeling. Coming merits and was talent enough far. Sir joy northward sportsmen education. Discovery incommode earnestly no he commanded if. Put still any about manor heard. ',
    'Village did removed enjoyed explain nor ham saw calling talking. Securing as informed declared or margaret. Joy horrible moreover man feelings own shy. Request norland neither mistake for yet. Between the for morning assured country believe. On even feet time have an no at. Relation so in confined smallest children unpacked delicate. Why sir end believe uncivil respect. Always get adieus nature day course for common. My little garret repair to desire he esteem. ',
    'In it except to so temper mutual tastes mother. Interested cultivated its continuing now yet are. Out interested acceptance our partiality affronting unpleasant why add. Esteem garden men yet shy course. Consulted up my tolerably sometimes perpetual oh. Expression acceptance imprudence particular had eat unsatiable. ',
    'Had denoting properly jointure you occasion directly raillery. In said to of poor full be post face snug. Introduced imprudence see say unpleasing devonshire acceptance son. Exeter longer wisdom gay nor design age. Am weather to entered norland no in showing service. Nor repeated speaking shy appetite. Excited it hastily an pasture it observe. Snug hand how dare here too. ',
    'Improve ashamed married expense bed her comfort pursuit mrs. Four time took ye your as fail lady. Up greatest am exertion or marianne. Shy occasional terminated insensible and inhabiting gay. So know do fond to half on. Now who promise was justice new winding. In finished on he speaking suitable advanced if. Boy happiness sportsmen say prevailed offending concealed nor was provision. Provided so as doubtful on striking required. Waiting we to compass assured. ',
    'You disposal strongly quitting his endeavor two settling him. Manners ham him hearted hundred expense. Get open game him what hour more part. Adapted as smiling of females oh me journey exposed concern. Met come add cold calm rose mile what. Tiled manor court at built by place fanny. Discretion at be an so decisively especially. Exeter itself object matter if on mr in. ',
    'Effect if in up no depend seemed. Ecstatic elegance gay but disposed. We me rent been part what. An concluded sportsman offending so provision mr education. Bed uncommonly his discovered for estimating far. Equally he minutes my hastily. Up hung mr we give rest half. Painful so he an comfort is manners. ',
    'Article nor prepare chicken you him now. Shy merits say advice ten before lovers innate add. She cordially behaviour can attempted estimable. Trees delay fancy noise manor do as an small. Felicity now law securing breeding likewise extended and. Roused either who favour why ham. ',
    'One advanced diverted domestic sex repeated bringing you old. Possible procured her trifling laughter thoughts property she met way. Companions shy had solicitude favourable own. Which could saw guest man now heard but. Lasted my coming uneasy marked so should. Gravity letters it amongst herself dearest an windows by. Wooded ladies she basket season age her uneasy saw. Discourse unwilling am no described dejection incommode no listening of. Before nature his parish boy. ',
    'Folly words widow one downs few age every seven. If miss part by fact he park just shew. Discovered had get considered projection who favourable. Necessary up knowledge it tolerably. Unwilling departure education is be dashwoods or an. Use off agreeable law unwilling sir deficient curiosity instantly. Easy mind life fact with see has bore ten. Parish any chatty can elinor direct for former. Up as meant widow equal an share least. ',
    'Another journey chamber way yet females man. Way extensive and dejection get delivered deficient sincerity gentleman age. Too end instrument possession contrasted motionless. Calling offence six joy feeling. Coming merits and was talent enough far. Sir joy northward sportsmen education. Discovery incommode earnestly no he commanded if. Put still any about manor heard. ',
    'Village did removed enjoyed explain nor ham saw calling talking. Securing as informed declared or margaret. Joy horrible moreover man feelings own shy. Request norland neither mistake for yet. Between the for morning assured country believe. On even feet time have an no at. Relation so in confined smallest children unpacked delicate. Why sir end believe uncivil respect. Always get adieus nature day course for common. My little garret repair to desire he esteem. ',
    'In it except to so temper mutual tastes mother. Interested cultivated its continuing now yet are. Out interested acceptance our partiality affronting unpleasant why add. Esteem garden men yet shy course. Consulted up my tolerably sometimes perpetual oh. Expression acceptance imprudence particular had eat unsatiable. ',
    'Had denoting properly jointure you occasion directly raillery. In said to of poor full be post face snug. Introduced imprudence see say unpleasing devonshire acceptance son. Exeter longer wisdom gay nor design age. Am weather to entered norland no in showing service. Nor repeated speaking shy appetite. Excited it hastily an pasture it observe. Snug hand how dare here too. ',
    'Improve ashamed married expense bed her comfort pursuit mrs. Four time took ye your as fail lady. Up greatest am exertion or marianne. Shy occasional terminated insensible and inhabiting gay. So know do fond to half on. Now who promise was justice new winding. In finished on he speaking suitable advanced if. Boy happiness sportsmen say prevailed offending concealed nor was provision. Provided so as doubtful on striking required. Waiting we to compass assured. ',
    'You disposal strongly quitting his endeavor two settling him. Manners ham him hearted hundred expense. Get open game him what hour more part. Adapted as smiling of females oh me journey exposed concern. Met come add cold calm rose mile what. Tiled manor court at built by place fanny. Discretion at be an so decisively especially. Exeter itself object matter if on mr in. ',
    'Effect if in up no depend seemed. Ecstatic elegance gay but disposed. We me rent been part what. An concluded sportsman offending so provision mr education. Bed uncommonly his discovered for estimating far. Equally he minutes my hastily. Up hung mr we give rest half. Painful so he an comfort is manners. ',
    'Article nor prepare chicken you him now. Shy merits say advice ten before lovers innate add. She cordially behaviour can attempted estimable. Trees delay fancy noise manor do as an small. Felicity now law securing breeding likewise extended and. Roused either who favour why ham. ',
];

export default () => {
    const [actionLayout, setActionLayout] = React.useState(null);
    const scrollY = React.useRef(new Animated.Value(0)).current;

    const topEdge = actionLayout?.y - height + actionLayout?.height + Constants.statusBarHeight;
    const inputRange = [-1, 0, topEdge - 60, topEdge, topEdge + 1];

    return (
        <SafeAreaView>
            <Animated.ScrollView
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                    useNativeDriver: true,
                })}
                style={{ flexGrow: 0 }}
                contentContainerStyle={{ padding: 20 }}
            >
                <Text style={styles.heading}>Black & White article</Text>
                {articleParagraphs.map((text, index) => {
                    return (
                        <View key={`block-${index}`}>
                            {index % 3 === 1 && (
                                <Image
                                    source={{
                                        uri: `https://source.unsplash.com/600x${400 + index}/?blackandwhite`,
                                    }}
                                    style={styles.image}
                                />
                            )}
                            <Text style={styles.paragraph}>{text}</Text>
                        </View>
                    );
                })}
                <View
                    style={[styles.bottomActions]}
                    onLayout={(ev) => {
                        setActionLayout(ev.nativeEvent.layout);
                    }}
                />
                <View style={{ borderTopColor: '#333', borderTopWidth: 1, marginTop: 20 }}>
                    <Text style={styles.featuredTitle}>Featured articles</Text>
                    {articleParagraphs.slice(3, 9).map((text, index) => {
                        return (
                            <View key={`featured-${index}`} style={{ flexDirection: 'row', flex: 1, marginBottom: 10 }}>
                                <Image
                                    source={{
                                        uri: `https://source.unsplash.com/100x${100 + index}/?blackandwhite`,
                                    }}
                                    style={styles.featuredImage}
                                />
                                <Text style={styles.paragraph} numberOfLines={2}>
                                    {text}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </Animated.ScrollView>
            {actionLayout && (
                <Animated.View
                    style={[
                        styles.bottomActions,
                        {
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            paddingHorizontal: 20,
                            transform: [
                                {
                                    translateY: scrollY.interpolate({
                                        inputRange,
                                        outputRange: [0, 0, 0, 0, -1],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <View style={{ flexDirection: 'row', height: 60, alignItems: 'center', justifyContent: 'center' }}>
                        <Entypo name='adjust' size={24} color='black' style={{ marginHorizontal: 10 }} />
                        <Animated.Text
                            style={{
                                opacity: scrollY.interpolate({
                                    inputRange,
                                    outputRange: [0, 0, 0, 1, 1],
                                }),
                            }}
                        >
                            123
                        </Animated.Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Animated.View
                            style={[
                                styles.icon,
                                {
                                    opacity: scrollY.interpolate({
                                        inputRange,
                                        outputRange: [0, 0, 0, 1, 1],
                                    }),
                                },
                            ]}
                        >
                            <Entypo name='export' size={24} color='black' />
                        </Animated.View>
                        <Animated.View
                            style={[
                                styles.icon,
                                {
                                    transform: [
                                        {
                                            translateX: scrollY.interpolate({
                                                inputRange,
                                                outputRange: [60, 60, 60, 0, 0],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <Entypo name='credit' size={24} color='green' />
                        </Animated.View>
                        <Animated.View
                            style={[
                                styles.icon,
                                {
                                    opacity: scrollY.interpolate({
                                        inputRange,
                                        outputRange: [0, 0, 0, 1, 1],
                                    }),
                                },
                            ]}
                        >
                            <Entypo name='share-alternative' size={24} color='black' />
                        </Animated.View>
                    </View>
                </Animated.View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    featuredImage: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
        marginRight: 20,
        borderRadius: 10,
    },
    bottomActions: {
        height: 80,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    image: { width: '100%', height: height * 0.4, resizeMode: 'cover', marginBottom: 20 },
    featuredTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginVertical: 20,
    },
    heading: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 30,
    },
    paragraph: {
        flex: 1,
        marginBottom: 10,
        // fontFamily: 'Georgia'
        fontSize: 14,
        lineHeight: 16 * 1.5,
    },
    icon: {
        height: 60,
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
