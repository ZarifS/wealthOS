import React, { Component } from 'react';
import NavigationService from '../services/navigation';
import AppNavigator from '../navigators/appNavigator';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { actions as StartupActions } from '../redux/actions/startUp';

class RootScreen extends Component {
  componentDidMount() {
    // Run the startup saga when the application is starting
    console.log('App has started! Running startup actions..');
    this.props.startup();
  }

  render() {
    return (
      <View style={styles.container}>
        <AppNavigator
          // Initialize the NavigationService (see https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html)
          ref={(navigatorRef) => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startUp()),
});

export default connect(null, mapDispatchToProps)(RootScreen);
