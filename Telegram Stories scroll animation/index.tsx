import { Feather } from "@expo/vector-icons";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { forwardRef } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  AnimatedRef,
  AnimatedStyle,
  Extrapolation,
  SharedValue,
  interpolate,
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import telegramData, { myStory } from "./telegramData";

type AvatarProps = {
  image: string;
  size: number;
  bg: string;
  hasStories?: boolean;
  style?: AnimatedStyle<StyleProp<ViewStyle>>;
};

type ActiveItemRefs = {
  [key: string]: AnimatedRef<any>;
};

type MessageListItemProps = {
  item: (typeof telegramData)[0];
};

type HeaderProps = {
  data: typeof telegramData;
  refs: ActiveItemRefs;
  animatedIndex: SharedValue<number>;
};

type AnimatedStoryItemProps = {
  item: (typeof telegramData)[0];
  index: number;
  refs: ActiveItemRefs;
  animatedIndex: SharedValue<number>;
  myStory?: boolean;
};

type MessageListProps = { data: typeof telegramData };

const headerHeight = 64;
const storiesHeight = 100;
const storyAvatarSize = 70;
const headerAvatarSize = 30;
// How many items to be visible in the header
const maxHeaderItems = 3;

const Avatar = forwardRef<any, AvatarProps>(
  ({ bg, image, size, hasStories, style }, ref) => {
    const borderSize = 2;

    return (
      <Animated.View
        ref={ref}
        style={[
          {
            width: size,
            aspectRatio: 1,
            justifyContent: "center",
            alignItems: "center",
          },
          style,
        ]}>
        {hasStories && (
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: "white",
                borderRadius: 100,
                borderWidth: borderSize,
                borderColor: bg,
              },
            ]}
          />
        )}
        <Animated.Image
          source={{ uri: image }}
          style={[
            StyleSheet.absoluteFillObject,
            {
              top: borderSize * 2,
              left: borderSize * 2,
              bottom: borderSize * 2,
              right: borderSize * 2,
              borderRadius: 100,
            },
          ]}
        />
      </Animated.View>
    );
  }
);

function MessageListItem({ item }: MessageListItemProps) {
  const { width } = useWindowDimensions();
  return (
    <TouchableOpacity onPress={() => alert(`Pressed on ${item.name}`)}>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          width,
          marginVertical: 10,
          paddingHorizontal: 20,
        }}>
        <Avatar
          image={item.avatar}
          size={60}
          hasStories={item.hasStories}
          bg={item.bg}
        />
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "rgba(0,0,0,0.1)",
            flex: 1,
            paddingBottom: 10,
            gap: 4,
          }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontWeight: "700" }}>{item.name}</Text>
            <Text style={{ opacity: 0.5 }}>{item.date.toDateString()}</Text>
          </View>
          <Text style={{ opacity: 0.4 }} numberOfLines={2}>
            {item.message}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function MessageList({ data }: MessageListProps) {
  return (
    <BottomSheetFlatList
      data={data}
      renderItem={({ item, index }) => {
        return <MessageListItem item={item} />;
      }}
    />
  );
}

function Header({ data, refs, animatedIndex }: HeaderProps) {
  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedIndex.value, [0, 0.95, 1], [0, 0, 1]),
    };
  });
  const headerStylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            animatedIndex.value,
            [1, 0.5],
            [0, (-headerAvatarSize * maxHeaderItems) / 2],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });
  return (
    <View
      style={{
        flexDirection: "row",
        height: headerHeight,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
      }}>
      <Feather name='arrow-left' size={18} color='black' />
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}>
        <Animated.View style={[{ flexDirection: "row", gap: -10 }]}>
          {data
            .filter((item) => item.hasStories)
            .slice(0, maxHeaderItems)
            .map((item, index) => (
              <Avatar
                image={item.avatar}
                style={stylez}
                size={headerAvatarSize}
                bg={item.bg}
                hasStories={true}
                key={item.key}
                ref={refs[item.key]}
              />
            ))}
        </Animated.View>
        <Animated.Text style={[{ fontWeight: "800" }, headerStylez]}>
          Chats
        </Animated.Text>
      </View>
      <Feather name='settings' size={18} color='black' />
    </View>
  );
}

