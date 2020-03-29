import React, { Component } from 'react';
import styled from 'styled-components';
import { Colors } from '../theme';

export default class Divider extends Component {
  render() {
    return <StyledDivider></StyledDivider>;
  }
}

const StyledDivider = styled.View`
  background-color: ${Colors.surface};
  width: 24px;
  height: 4px;
  margin-top: 40px;
  margin-bottom: 40px;
`;
