import { useState } from 'react';
import {
  StatusBar,
  TouchableWithoutFeedback,
  useWindowDimensions,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Progress } from './components/Progress';

const colors = [
    {bg: '#e4ff1a', textColor: '#03045e', statusBar: 'dark'},
    {bg: '#00296b', textColor: '#ffd500', statusBar: 'light'},
    {bg: '#80ffdb', textColor: '#7400b8', statusBar: 'dark'},
    {bg: '#7400b8', textColor: '#80ffdb', statusBar: 'light'},
    {bg: '#3a0ca3', textColor: '#f72585', statusBar: 'light'},
    {bg: '#3a0ca3', textColor: '#4cc9f0', statusBar: 'light'},
    {bg: '#e63946', textColor: '#f1faee', statusBar: 'light'},
    {bg: '#03045e', textColor: '#caf0f8', statusBar: 'light'},
    {bg: '#6b705c', textColor: '#ffe8d6', statusBar: 'light'},
    {bg: '#264653', textColor: '#f4a261', statusBar: 'light'},
    {bg: '#fdfdfd', textColor: '#000000', statusBar: 'dark'},
    {bg: '#FF4C1E', textColor: '#ffffff', statusBar: 'light'},
    {bg: '#222222', textColor: '#ffffff', statusBar: 'light'},
    {bg: '#228B22', textColor: '#ffffff', statusBar: 'light'},
    {bg: '#BD97CB', textColor: '#000000', statusBar: 'dark'},
]

export default function App() {
  const { width, height } = useWindowDimensions();
  const [value, setValue] = useState(35);
  const [pallete, setPallete] = useState(0);
  const maxSize = height > width ? width * 0.8 : height * 0.8;
  const [size, setSize] = useState(maxSize);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setValue(() => Math.floor(Math.random() * 100));
        if (Math.random() > 0.2) {
          setPallete((value) => (value + 1) % colors.length);
        }
        if (Math.random() > 0.5) {
          setSize(
            () => Math.floor(Math.random() * maxSize * 0.2) + maxSize * 0.8
          );
        }
      }}>
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: `${colors[pallete].bg}`,
          },
        ]}>
        <StatusBar hidden />
        <Progress
          size={size}
          value={value}
          color={colors[pallete].textColor}
          inactiveColor={`${colors[pallete].textColor}55`}
          textStyle={{
            color: colors[pallete].textColor,
          }}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 8,
  }
});
