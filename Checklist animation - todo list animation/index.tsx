// Inspiration: https://dribbble.com/shots/10629617-Simple-checklist-animation

import * as React from 'react';
import { StatusBar, Pressable, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { Feather } from '@expo/vector-icons';
import { MotiView, MotiText } from 'moti';

const _activeColor = '#4431E7';
const _inactiveColor = '#BBC0D5';
const _spacing = 20;
const _particlesCount = 8;

const CheckBox = React.memo(({ checked, text, size }) => {
    const _innerSize = size * 0.2;
    const [width, setWidth] = React.useState(size);
    const particles = React.useMemo(() => {
        return [...Array(_particlesCount).keys()].map((i) => {
            const _angle = (i * 2 * Math.PI) / _particlesCount;
            const _radius = 6 + size / 2;
            return {
                key: `particle-${i}`,
                x: _radius * Math.cos(_angle),
                y: _radius * Math.sin(_angle),
            };
        });
    }, [size]);
    return (
        <MotiView style={{ flexDirection: 'row' }}>
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: size,
                    marginRight: _spacing,
                }}>
                <MotiView
                    animate={{
                        scale: checked ? 1 : 0,
                        opacity: checked ? 1 : 0,
                    }}
                    transition={{
                        type: checked ? 'spring' : 'timing',
                        duration: checked && 0,
                    }}>
                    <Feather name="check" size={size} color={_activeColor} />
                </MotiView>
                {width !== size &&
                    particles.map((item) => {
                        return (
                            <MotiView
                                key={item.key}
                                animate={{
                                    transform: [
                                        {
                                            translateX: checked ? item.x : 0,
                                        },
                                        {
                                            translateY: checked ? item.y : 0,
                                        },
                                        {
                                            scale: checked ? 1.2 : 1,
                                        },
                                    ],
                                    opacity: checked ? [0.5, 0] : 0,
                                }}
                                transition={{
                                    type: 'timing',
                                    duration: 300,
                                    delay: 100,
                                }}
                                style={{
                                    width: _innerSize,
                                    height: _innerSize,
                                    borderRadius: _innerSize,
                                    backgroundColor: _activeColor,
                                    position: 'absolute',
                                }}
                            />
                        );
                    })}
            </View>
            <MotiView
                animate={{
                    translateX: checked ? [size / 2, 0] : 0,
                }}
                transition={{
                    type: 'timing',
                    duration: 200,
                    delay: 100,
                }}
                style={{ justifyContent: 'center' }}
                onLayout={(ev) => {
                    const newWidth = ev.nativeEvent.layout.width;
                    if (width !== newWidth) {
                        setWidth(newWidth);
                    }
                }}>
                <MotiText
                    animate={{
                        color: checked ? _inactiveColor : _activeColor,
                    }}
                    style={{ fontSize: size, fontWeight: 'bold', lineHeight: size + 2 }}>
                    {text}
                </MotiText>
                {width !== size && (
                    <MotiView
                        animate={{
                            translateX: checked ? -_spacing / 2 : -size - _spacing + size / 4,
                            width: checked ? width + _spacing : size / 2,
                            backgroundColor: checked ? _inactiveColor : _activeColor,
                        }}
                        transition={{
                            type: checked ? 'spring' : 'timing',
                            duration: checked && 0,
                        }}
                        style={{
                            height: 3,
                            backgroundColor: _activeColor,
                            position: 'absolute',
                        }}
                    />
                )}
            </MotiView>
        </MotiView>
    );
});

const _todos = [
    'Coffee',
    'Bread',
    'Cheese',
    'Learning by doing',
    'Procrastinate',
].map((item) => {
    return {
        key: item,
        label: item,
        checked: false,
    };
});

export default function App() {
    const [todos, setTodos] = React.useState(_todos);
    return (
        <View style={styles.container}>
            <StatusBar hidden />
            {todos.map((todo) => {
                return (
                    <Pressable
                        key={todo.key}
                        style={{ marginBottom: _spacing }}
                        onPress={() => {
                            const { key } = todo;
                            const newTodos = todos.map((t) => {
                                if (t.key !== key) {
                                    return t;
                                }

                                return {
                                    ...t,
                                    checked: !t.checked,
                                };
                            });

                            setTodos(newTodos);
                        }}>
                        <CheckBox checked={todo.checked} text={todo.label} size={24} />
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#fff',
        padding: _spacing,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
