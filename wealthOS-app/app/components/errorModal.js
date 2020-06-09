import React, { Component } from 'react';
import styled from 'styled-components';
import Button from './button';
import { Colors, Fonts } from '../theme';

export default class ErrorModal extends Component {
  render() {
    return (
      <StyledModal>
        <StyledHeading>{this.props.errorTitle}</StyledHeading>
        <StyledErrorText>{this.props.errorMessage}</StyledErrorText>
        {this.props.renderHelp && <Button title="Help" small />}
      </StyledModal>
    );
  }
}

const StyledModal = styled.View`
  display: flex;
  background-color: ${Colors.surface};
  height: 170px;
  align-items: center;
  border-radius: 4px;
`;

const StyledHeading = styled.Text`
  color: ${Colors.error};
  font-size: ${Fonts.large};
  font-weight: bold;
  width: 100%;
  text-align: center;
  padding-bottom: 15px;
  padding-top: 20px;
`;

const StyledErrorText = styled.Text`
  color: ${Colors.onSurface};
  font-size: ${Fonts.medium};
  text-align: center;
  margin-bottom: 15px;
  max-width: 330px;
`;
