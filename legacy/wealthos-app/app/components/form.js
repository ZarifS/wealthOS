import React, { Component } from 'react';
import styled from 'styled-components';
import Button from './button';
import Input from './input';
import { Colors, Fonts } from '../theme';

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = props.formState;
  }

  nextStep = () => {
    const { next, saveState } = this.props;
    // Save state for use in other steps
    saveState(this.state);
    // Go to next step
    next();
  };

  render() {
    const renderInputs = this.props.input.map((input) => {
      return (
        <Input
          key={input.name}
          placeholder={input.placeholder}
          value={this.state[input.name]}
          onChangeText={(name, val) => this.setState({ [name]: val })}
        />
      );
    });
    return (
      <InputContainer>
        <StyledText>{this.props.formHeading}</StyledText>
        {renderInputs}
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
  height: 400px;
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
