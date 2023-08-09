import * as React from 'react';
import { Switch, Image, View, Text, Dimensions, StyleSheet, Pressable, Button, SafeAreaView } from 'react-native';

import { AnimatePresence, View as MView, Text as MText, motify } from 'moti';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('screen');

const colors = [
    {bg: '#e4ff1a', textColor: '#03045e', statusBar: 'dark'},
    {bg: '#00296b', textColor: '#ffd500', statusBar: 'light'},
    {bg: '#80ffdb', textColor: '#7400b8', statusBar: 'dark'},
    {bg: '#7400b8', textColor: '#80ffdb', statusBar: 'light'},
    {bg: '#3a0ca3', textColor: '#f72585', statusBar: 'light'},
    {bg: '#3a0ca3', textColor: '#4cc9f0', statusBar: 'light'},
    {bg: '#e63946', textColor: '#f1faee', statusBar: 'light'},
    {bg: '#03045e', textColor: '#caf0f8', statusBar: 'light'},
    {bg: '#6b705c', textColor: '#ffe8d6', statusBar: 'light'},
    {bg: '#264653', textColor: '#f4a261', statusBar: 'light'},
    {bg: '#fdfdfd', textColor: '#000000', statusBar: 'dark'},
    {bg: '#FF4C1E', textColor: '#ffffff', statusBar: 'light'},
    {bg: '#222222', textColor: '#ffffff', statusBar: 'light'},
    {bg: '#228B22', textColor: '#ffffff', statusBar: 'light'},
    {bg: '#BD97CB', textColor: '#000000', statusBar: 'dark'},
]
const SPACING = 20;
function usePrevious(value) {
    const ref = React.useRef();
    React.useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}
export default function ColorSwitch() {
    const [currentBg, setCurrentBg] = React.useState(colors[0])
    const oldColor = usePrevious(currentBg);
    const from= oldColor?.current?.textColor;
    const to= currentBg.textColor
    return <SafeAreaView style={{flex: 1}}>
        <StatusBar animated style={currentBg.statusBar}/>
        <AnimatePresence presenceAffectsLayout>
            <MView
                key={currentBg.bg}
                from={{
                    opacity: 1,
                    scale: 0
                }}
                animate={{
                    opacity: 1,
                    scale: 12,
                }}
                exit={{scale: 12}}
                transition={{
                    // repeatReverse: false,
                    // loop: true,
                    duration: 500,
                    type: 'timing'
                }}
                style={{
                    backgroundColor: currentBg.bg,
                    width: 100,
                    height: 100,
                    borderRadius: 100,
                    position: 'absolute',
                    top: height / 2 - 50,
                    left: width - 50
                }}
            />
        </AnimatePresence>
        <View style={{flex: 1, padding: SPACING}}>
            <View style={{marginBottom: SPACING * 3}}>
                <MyText from={from} to={to} style={{fontSize: 18}}>
                    Add task
                </MyText>
            </View>
            <MyText from={from} to={to} style={{fontSize: 28, fontWeight: '800', marginBottom: SPACING * 6}}>
                Setup a meeting {'\n'}with Catalin
            </MyText>
            <View style={{flexDirection: 'row', marginBottom: SPACING}}>
                {['AA', 'KG', 'TI', '+'].map(name => {
                    return <Pill
                        key={name}
                        from={from}
                        to={to}
                        label={name}
                        isIcon={name === '+'}
                    />
                })}
            </View>
            <Separator from={from} to={to}/>
            <MyText from={from} to={to} style={{marginBottom: SPACING, fontWeight: '700'}}>
                Location
            </MyText>
            <MyText from={from} to={to} style={{opacity: .7}}>
                localhost:3000
            </MyText>
            <Separator from={from} to={to}/>
            <MyText from={from} to={to} style={{marginBottom: SPACING, fontWeight: '700'}}>
                Due date
            </MyText>
            <MyText from={from} to={to} style={{opacity: .7}}>
                25 / 12 / 2021
            </MyText>
            <Separator from={from} to={to}/>
        </View>
        <Pressable
            style={{position: 'absolute', bottom: 50, height: 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}
            onPress={() => {
                const newColors = colors.filter(color => color.bg !== currentBg.bg);
                const newColor = newColors[Math.floor(Math.random() * newColors.length)]
                setCurrentBg(newColor)
            }}>
            <MyText from={from} to={to}>Random Color</MyText>
            <MyText from={from} to={to} style={{fontFamily: 'Menlo', opacity: .6}}>Built with <MyText from={from} to={to} style={{fontWeight:'900'}}>Moti</MyText> by <MyText style={{fontWeight:'900'}} from={from} to={to}>@mironcatalin</MyText></MyText>
        </Pressable>
    </SafeAreaView>
}

const Separator = ({from, to, style}) => {
    return <MView
        style={[style, {height: 1, marginVertical: SPACING}]}
        from={{
            backgroundColor: `${from || '#000000'}99`,
        }}
        animate={{
            backgroundColor: `${to}99`,
        }}
        transition={{
            delay: 0,
            type: 'timing',
            duration: 350
        }}
    />
}
const Pill = ({from, to, label, style, isIcon}) => {
    return <MView
        from={{
            backgroundColor: isIcon ? '#ffffff00' : `${from || '#000000'}22`,
            borderColor: !isIcon ? '#ffffff00' : `${from || '#000000'}33`,
        }}
        animate={{
            backgroundColor: isIcon ? '#ffffff00' : `${to}22`,
            borderColor: !isIcon ? '#ffffff00' : `${to}33`
        }}
        transition={{
            delay: 0,
            type: 'timing',
            duration: 350
        }}
        style={{
            width: 40,
            height: 40,
            borderRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            marginRight: SPACING / 4
        }}>
        <MyText
            from={from}
            to={to}
            style={[isIcon ? {fontSize: 24} : {fontWeight: '700'}]}
        >{label}</MyText>
    </MView>
}
const MyText = ({children, from, to, style}) => (
    <MText
        from={{color: from || '#000'}}
        animate={{color: to}}
        style={[style, {fontFamily: 'Menlo'}]}
        transition={{
            delay: 0,
            type: 'timing',
            duration: 350
        }}
    >{children}</MText>
)