import { SafeAreaProvider } from "react-native-safe-area-context";
import { TelegramStories } from "./TelegramStories";
import telegramData from "./telegramData";

export default function App() {
  return (
    <SafeAreaProvider>
      <TelegramStories data={telegramData} />
    </SafeAreaProvider>
  );
}
