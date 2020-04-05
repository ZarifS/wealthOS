import React from 'react';
import styled from 'styled-components';
import { Colors } from '../theme';

export default class TransactionsScreen extends React.Component {
  render() {
    return (
      <Container>
        <Logo>Transactions Screen</Logo>
      </Container>
    );
  }
}

const Container = styled.View`
  display: flex;
  flex: 1;
  align-items: center;
  background-color: ${Colors.background};
  justify-content: center;
`;

const Logo = styled.Text`
  color: ${Colors.onBackground};
  font-size: 34px;
`;
