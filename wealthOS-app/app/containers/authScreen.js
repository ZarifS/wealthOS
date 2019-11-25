import React from 'react';
import { StyleSheet } from 'react-native';
import { Icon, Layout } from 'react-native-ui-kitten';
import Input from '../components/input';
import { connect } from 'react-redux';

/**
 * This screen allows a user to authenticate themselves, After login
 * a token is stored in the state.
 */

class AuthScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      secureTextEntry: true,
    };
  }

  renderSecureIcon = (style) => {
    const iconName = this.state.secureTextEntry ? 'eye-off' : 'eye';
    return <Icon {...style} name={iconName} />;
  };

  renderPersonIcon = (style) => {
    return <Icon {...style} name="person-outline" />;
  };

  onChangeText = (name, value) => {
    this.setState({ [name]: value });
  };

  onSecureIconPress = () => {
    const secureTextEntry = !this.state.secureTextEntry;
    this.setState({ secureTextEntry });
  };

  render() {
    return (
      <Layout style={Style.container}>
        <Input
          value={this.state.email}
          placeholder="Email"
          name="email"
          iconName={'person-outline'}
          onChange={this.onChangeText}
        />
        <Input
          value={this.state.password}
          placeholder="Password"
          name="password"
          renderIconFunction={this.renderSecureIcon}
          secureTextEntry={this.state.secureTextEntry}
          onIconPress={this.onSecureIconPress}
          onChange={this.onChangeText}
        />
      </Layout>
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
