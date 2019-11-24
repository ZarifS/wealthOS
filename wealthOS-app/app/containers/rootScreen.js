import React, { Component } from 'react';
import NavigationService from '../services/navigationService';
import AppNavigator from '../navigators/appNavigator';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { actions as StartupActions } from '../redux/actions/startUp';
import { ApplicationStyles } from '../theme';

class RootScreen extends Component {
  componentDidMount() {
    // Run the startup saga when the application is starting
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
    ...ApplicationStyles.screen.container,
  },
});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startUp()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);
