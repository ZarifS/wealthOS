import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Layout, Text } from 'react-native-ui-kitten';
import { actions as AuthActions } from '../redux/actions/auth';

export default class HomeScreen extends Component {
  render() {
    return (
      <Layout style={Style.container}>
        <Text>Hello!</Text>
      </Layout>
    );
  }
}
const Style = StyleSheet.create({
  container: {
    alignContent: 'center',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});
