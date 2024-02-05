import {
    TouchableWithoutFeedback,
    Dimensions,
    Text,
    SafeAreaView,
    StyleSheet,
    View,
    TextInput,
    Pressable,
    FlatList,
    StatusBar,
  } from 'react-native';
  import { useState, useMemo } from 'react';
  import randomColor from 'randomcolor';
  
  import { BlurView } from 'expo-blur';
  import Animated, {
    FadeIn,
    FadeOut,
  } from 'react-native-reanimated';
  import { Entypo } from '@expo/vector-icons';
  import {FabButton} from './FabButton'
  
  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
  
  const { width } = Dimensions.get('window');
  
  const _defaultDuration = 500;
  const numColumns = 2;
  const gap = 14;
  const availableSpace = width - (numColumns - 1) * gap;
  const itemSize = (availableSpace - gap * 2) / numColumns;
  
  function DummyList() {
    const items = useMemo(
      () =>
        randomColor({
          count: 20,
          // luminosity: 'light',
        }).map((color) => ({
          key: color,
          color: color,
          colors: randomColor({
            luminosity: 'light',
            count: Math.floor(Math.random() * 3 + 1),
          }),
        })),
      []
    );
    return (
      <FlatList
        data={items}
        keyExtractor={(item) => item.key}
        numColumns={numColumns}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={{ gap }}
        renderItem={({ item }) => {
          return (
            <View style={{ width: itemSize, height: itemSize }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: item,
                  borderRadius: gap,
                  opacity: 0.9,
                  gap: gap,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  padding: gap,
                  backgroundColor: item.color,
                }}>
                {false &&
                  item.colors.map((color) => {
                    return (
                      <View
                        key={color}
                        style={{
                          width: '45%',
                          height: '45%',
                          backgroundColor: color,
                          borderRadius: gap,
                        }}
                      />
                    );
                  })}
              </View>
            </View>
          );
        }}
      />
    );
  }
  
  function Backdrop({
    onPress,
    duration = 500,
  }: {
    onPress: () => void;
    duration?: number;
  }) {
    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2 },
        ]}
        entering={FadeIn.duration(duration)}
        exiting={FadeOut.duration(duration)}>
        <Pressable onPress={onPress} style={{ flex: 1 }}>
          <AnimatedBlurView style={{ flex: 1 }} intensity={100} />
        </Pressable>
      </Animated.View>
    );
  }
  
  export default function App() {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <DummyList />
        {isOpen && <Backdrop onPress={() => setIsOpen(false)} duration={500} />}
        <FabButton
          onPress={() => {
            setIsOpen((isOpen) => !isOpen);
          }}
          isOpen={isOpen}
          duration={500}>
          <Text style={styles.body}>
            <Text style={{ fontWeight: 'bold', color: '#0099cc' }}>
              AnimateReactNative.com
            </Text>{' '}
            is now on sale for{' '}
            <Text style={{ fontWeight: 'bold' }}>Black Friday</Text> at half the
            price for all plans 🎉
          </Text>
          <Text style={styles.body}>
            Use <Text style={{ fontWeight: 'bold' }}>BF2023</Text> at checkout to
            save <Text style={{ fontWeight: 'bold' }}>$99.5</Text>.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Paste BF2023 for 50% OFF"
            placeholderTextColor="rgba(255,255,255,0.2)"
          />
          <Pressable
            onPress={() => {
              setIsOpen(false);
            }}
            style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Use · Learn · Save time</Text>
          </Pressable>
        </FabButton>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 8,
    },
    body: { color: 'rgba(255,255,255,0.8)' },
    input: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: 14,
      borderRadius: 14,
      fontWeight: 'bold',
      color: 'rgba(255,255,255,0.8)',
    },
    buttonContainer: {
      padding: 14,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'gold',
      borderRadius: 14,
    },
    buttonText: {
      fontWeight: 'bold',
      color: 'rgba(0,0,0,0.8)',
    },
  });
  