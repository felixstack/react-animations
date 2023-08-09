// Inspiration: https://dribbble.com/shots/2136531-Day-3-Dial-Pad-Rebound
import * as React from 'react';
import {SafeAreaView, Image, Button, StatusBar, StyleSheet, Text, View, ViewStyle } from 'react-native';

import Animated, {
    BaseAnimationBuilder,
    ComplexAnimationBuilder,
    EntryExitAnimationFunction,
    FadeInDown,
    FadeOutDown,
    Keyframe,
    Layout,
    ZoomInEasyDown
} from 'react-native-reanimated';
import {TextInput} from 'react-native-paper'

type StaggerProps = React.PropsWithChildren<{
    stagger?: number;
    /**
     * The direction of the enter animation.
     *
     * -1 means the animation will start from the last child and go to the first child.
     *
     * 1 means the animation will start from the first child and go to the last child.
     */
    enterDirection?: -1 | 1;
    /**
     * The direction of the exit animation.
     *
     * -1 means the animation will start from the last child and go to the first child.
     *
     * 1 means the animation will start from the first child and go to the last child.
     */
    exitDirection?: -1 | 1;
    duration?: number;
    style?: ViewStyle;
    /**
     * Return the desired animation builder. It can be any of
     * https://www.reanimated2.com/docs/api/LayoutAnimations/entryAnimations.
     *
     * Custom animation: https://www.reanimated2.com/docs/api/LayoutAnimations/customAnimations.
     *
     * Keyframes animations: https://www.reanimated2.com/docs/api/LayoutAnimations/keyframeAnimations
     *
     */
    entering?: () =>
        | BaseAnimationBuilder
        | typeof BaseAnimationBuilder
        | EntryExitAnimationFunction
        | Keyframe
        | ComplexAnimationBuilder;
    /**
     * Return the desired animation builder. It can be any of
     * https://www.reanimated2.com/docs/api/LayoutAnimations/exitAnimations.
     *
     * Custom animation: https://www.reanimated2.com/docs/api/LayoutAnimations/customAnimations.
     *
     * Keyframes animations: https://www.reanimated2.com/docs/api/LayoutAnimations/keyframeAnimations
     *
     */
    exiting?: () =>
        | BaseAnimationBuilder
        | typeof BaseAnimationBuilder
        | EntryExitAnimationFunction
        | Keyframe
        | ComplexAnimationBuilder;

    initialEnteringDelay?: number;
    initialExitingDelay?: number;
}>;
function Stagger({
                     children,
                     stagger,
                     enterDirection = 1,
                     exitDirection = -1,
                     duration = 400,
                     style,
                     entering = () => FadeInDown,
                     exiting = () => FadeOutDown,
                     initialEnteringDelay = 0,
                     initialExitingDelay = 0
                 }: StaggerProps) {
    const s = React.useMemo(() => {
        return stagger ?? 50;
    }, [stagger]);
    if (!children) {
        return null;
    }

    return (
        <Animated.View style={style} layout={Layout}>
            {React.Children.map(children, (child: JSX.Element, index) => {
                // console.log(React.Children.only(React.Children.toArray(child)[0]));
                // if (child.type === Stagger) {
                // if (index === 0) {
                //   console.log(child._owner.child.type);
                //   // console.log(child.props.children[0].type);
                //   // console.log(child._owner);
                // }
                // console.log(child.props);
                return (
                    <Animated.View
                        key={child?.key ?? index}
                        layout={Layout}
                        entering={(entering() as ComplexAnimationBuilder)
                            .delay(
                                initialEnteringDelay +
                                (enterDirection === 1 ? index * s : (React.Children.count(children) - index) * s),
                            )
                            .duration(duration ?? 1000)}
                        exiting={(exiting() as ComplexAnimationBuilder)
                            .delay(
                                initialExitingDelay +
                                (exitDirection === 1 ? index * s : (React.Children.count(children) - index) * s),
                            )
                            .duration(duration)}
                    >
                        {/* {React.cloneElement<StaggerProps>(child, {
              ...child.props,
              initialEnteringDelay: initialEnteringDelay ? initialEnteringDelay + s : index * s,
              initialExitingDelay: initialExitingDelay ? initialExitingDelay + s : index * s,
              xxx: child?.type === Stagger ? true : xxx,
            })} */}
                        {child}
                    </Animated.View>
                );
            })}
        </Animated.View>
    );
}

export default function App() {
    const [items, setItems] = React.useState([...Array(9).keys()]);
    const [show, setShow] = React.useState(false);
    const colors = ['#333', 'salmon', 'turquoise', 'darksalmon'];
    return (
        <SafeAreaView
            style={{ backgroundColor: '#fff', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 12 }}
        >
            <StatusBar hidden />
            <View
                style={{
                    position: 'absolute',
                    bottom: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    zIndex: 99,
                }}
            >
                <Button
                    title='Add'
                    onPress={() => {
                        setItems((items) => [...items, Math.random()]);
                    }}
                />
                <Button
                    title={`Show: ${show.toString()}`}
                    onPress={() => {
                        setShow((show) => !show);
                    }}
                />
                <Button
                    color="red"
                    title='Remove random'
                    onPress={() => {
                        setItems((items) => {
                            const randomIndex = Math.floor(Math.random() * items.length);
                            return items.filter((_, index) => index !== randomIndex);
                        });
                    }}
                />
            </View>
            {show && (
                <Stagger
                    stagger={50}
                    duration={300}
                    exitDirection={-1}
                    entering={() => ZoomInEasyDown.springify()}
                    exiting={() => FadeOutDown.springify()}
                    style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly'}}
                >
                    {items.map((item, index) => {
                        return (
                            <View
                                key={`item_${item}`}
                                style={{
                                    width: 100,
                                    aspectRatio: 1,
                                    borderRadius: 16,
                                    overflow: 'hidden',
                                    backgroundColor: colors[index % colors.length],
                                    marginVertical: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {index % 2 === 0 ? (
                                    <Image
                                        source={{
                                            uri: `https://source.unsplash.com/random/${100 + index}x${
                                                100 + index
                                            }/?landscape`,
                                        }}
                                        style={StyleSheet.absoluteFillObject}
                                    />
                                ) : (
                                    <Text style={{ fontWeight: '800', color: '#fff', opacity: 0.8 }}>{index}</Text>
                                )}
                            </View>
                        );
                    })}
                </Stagger>
            )}
            {show && (
                <Stagger
                    stagger={70}
                    duration={300}
                    exitDirection={1}
                    entering={() => {
                        return FadeInDown.springify();
                    }}
                    style={{flex: 1}}
                >
                    <Text style={{ fontSize: 42, color: '#333' }}>Works with</Text>
                    <Text style={{ fontSize: 42, fontWeight: '700', color: 'turquoise' }}>text</Text>
                    <Text style={{ fontSize: 52, fontWeight: '900', color: 'darksalmon' }}>TOOOO!</Text>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: 'rgba(0,0,0,.8)' }}>
                        1. Custom duration
                    </Text>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: 'rgba(0,0,0,.5)' }}>
                        2. Custom stagger
                    </Text>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: 'rgba(0,0,0,.2)' }}>
                        3. Custom animation
                    </Text>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: 'rgba(0,0,0,.2)' }}>
                        4. Custom enter/exit direction
                    </Text>
                    <TextInput
                        label='Outlined input'
                        mode='outlined'
                    />
                </Stagger>
            )}
        </SafeAreaView>
    );
}