function AnimatedStoryItem({
  item,
  index,
  refs,
  animatedIndex,
  myStory = false,
}: AnimatedStoryItemProps) {
  const currentItemRef = useAnimatedRef();
  const { width } = useWindowDimensions();
  const stylez = useAnimatedStyle(() => {
    if (!_WORKLET) {
      return {};
    }

    // Check if we were able to measure the current item
    const currentMeasurement = measure(currentItemRef);
    if (currentMeasurement === null) {
      return {};
    }

    // This is for none stories items (my story + stories that are not visible in the header)
    if (!refs[item.key]) {
      return {
        opacity: interpolate(animatedIndex.value, [0, 0.3, 1], [1, 0, 0]),
        transform: [
          {
            translateX: interpolate(
              animatedIndex.value,
              [0, 0.5],
              [0, width / 2 - currentMeasurement.x],
              Extrapolation.CLAMP
            ),
          },
          {
            translateY: interpolate(
              animatedIndex.value,
              [0, 1],
              [0, -storiesHeight / 2],
              Extrapolation.CLAMP
            ),
          },
          {
            scale: interpolate(animatedIndex.value, [0, 1], [1, 0]),
          },
        ],
      };
    }
    const measurement = measure(refs[item.key]);

    // If we were not able to measure the item, return an empty object
    if (measurement === null) {
      return {};
    }
    const xDiff =
      currentMeasurement.pageX -
      measurement.pageX +
      currentMeasurement.width / 2 -
      measurement.width / 2;
    const yDiff = currentMeasurement.pageY - measurement.pageY;

    return {
      opacity: interpolate(animatedIndex.value, [0, 0.999, 1], [1, 1, 0]),
      width: interpolate(
        animatedIndex.value,
        [0, 1],
        [storyAvatarSize, measurement.width]
      ),
      height: interpolate(
        animatedIndex.value,
        [0, 1],
        [storyAvatarSize, measurement.height]
      ),
      transform: [
        {
          translateY: interpolate(
            animatedIndex.value,
            [0, 1 - index / 50],
            [0, -yDiff],
            Extrapolation.CLAMP
          ),
        },
        {
          translateX: interpolate(
            animatedIndex.value,
            [0, 1 - index / 50],
            [0, -xDiff],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedIndex.value, [0, 0.1, 1], [1, 0, 0]),
    };
  });

  return (
    <Animated.View
      ref={currentItemRef}
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          width: storyAvatarSize,
        },
      ]}>
      <Avatar
        image={item.avatar}
        size={storyAvatarSize}
        style={stylez}
        bg={item.bg}
        hasStories={index !== -1}
      />
      {myStory && (
        <Animated.View
          style={[
            stylez,
            {
              width: 24,
              height: 24,
              backgroundColor: item.bg,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
              position: "absolute",
              top: "40%",
              right: -5,
            },
          ]}>
          <Feather name='plus' color={"white"} size={18} />
        </Animated.View>
      )}
      <Animated.Text
        style={[{ maxWidth: storyAvatarSize, fontSize: 10 }, textStyle]}
        numberOfLines={1}>
        {myStory ? "My Story" : item.name.split(" ")[0]}
      </Animated.Text>
    </Animated.View>
  );
}

function ExpandedList<T>({
  data,
  refs,
  animatedIndex,
}: {
  data: typeof telegramData;
  refs: ActiveItemRefs;
  animatedIndex: SharedValue<number>;
}) {
  const stylez = useAnimatedStyle(() => {
    return {
      // opacity: interpolate(animatedIndex.value, [1, 0], [0.5, 1]),
    };
  });
  return (
    <Animated.ScrollView
      horizontal
      style={[
        { flexGrow: 0, overflow: "visible", backgroundColor: "transparent" },
        stylez,
      ]}
      contentContainerStyle={{
        paddingHorizontal: 20,
        gap: 10,
        alignItems: "center",
      }}
      showsHorizontalScrollIndicator={false}>
      <AnimatedStoryItem
        refs={refs}
        item={myStory}
        index={-1}
        animatedIndex={animatedIndex}
        myStory={true}
      />
      {data.map(
        (item, index) =>
          item.hasStories && (
            <AnimatedStoryItem
              key={item.key}
              item={item}
              index={index}
              refs={refs}
              animatedIndex={animatedIndex}
              myStory={false}
            />
          )
      )}
    </Animated.ScrollView>
  );
}

export function TelegramStories({ data }: MessageListProps) {
  // Create the refs that we'd like to display on the header.
  // This will help us to measure the position of the item.
  const refs = data
    .filter((item) => item.hasStories)
    .slice(0, maxHeaderItems)
    .reduce(
      (acc, item) => ({ ...acc, [item.key]: useAnimatedRef() }),
      {} as ActiveItemRefs
    );

  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const animatedIndex = useSharedValue(1);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <StatusBar hidden />
      <Header data={data} refs={refs} animatedIndex={animatedIndex} />
      {/*
        This is the list that will be visibile after pulling down.
        It will display all the items that have stories.
      */}
      <ExpandedList refs={refs} data={data} animatedIndex={animatedIndex} />
      <BottomSheet
        index={1}
        handleComponent={null}
        animatedIndex={animatedIndex}
        animateOnMount={false}
        handleHeight={0}
        backgroundStyle={{ backgroundColor: "transparent", borderRadius: 0 }}
        snapPoints={[
          height - headerHeight - storiesHeight - top,
          height - headerHeight - top,
        ]}>
        <MessageList data={data} />
      </BottomSheet>
    </SafeAreaView>
  );
}
