import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Colors, ApplicationStyles } from '../theme'

export default class SplashScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          {/* You will probably want to insert your logo here */}
          <Text>LOGO</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    alignItems: 'center',
    backgroundColor: Colors.primary,
    display: 'flex',
    justifyContent: 'center',
  },
  logo: {
    alignItems: 'center',
    backgroundColor: 'white',
    display: 'flex',
    height: 70,
    justifyContent: 'center',
    width: 70,
  },
})
