import * as React from "react";
import {
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue
} from "react-native-reanimated";
import Constants from "expo-constants";

const alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#\$%^&*()_+-=[]\;',./<>?:"{}|`;

Animated.addWhitelistedNativeProps({
  text: true,
  value: true
});

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type ReTextProps = {
  text: SharedValue<string>;
  style: StyleProp<TextStyle>;
};

type WordProps = {
  char: string;
  uppercase?: boolean;
  shouldAnimate?: boolean;
  style: StyleProp<TextStyle>;
};

type SentenceProps = {
  text: string;
  style: StyleProp<TextStyle>;
  uppercase?: boolean;
};

const ReText = ({ style, text }: ReTextProps) => {
  const animatedProps = useAnimatedProps(() => {
    return {
      text: String(text.value),
      defaultValue: String(text.value)
    };
  });

  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      style={style}
      animatedProps={animatedProps}
    />
  );
};

const Word = ({ char, shouldAnimate, style, uppercase }: WordProps) => {
  const value = useSharedValue(0);
  const maxTimes = useSharedValue(Math.floor(Math.random() * 20) + 10);

  React.useEffect(() => {
    const random = () => Math.floor(Math.random() * (alphabet.length - 1));
    const randomTimeout = Math.floor(Math.random() * 30) + 20;
    let times = 0;
    let timeoutId: NodeJS.Timeout | null = null;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const animate = () => {
      timeoutId = setTimeout(() => {
        if (times === maxTimes.value) {
          value.value = alphabet.indexOf(
            uppercase ? String(char).toUpperCase() : char
          );
          return;
        }
        value.value = random();
        times += 1;
        animate();
      }, randomTimeout);
    };

    if (shouldAnimate) {
      animate();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
    // value.value = withTiming(random(), {duration: 1000, delay: 0});
  }, [char]);

  const animatedChar = useDerivedValue(() => {
    // console.log(alphabet[value.value]);
    return alphabet[value.value] as string;
  });

  return (
    <ReText
      text={animatedChar}
      style={style}
    />
  );
};

export function HackerText({ text, style, uppercase }: SentenceProps) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {text.split(" ").map((word, index) => {
        return (
          <View
            key={`word-${index}`}
            style={{
              flexDirection: "row",
              marginRight: (style?.["fontSize"] ?? 16) / 2
            }}
          >
            {word.split("").map((char, index) => {
              return (
                <Word
                  key={`${char}-${index}`}
                  char={char}
                  style={style}
                  uppercase={uppercase}
                  shouldAnimate={
                    char.indexOf(`!@#$%^&*()_+-=[]\;',./<>?:"{}|`) === -1 ||
                    char === " "
                  }
                />
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const sentence = [
  // 'Be yourself; everyone else is already taken.',
  `So many books, so little time.`,
  // `A room without books is like a body without a soul.`,
  `Made with love by @mironcatalin`,
  `Using Expo and Reanimated`
];
const subtitles = [
  // 'Be yourself; everyone else is already taken.',
  `- _ - _ - _ -`,
  // `A room without books is like a body without a soul.`,
  `Follow me on Twitter for more`,
  `. . . . . . . . . . . . . . .`
];
export default function App() {
  const [index, setIndex] = React.useState(0);
  const timer = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    const changeSentence = () => {
      timer.current = setTimeout(() => {
        setIndex((index) => {
          return (index + 1) % sentence.length;
        });
        changeSentence();
      }, 3000);
    };

    changeSentence();

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Sentence
        text={sentence[index] as string}
        style={{
          fontSize: 20,
          fontFamily: "Menlo",
          fontWeight: "bold"
        }}
        uppercase
      />

      <Sentence
        text={subtitles[index] as string}
        style={{
          marginTop: 10,
          fontSize: 14,
          fontFamily: "Menlo",
          opacity: 0.7
        }}
        // uppercase
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 16
  }
});
