import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Colors, Fonts } from '../theme';

class HomeScreen extends Component {
  componentDidMount() {
    // Get user data.
  }

  render() {
    return (
      <Container>
        <Card>
          <StyledText>Account Info</StyledText>
        </Card>
        <Card>
          <StyledText>Link an Account</StyledText>
        </Card>
        <Card>
          <StyledText>Transactions</StyledText>
        </Card>
        <Card>
          <StyledText>Balances</StyledText>
        </Card>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
});

export default connect(mapStateToProps)(HomeScreen);

const Container = styled.View`
  align-items: center;
  align-content: center;
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
  background-color: ${Colors.background};
`;

const Card = styled.View`
  background-color: ${Colors.surface};
  width: 350;
  height: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5;
  margin-bottom: 5;
`;

const StyledText = styled.Text`
  color: ${Colors.onSurface};
  font-size: ${Fonts.h3};
`;
