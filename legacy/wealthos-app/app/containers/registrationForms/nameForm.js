import React, { Component } from 'react';
import styled from 'styled-components';
import { Colors, Fonts } from '../../theme';
import Button from '../../components/button';
import Input from '../../components/input';

export default class NameForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
    };
  }

  nextStep = () => {
    const { next, saveState } = this.props;
    saveState({ firstName: this.state.firstName, lastName: this.state.lastName });
    next();
  };

  render() {
    return (
      <InputContainer>
        <StyledText>Whats your name?</StyledText>
        <Input
          placeholder="First name"
          value={this.state.firstName}
          onChangeText={(name, val) => this.setState({ firstName: val })}
        />
        <Input
          value={this.state.lastName}
          placeholder="Last name"
          onChangeText={(name, val) => this.setState({ lastName: val })}
        />
        <ButtonContainer>
          <Button title="Next" small primary onPress={this.nextStep} />
        </ButtonContainer>
      </InputContainer>
    );
  }
}

const InputContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 80%;
`;

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
