import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Layout, Button, Modal, Spinner } from 'react-native-ui-kitten';
import { actions as AuthActions } from '../redux/actions/auth';
import Input from '../components/input';

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

  // setModalVisible = () => {
  //   const modalVisible = !this.state.modalVisible;
  //   this.setState({ modalVisible });
  // };

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

  renderModalElement = () => {
    return <Spinner size="giant" />;
  };

  onSubmit = () => {
    this.props.dispatch(AuthActions.authUser(this.state.email, this.state.password));
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
        <Button onPress={this.onSubmit} style={Style.continueButton} size="medium">
          Continue
        </Button>
        <Modal
          allowBackdrop={true}
          // eslint-disable-next-line react-native/no-inline-styles
          backdropStyle={{ backgroundColor: 'black', opacity: 0.5 }}
          visible={this.props.authIsLoading}
        >
          {<Spinner size="giant" />}
        </Modal>
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
  continueButton: {
    marginTop: 10,
  },
});

const mapStateToProps = (state) => ({
  authIsLoading: state.auth.authIsLoading,
  authErrorMessage: state.auth.authErrorMessage,
});

export default connect(mapStateToProps)(AuthScreen);
