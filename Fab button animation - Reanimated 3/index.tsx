import {
    TouchableWithoutFeedback,
    Dimensions,
    Text,
    StyleSheet,
    View,
    ViewStyle,
  } from 'react-native';
  import Animated, {
    Layout,
    FadeInDown,
    FadeOutDown,
    FadeIn,
    FadeOut,
    useAnimatedKeyboard,
    useAnimatedStyle,
    KeyboardState,
  } from 'react-native-reanimated';
  import { Entypo } from '@expo/vector-icons';
  
  const AnimatedEntypo = Animated.createAnimatedComponent(Entypo);
  
  const { width } = Dimensions.get('window');
  const _defaultDuration = 500;
  
  export type FabButtonProps = {
    onPress: () => void;
    isOpen: boolean;
    children: React.ReactNode;
    panelStyle?: ViewStyle;
    duration?: number;
    openedSize?: number;
    closedSize?: number;
  }
  
  export function FabButton({
    onPress,
    isOpen,
    panelStyle,
    children,
    duration = _defaultDuration,
    openedSize = width * 0.85,
    closedSize = 64,
  }: FabButtonProps) {
    const spacing = closedSize * 0.2;
    const closeIconSize = closedSize * 0.3;
    const openIconSize = closedSize * 0.5;
    const { height: keyboardHeight, state } = useAnimatedKeyboard();
  
    const keyboardHeightStyle = useAnimatedStyle(() => {
      return {
        marginBottom:
          state.value === KeyboardState.OPEN
            ? keyboardHeight.value - 80 + spacing
            : 0,
      };
    });
  
    return (
      <Animated.View
        style={[
          styles.panel,
          panelStyle,
          {
            width: isOpen ? openedSize : closedSize,
            height: isOpen ? 'auto' : closedSize,
            borderRadius: closedSize / 2,
            padding: spacing,
          },
          keyboardHeightStyle,
        ]}
        layout={Layout.duration(duration)}>
        <TouchableWithoutFeedback onPress={onPress}>
          <Animated.View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              right: 0,
              top: 0,
              width: closedSize,
              height: closedSize,
              zIndex: 2,
            }}
            layout={Layout.duration(duration)}>
            {isOpen ? (
              <AnimatedEntypo
                key="close"
                name="cross"
                size={closeIconSize}
                color="white"
                entering={FadeIn.duration(duration)}
                exiting={FadeOut.duration(duration)}
              />
            ) : (
              <AnimatedEntypo
                key="open"
                name="plus"
                size={openIconSize}
                color="white"
                entering={FadeIn.duration(duration)}
                exiting={FadeOut.duration(duration)}
              />
            )}
          </Animated.View>
        </TouchableWithoutFeedback>
        {isOpen && (
          <Animated.View
            entering={FadeInDown.duration(duration)}
            exiting={FadeOutDown.duration(duration)}
            style={{ flex: 1, gap: spacing * 2, padding: spacing }}>
            <View style={styles.header}>
              <Text style={styles.heading}>BLACK FRIDAY</Text>
            </View>
            <View style={[styles.content, { gap: spacing * 2 }]}>{children}</View>
          </Animated.View>
        )}
      </Animated.View>
    );
  }
  
  const styles = StyleSheet.create({
    heading: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
    },
    panel: {
      position: 'absolute',
      overflow: 'hidden',
      bottom: 80,
      backgroundColor: '#111',
      zIndex: 9999,
    },
    content: { flex: 1, paddingTop: 0 },
    header: { justifyContent: 'center' }
  });
  