import React from 'react';
import styled from 'styled-components';
import { Colors } from '../theme';

export default class SplashScreen extends React.Component {
  render() {
    return (
      <Container>
        <Logo>
          wealth<Accent>OS</Accent>
        </Logo>
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

const Accent = styled.Text`
  color: ${Colors.primary};
`;
