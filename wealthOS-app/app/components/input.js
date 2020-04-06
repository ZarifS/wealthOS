import React, { Component } from 'react';
import styled from 'styled-components';
import { Colors, Fonts } from '../theme';

export default class Input extends Component {
  render() {
    return (
      <StyledInput
        value={this.props.value}
        placeholder={this.props.placeholder}
        onChangeText={(val) => {
          this.props.onChangeText(this.props.name, val);
        }}
        secureTextEntry={this.props.secureTextEntry}
        placeholderTextColor={Colors.onSurface}
      />
    );
  }
}

const StyledInput = styled.TextInput`
  background-color: ${Colors.surface};
  color: ${Colors.onSurface};
  padding-left: 20px;
  width: 295px;
  height: 48px;
  margin: 5px;
  border-radius: 30px;
  font-size: ${Fonts.medium};
`;
