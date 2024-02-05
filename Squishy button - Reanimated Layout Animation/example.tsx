import { StatusBar, StyleSheet, View } from 'react-native'

import { SquishyButton } from './src/SquishyButton'

// For presentation purposes.
import chroma from 'chroma-js'
import randomColor from 'randomcolor'

const sizes = [18, 24, 36, 42, 54]
const colors = chroma
  .scale([randomColor({ luminosity: 'dark', hue: 'pink' }), randomColor({ luminosity: 'light' })])
  .mode('hsl')
  .colors(sizes.length * 2 + 2)
export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={{ flex: 1, justifyContent: 'center', gap: 12 }}>
        {[...sizes, 60, ...[...sizes].reverse()].map((size, index) => (
          <SquishyButton key={size + '---' + index} size={size} color={colors[index]} />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
