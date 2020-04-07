import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import NavigationService from '../services/navigation';
import { actions as AuthActions } from '../redux/actions/auth';
import Input from '../components/input';
import Button from '../components/button';
import Divider from '../components/divider';
import { Colors, Fonts } from '../theme';

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

  onChangeText = (name, value) => {
    this.setState({ [name]: value });
  };

  onSubmit = () => {
    this.props.dispatch(AuthActions.authUser(this.state.email, this.state.password));
  };

  onSignUp = () => {
    NavigationService.navigate('RegisterScreen');
  };

  render() {
    return (
      <Screen>
        <Logo>
          wealth
          <Accent>OS</Accent>
        </Logo>
        <InputContainer>
          <Input
            value={this.state.email}
            placeholder="Email"
            name="email"
            iconName={'person-outline'}
            onChangeText={this.onChangeText}
          />
          <Input
            value={this.state.password}
            placeholder="Password"
            name="password"
            secureTextEntry={this.state.secureTextEntry}
            onIconPress={this.onSecureIconPress}
            onChangeText={this.onChangeText}
          />
          <StyledText>Forgot credentials?</StyledText>
        </InputContainer>
        <Divider />
        <Button primary title="Continue" onPress={this.onSubmit} />
        <Divider />
        <Button title="Sign Up" onPress={this.onSignUp} />
        {this.props.authIsLoading && (
          <IndicatorContainer>
            <ActivityIndicator size="large" color={Colors.primary} />
          </IndicatorContainer>
        )}
      </Screen>
    );
  }
}

const Screen = styled.SafeAreaView`
  align-items: center;
  background-color: ${Colors.background};
  display: flex;
  flex: 1;
`;
const Logo = styled.Text`
  color: ${Colors.onBackground};
  font-size: 34px;
  margin-bottom: 50px;
  margin-top: 200px;
`;

const Accent = styled.Text`
  color: ${Colors.primary};
`;

const IndicatorContainer = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  align-items: center;
  justify-content: center;
`;

const InputContainer = styled.View``;

const StyledText = styled.Text`
  color: ${Colors.onBackground};
  font-size: ${Fonts.medium};
  text-align: center;
  margin-top: 15px;
`;

const mapStateToProps = (state) => ({
  authIsLoading: state.auth.authIsLoading,
  authErrorMessage: state.auth.authErrorMessage,
});

export default connect(mapStateToProps)(AuthScreen);
