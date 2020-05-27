import React, { Component } from 'react';
import styled from 'styled-components';
import { Colors, Fonts } from '../../theme';
import Button from '../../components/button';
import Input from '../../components/input';

export default class PasswordForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmedPassword: '',
    };
  }

  nextStep = () => {
    const { next, saveState } = this.props;
    saveState({ password: this.state.password });
    next();
  };

  render() {
    return (
      <InputContainer>
        <StyledText>Create a password.</StyledText>
        <StyledSubtext>Your password will need to be at least 8 characters long.</StyledSubtext>
        <Input
          placeholder="Password"
          secureTextEntry={true}
          value={this.state.password}
          onChangeText={(name, val) => this.setState({ password: val })}
        />
        <Input
          placeholder="Confirm Password"
          secureTextEntry={true}
          value={this.state.confirmedPassword}
          onChangeText={(name, val) => this.setState({ confirmedPassword: val })}
        />
        <ButtonContainer>
          <Button title="Back" small onPress={this.props.back} />
          <Button title="Next" small primary onPress={this.nextStep} />
        </ButtonContainer>
      </InputContainer>
    );
  }
}

const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  justify-content: space-around;
`;

const StyledText = styled.Text`
  font-size: ${Fonts.regular};
  color: ${Colors.onBackground};
  margin-bottom: 10px;
`;

const StyledSubtext = styled.Text`
  font-size: ${Fonts.small};
  color: ${Colors.onBackground};
  margin-bottom: 10px;
`;

const InputContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 80%;
`;
