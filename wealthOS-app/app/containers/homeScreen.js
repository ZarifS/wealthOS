import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import NAVIGATION from '../services/navigation';
import { actions as UserActions } from '../redux/actions/user';
import BalanceCard from '../components/balanceCard';
import Button from '../components/button';
import { Colors, Fonts } from '../theme';

class HomeScreen extends Component {
  componentDidMount() {
    // Fetch user data
    this.props.dispatch(UserActions.fetchUser(this.props.token));
  }

  refreshData = () => {
    this.props.dispatch(UserActions.fetchUser(this.props.token));
  };

  logBackIn() {
    NAVIGATION.navigate('AuthScreen');
  }

  render() {
    const spinner = (
      <IndicatorContainer>
        <StyledText>Getting the latest numbers...</StyledText>
        <ActivityIndicator size="large" color={Colors.primary} />
      </IndicatorContainer>
    );
    const balanceCards = this.props.accounts.map((account) => {
      return (
        <BalanceCard
          key={account.accountID}
          name={account.name}
          balance={account.balance}
          mask={account.mask}
          lastUpdated="Today"
        />
      );
    });
    const content = (
      <Container>
        <Header>Balances</Header>
        <Balances>{balanceCards}</Balances>
        <ButtonsContainer>
          <Button title="Refresh Data" primary onPress={this.refreshData} />
          <Button title="Log Back In" secondary onPress={this.logBackIn} />
        </ButtonsContainer>
      </Container>
    );
    return <Screen>{this.props.userIsLoading ? spinner : content}</Screen>;
  }
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  userIsLoading: state.user.fetchUserIsLoading,
  user: state.user.user,
  accounts: state.user.user.accounts.CIBC,
});

export default connect(mapStateToProps)(HomeScreen);

const Screen = styled.SafeAreaView`
  background-color: ${Colors.background};
  display: flex;
  flex: 1;
`;

const StyledText = styled.Text`
  color: ${Colors.onBackground};
`;

const Container = styled.ScrollView`
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 10px;
`;

const Header = styled.Text`
  color: ${Colors.onSurface};
  font-size: ${Fonts.large};
  font-weight: bold;
`;

const ButtonsContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
`;

const Balances = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const IndicatorContainer = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  align-items: center;
  justify-content: center;
`;
