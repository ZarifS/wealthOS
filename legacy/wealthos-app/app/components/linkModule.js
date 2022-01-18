import React from 'react';
import { Text } from 'react-native';
import Button from './button';
import PlaidLink from 'react-native-plaid-link-sdk';
import API from '../services/api.js';

export default class LinkModule extends React.Component {
  render() {
    return (
      <PlaidLink
        publicKey="51c4ca572bc8f22da274b0ff5ba4a6"
        clientName="wealthOS"
        env="sandbox" // 'sandbox' or 'development' or 'production'
        product={['transactions']}
        language="en"
        countryCodes={['US', 'CA']}
        component={Button}
        componentProps={{ title: 'Linked', small: true, primary: true }}
        onSuccess={(data) => this.props.onSuccess(data)}
        onExit={(data) => console.log(data)}
        webhook={`${API.server}/webhook`}
      >
        <Text>Add Account</Text>
      </PlaidLink>
    );
  }
}
