import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Button from '../components/button';
import { Colors, Fonts } from '../theme';

class HomeScreen extends Component {
  componentDidMount() {
    // Get user data.
  }

  getData() {
    alert('Getting data...');
  }

  render() {
    return (
      <Screen>
        <Container>
          <Header>Balances</Header>
          <StyledText>Net Worth:</StyledText>
          <Button title="Get Data" primary onPress={this.getData} />
        </Container>
      </Screen>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
});

export default connect(mapStateToProps)(HomeScreen);

const Screen = styled.SafeAreaView`
  background-color: ${Colors.background};
  display: flex;
  flex: 1;
`;

const Container = styled.View`
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
`;

const Header = styled.Text`
  color: ${Colors.onSurface};
  font-size: ${Fonts.large};
  font-weight: bold;
`;

const StyledText = styled.Text`
  color: ${Colors.onSurface};
  font-size: ${Fonts.regular};
`;
