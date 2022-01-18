import React, { Component } from 'react';
import styled from 'styled-components';
import { Colors } from '../theme';

export default class Divider extends Component {
  render() {
    return <StyledDivider tight={this.props.tight}></StyledDivider>;
  }
}

const StyledDivider = styled.View`
  background-color: ${(props) => (props.secondary ? `10px` : Colors.onBackground)};
  width: 24px;
  height: 4px;
  margin-top: ${(props) => (props.tight ? `15px` : '40px')};
  margin-bottom: ${(props) => (props.tight ? `15px` : '40px')};
`;
