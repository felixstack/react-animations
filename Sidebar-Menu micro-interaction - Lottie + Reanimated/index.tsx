import * as React from 'react';
import {
    StatusBar,
    SafeAreaView,
    Pressable,
    Text,
    View,
    StyleSheet,
    LayoutRectangle,
} from 'react-native';
import Constants from 'expo-constants';
import Animated, {
    Easing,
    useAnimatedProps,
    Layout,
    FadeIn,
    FadeOut,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    useAnimatedReaction,
    SharedValue,
    interpolate,
    interpolateColor
} from 'react-native-reanimated';

import LottieView from 'lottie-react-native';
const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const _menu = [
    'Dashboard',
    'Chat',
    'Projects',
    'Tasks',
    'Notifications',
    'Team',
    'Settings',
] as const;

type Menu = typeof _menu[number];

// By far the biggest challenge was to get all the sources, color filters and the animation from -> to
const _icons: {[key in Menu]: {source: string, from: number, to: number, colorFilters: string[]}} = {
    'Dashboard': {
        source: require('./icons/dashboard.json'),
        from: 0.5,
        to: 1,
        colorFilters: ['hover-category', 'in-category']
    },
    'Chat': {
        source: require('./icons/chat.json'),
        from: .5,
        to: 1,
        colorFilters: ['in-chat', 'hover-chat']
    },
    'Projects': {
        source: require('./icons/projects.json'),
        from: .66,
        to: 1,
        colorFilters: ['in-folder', 'hover-folder', 'morph-folder']
    },
    'Tasks': {
        source: require('./icons/tasks.json'),
        from: .2,
        to: .4,
        colorFilters: ['in-check', 'hover-check']
    },
    'Notifications': {
        source: require('./icons/notifications.json'),
        from: .33,
        to: .66,
        colorFilters: ['in-bell', 'hover-bell']
    },
    'Team': {
        source: require('./icons/team.json'),
        from: .5,
        to: 1,
        colorFilters: ['in-assignment', 'hover-assignment']
    },
    'Settings': {
        source: require('./icons/settings.json'),
        from: .25,
        to: .5,
        colorFilters: ['in-cog', 'hover-cog-1', 'hover-cog-2']
    },
};

type MenuLayout = {
    [key in Menu]?: LayoutRectangle;
};
const _spacing = 12;
const _iconSize = 36;
const _colors = {
    active: '#4AA0FE',
    regular: '#A0A0A4'
}

const MenuItem = ({ text, active, animValue }: {text: Menu, active: boolean, animValue: SharedValue<number>}) => {
    const anim = useSharedValue(0);
    const iconAnim = useSharedValue(0);

    useAnimatedReaction(() => {
        return animValue.value
    }, (v) => {
        console.log(v)
        iconAnim.value = 0;
        if (active) {
            anim.value = withTiming(1, {duration: 300})
            iconAnim.value = withTiming(1, {easing: Easing.linear, duration: 800})
        } else {
            anim.value = withTiming(0, {duration: 300})
            iconAnim.value = withTiming(0, {easing: Easing.linear, duration: 800})
        }
    })

    // You can use this instead of Layout Animation for adding more types of animations.
    // Just don't forget to uncomment the stylez part from the render :-)
    // const stylez = useAnimatedStyle(() => {
    //   return {
    //     color: interpolateColor(anim.value, [0, 1], [_colors.regular, _colors.active])
    //   }
    // })

    const animatedProps = useAnimatedProps(() => {
        return {
            progress: interpolate(iconAnim.value, [0, 1], [_icons[text].from, _icons[text].to])
        }
    })

    const colorFilters = React.useMemo(() => {
        return _icons[text].colorFilters.map(filter => ({
            keypath: filter,
            color: active ? _colors.active : _colors.regular
        }))
    }, [active, text])


    return (
        <Animated.View key={text}
                       layout={Layout}
                       style={{flexDirection: 'row', alignItems: 'center'}}
        >
            <AnimatedLottieView
                source={_icons[text].source}
                autoPlay={false}
                loop={false}
                animatedProps={animatedProps}
                colorFilters={colorFilters}
                style={{width: _iconSize, height: _iconSize, marginRight: _spacing}}

            />
            <Animated.Text
                layout={Layout.duration(100)}
                entering={FadeIn}
                exiting={FadeOut}
                key={`menu_item_${active ? 'active' : ''}`}
                style={[
                    styles.menuItemText,
                    {
                        color: active ? _colors.active : _colors.regular
                    },
                    // stylez
                ]}>
                {text}
            </Animated.Text>
        </Animated.View>
    );
};

export default function App() {
    const _menuLayout = React.useRef<MenuLayout>({});
    const [isVisible, setIsVisible] = React.useState(false);
    const [activeMenuItem, setActiveMenuItem] = React.useState<Menu>('Dashboard');
    const activeIndexAnim = useSharedValue(0);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar hidden/>
            <View style={{marginBottom: _spacing * 2}}>
                <Text style={{fontSize: 32, fontWeight: '700'}}>learning by doing.</Text>
                <Text style={{color: _colors.regular, marginBottom: _spacing * 2}}>@mironcatalin</Text>
            </View>
            <View style={{flex: 1}}>
                {isVisible && (
                    <Animated.View
                        layout={Layout}
                        style={{
                            width: _menuLayout.current[activeMenuItem]?.width,
                            height: _menuLayout.current[activeMenuItem]?.height,
                            left: _menuLayout.current[activeMenuItem]?.x,
                            top: _menuLayout.current[activeMenuItem]?.y,
                            borderRadius: _spacing,
                            backgroundColor: '#F9F8FD',
                            position: 'absolute',
                        }}
                    />
                )}
                {_menu.map((menuItem) => {
                    // JavaScript ensures the order, anyway...
                    const actualIndex = _menu.indexOf(menuItem);
                    return (
                        <Pressable
                            onPress={() => {
                                setActiveMenuItem(menuItem);
                                activeIndexAnim.value = actualIndex;
                            }}
                            onLayout={(ev) => {
                                _menuLayout.current[menuItem] = {
                                    ...ev.nativeEvent.layout,
                                };

                                if (
                                    Object.keys(_menuLayout.current).length === _menu.length &&
                                    !isVisible
                                ) {
                                    setIsVisible(true);
                                }
                            }}
                            style={styles.menuItem}>
                            <MenuItem index={actualIndex} active={activeMenuItem === menuItem} animValue={activeIndexAnim} text={menuItem} />
                        </Pressable>
                    );
                })}
            </View>
            <View>
                <Text style={{fontSize: 12, color: _colors.regular, marginBottom: _spacing * 2}}>Lottie icons by <Text style={{fontWeight: '700'}}>lordicon.com</Text></Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        backgroundColor: '#fff',
        margin: _spacing * 1.6
    },
    menuItem: {
        paddingHorizontal: _spacing,
        paddingVertical: _spacing * 1.5,
        marginBottom: 0,
    },
    menuItemText: {
        // fontFamily: 'Menlo'
        fontSize: 18,
    },
});
