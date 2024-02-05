import { View } from "react-native";
import { BallonSlider } from "./BallonSlider";

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <BallonSlider
      // disable the sensors
      // withSensor={false}
      />
    </View>
  );
}
