// Inspiration: https://dribbble.com/shots/2136531-Day-3-Dial-Pad-Rebound

import * as React from 'react';
import { StatusBar, SafeAreaView, Platform, UIManager, Image, FlatList, Pressable, Text, View, StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import HighlightText from '@sanar/react-native-highlight-text';
import { faker } from '@faker-js/faker';
import chroma from 'chroma-js'
import { FontAwesome, Feather } from '@expo/vector-icons';
import Animated, {FadeInRight, FadeOutLeft, Layout} from 'react-native-reanimated'
import debounce from 'lodash.debounce';

const {width, height} = Dimensions.get('window');


faker.seed(4);

const colors = chroma.scale(['yellow', 'navy']).mode('lch').colors(50);

const data = colors.map((color, i) => {
    const text = chroma.contrast(color, 'white') > 4.5 ? 'white' : 'black';
    const hasAvatar = faker.datatype.boolean()
    const gender = faker.name.gender();
    const firstName = faker.name.firstName(gender);
    const lastName = faker.name.lastName(gender);
    return {
        key: faker.datatype.uuid(),
        hasAvatar,
        avatar: hasAvatar && `https://i.pravatar.cc/200?u=${faker.datatype.uuid()}`,
        firstName,
        lastName,
        phone: faker.phone.number('+1 (!##) !##-####'),
        initials: `${firstName.substring(0, 1)}${lastName.substring(0, 1)}`,
        bg: color,
        text,
    };
});


const _dialPad = ['1','2','3','4','5','6','7','8','9','', '0', 'del']
const _avatarSize = 40;
const _spacing = 10;

const DialPad = ({onPress}) => {
    return <FlatList
        data={_dialPad}
        keyExtractor={item => item}
        numColumns={3}
        style={{flexGrow: 0, alignSelf: 'center'}}
        renderItem={({item}) => {
            return <Pressable onPress={() => onPress(item)} style={{width: width * .3, height: width * .3, alignItems: 'center', justifyContent: 'center', shadowColor: '#fff', shadowOffset: {width: 0, height: 0}, shadowOpacity: 1, shadowRadius: 20}}>
                {item === 'del' ? <Feather name="delete" size={28} color="#fff" /> : <Text style={{fontSize: 42, fontWeight: '200', color: '#fff'}}>{item}</Text>}
            </Pressable>
        }}
    />
}

export default function App() {
    const _initialData = React.useMemo(() => data, []);
    const [filteredData, setFilteredData] = React.useState([]);
    const [filterText, setFilterText] = React.useState('');
    const ref = React.useRef();

    const setFilterTextDebounced = debounce(v => {
        if (v === '') {
            setFilteredData([]);
            return;
        }
        const filteredData = _initialData.filter(
            d => d.phone.indexOf(v) !== -1,
        );

        ref.current?.scrollToOffset({
            offset: 0,
            animated: true
        })

        setFilteredData(filteredData.sort((a, b) => b.initials - a.initials > 0 ? -1 : 1).slice(0, 10));
    }, 500);

    React.useEffect(() => {
        setFilterTextDebounced(filterText)
    }, [filterText])

    console.log(ref.current)


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar hidden/>
            <Animated.FlatList
                ref={ref}
                data={filteredData}
                style={{flexGrow: 0, height: width * .2}}
                itemLayoutAnimation={Layout}
                layout={Layout}
                contentContainerStyle={{paddingHorizontal: _spacing}}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.key}
                horizontal
                renderItem={({item}) => {
                    return <Animated.View
                        layout={Layout}
                        entering={FadeInRight}
                        exiting={FadeOutLeft}
                        style={{flexDirection: 'row', marginRight: _spacing, paddingVertical: _spacing * 2, paddingHorizontal: _spacing, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, alignItems: 'center', width: width * .6, height: width * .2,}}>
                        {item.hasAvatar ? (
                            <Image
                                source={{ uri: item.avatar }}
                                style={{ width: _avatarSize, height: _avatarSize, borderRadius: _avatarSize }}
                            />
                        ) : (
                            <View
                                style={{ width: _avatarSize, height: _avatarSize, borderRadius: _avatarSize, backgroundColor: item.bg, alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text
                                    style={{
                                        color: item.text,
                                        fontSize: _avatarSize / 2,
                                        fontWeight: 'bold',
                                        opacity: 0.5,
                                    }}
                                    numberOfLines={1}
                                    adjustsFontSizeToFit>
                                    {item.initials}
                                </Text>
                            </View>
                        )}
                        <View style={{marginLeft: _spacing}}>
                            <Text style={{fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: _spacing / 2}}>{item.lastName} {item.firstName}</Text>
                            <HighlightText
                                highlightStyle={{ color: '#0BDC1F'}}
                                searchWords={[filterText]}
                                style={{color: 'rgba(255,255,255,0.6)', fontWeight: '600'}}
                                textToHighlight={item.phone}
                            />
                        </View>
                    </Animated.View>
                }}
            />
            <View style={{flex: 1, justifyContent: 'space-evenly', alignItems: 'center'}}>
                <Text style={{fontSize: 48, fontWeight: '300', color: '#fff'}}>{filterText || ' '}</Text>
                <DialPad onPress={(value) => {

                    if (value === 'del') {
                        if (filterText === '') {
                            return
                        }

                        setFilterText(filterText.substr(0, filterText.length - 1))
                    } else {
                        setFilterText(`${filterText}${value}`)
                    }
                }}/>
                <FontAwesome name="phone" size={48} color="#0BDC1F" style={{shadowColor: '#0BDC1F', shadowOffset: {width: 0, height: 0}, shadowOpacity: 1, shadowRadius: 30, elevation: 10}}/>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#333',
        padding: _spacing,
    }
});
