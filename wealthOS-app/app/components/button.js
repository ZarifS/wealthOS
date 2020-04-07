import React, { Component } from 'react';
import styled from 'styled-components';
import { Colors, Fonts } from '../theme';

export default class Button extends Component {
  render() {
    return (
      <StyledButton
        onPress={this.props.onPress}
        primary={this.props.primary}
        small={this.props.small}
      >
        <StyledText>{this.props.title}</StyledText>
      </StyledButton>
    );
  }
}

const StyledButton = styled.TouchableOpacity`
  background-color: ${(props) => (props.primary ? Colors.primary : 'transparent')};
  border: ${(props) => (props.primary ? 'none' : `1px solid ${Colors.secondary}`)};
  color: ${Colors.onSurface};
  width: ${(props) => (props.small ? `120px` : `295px`)};
  height: ${(props) => (props.small ? `35px` : `48px`)};
  margin: 5px;
  border-radius: 30px;
  font-size: ${Fonts.medium};
  display: flex;
  justify-content: center;
`;

const StyledText = styled.Text`
  color: ${Colors.onBackground};
  font-size: ${Fonts.regular};
  text-align: center;
`;
