import React, { Component } from 'react';
import styled from 'styled-components';
import { Colors, Fonts } from '../../theme';
import Button from '../../components/button';

export default class SubmitForm extends Component {
  render() {
    return (
      <InputContainer>
        {this.props.registerIsLoading}
        <StyledText>All set! Lets make your account!</StyledText>
        <StyledSubtext>Please go back if you need to change any details.</StyledSubtext>
        <ButtonContainer>
          <Button title="Back" small onPress={this.props.back} />
          <Button title="Finish" small primary onPress={this.props.next} />
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
