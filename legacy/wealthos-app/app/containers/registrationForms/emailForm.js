import React, { Component } from 'react';
import styled from 'styled-components';
import * as EmailValidator from 'email-validator';
import { Colors, Fonts } from '../../theme';
import Button from '../../components/button';
import Input from '../../components/input';
import APIService from '../../services/api';

export default class EmailForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      confirmedEmail: '',
      error: '',
    };
  }

  nextStep = async () => {
    const { next, saveState } = this.props;
    saveState({ email: this.state.email });
    const email = this.state.email.toLowerCase();
    const confirmedEmail = this.state.confirmedEmail.toLowerCase();
    let errorFlag = true;
    // Check if emails are the same
    try {
      if (!EmailValidator.validate(email)) {
        this.setState({ error: 'Please enter a valid email.' });
        errorFlag = false;
      }
      // Check if email is valid
      else if (email !== confirmedEmail) {
        this.setState({ error: 'Emails do not match.' });
        errorFlag = false;
      }
      // Check db if emails are confirmed/valid
      if (errorFlag) {
        const emailExists = await APIService.checkEmailExists(email);
        if (emailExists) {
          this.setState({ error: 'This email is already registered.' });
          errorFlag = false;
        } else {
          next();
        }
      }
    } catch (err) {
      this.setState({
        error: "We're having a issue trying to sign you up. Please try again later.",
      });
    }
  };

  render() {
    return (
      <InputContainer>
        <StyledText>Whats your email?</StyledText>
        <Input
          placeholder="Email"
          value={this.state.email}
          onChangeText={(name, val) => this.setState({ email: val })}
        />
        <Input
          placeholder="Confirm email"
          value={this.state.confirmedEmail}
          onChangeText={(name, val) => this.setState({ confirmedEmail: val })}
        />
        {this.state.error !== '' && <StyledErrorText>{this.state.error}</StyledErrorText>}
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

const StyledErrorText = styled.Text`
  font-size: ${Fonts.medium};
  color: ${Colors.error};
  margin-top: 10px;
  padding-left: 40px;
  padding-right: 40px;
  text-align: center;
`;

const InputContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 80%;
`;
