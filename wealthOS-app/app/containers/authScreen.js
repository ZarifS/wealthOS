import React from 'react';
import {
  Text,
  View,
  Button,
  ActivityIndicator,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';

/**
 * This is an example of a container component.
 *
 * This screen displays a little help message and informations about a fake user.
 * Feel free to remove it.
 */

class AuthScreen extends React.Component {
  render() {
    return (
      <SafeAreaView style={Style.container}>
        <Text>Hello</Text>
      </SafeAreaView>
    );
  }
}

const Style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 30,
  },
});

const mapStateToProps = (state) => ({
  token: state.auth.token,
  userIsLoading: state.auth.userIsLoading,
  userErrorMessage: state.auth.userErrorMessage,
});

export default connect(mapStateToProps)(AuthScreen);
