import { TextInput, TextInputProps } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';

Animated.addWhitelistedNativeProps({ text: true });

type TextProps = TextInputProps & {
  text: SharedValue<number>;
  formatter?: string;
}

const AnimatedTextInput = Animated.createAnimatedComponent<any>(TextInput);

export function AnimatedText({
  text,
  style,
  formatter = '',
  ...props
}: TextProps) {
  const animatedProps = useAnimatedProps(() => {
    if (!text) {
      return {
        text: ""
      };
    }
    return {
      text: `${Math.floor(text.value).toFixed(0)}${formatter}`,
    };
  });
  return (
    <AnimatedTextInput
      {...props}
      underlineColorAndroid="transparent"
      editable={false}
      style={style}
      allowFontScaling={false}
      numberOfLines={1}
      value={`${Math.floor(text.value).toFixed(0)}${formatter}`}
      {...{ animatedProps }}
    />
  );
}
