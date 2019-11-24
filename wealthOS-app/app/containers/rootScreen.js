import React, { Component } from 'react'
import NavigationService from '../services/navigationService'
import AppNavigator from '../navigators/appNavigator'
import { View, StyleSheet } from 'react-native'
import { ApplicationStyles } from '../theme'

export default class RootScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <AppNavigator
          // Initialize the NavigationService (see https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html)
          ref={(navigatorRef) => {
            NavigationService.setTopLevelNavigator(navigatorRef)
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
  },
})
