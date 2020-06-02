import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { ActivityIndicator } from 'react-native';
import NAVIGATION from '../services/navigation';
import { actions as UserActions } from '../redux/actions/user';
import BalanceCard from '../components/balanceCard';
import Button from '../components/button';
import { Colors, Fonts } from '../theme';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountModal: true,
    };
    console.log(this.props);
  }

  componentDidMount() {
    // Fetch user data
    console.log('Data was Refreshed.');
    this.props.dispatch(UserActions.fetchUser(this.props.token));
  }

  refreshData = () => {
    this.props.dispatch(UserActions.fetchUser(this.props.token));
  };

  toggleModal = () => {
    //pop up modal
    this.setState({ accountModal: !this.state.accountModal });
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
      // eslint-disable-next-line react-native/no-inline-styles
      <Container contentContainerStyle={{ paddingBottom: 60 }}>
        <Header>Balances</Header>
        <Balances>{balanceCards}</Balances>
        <ButtonsContainer>
          <Button title="Add Account" onPress={this.toggleModal} />
          <Button title="Refresh Data" primary onPress={this.refreshData} />
          <Button title="Log Back In" secondary onPress={this.logBackIn} />
        </ButtonsContainer>
        <Modal
          isVisible={this.state.accountModal}
          onBackdropPress={() => this.toggleModal()}
          animationIn={'fadeIn'}
          animationOut={'fadeOut'}
        >
          <AccountModal>
            <StyledHeading>Add an Account</StyledHeading>
            <ButtonsContainerModal>
              <Button title="Manual" secondary small onPress={this.logBackIn} />
              <Button title="Linked" primary small onPress={this.logBackIn} />
            </ButtonsContainerModal>
          </AccountModal>
        </Modal>
      </Container>
    );
    return <Screen>{this.props.userIsLoading ? spinner : content}</Screen>;
  }
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  userIsLoading: state.user.fetchUserIsLoading,
  user: state.user.user,
  accounts: state.user.accounts,
});

export default connect(mapStateToProps)(HomeScreen);

const Screen = styled.SafeAreaView`
  background-color: ${Colors.background};
  display: flex;
  flex: 1;
  padding-top: 10px;
  align-items: center;
  justify-content: center;
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

const AccountModal = styled.View`
  display: flex;
  background-color: ${Colors.surface};
  height: 120px;
  align-items: center;
  border-radius: 4px;
  justify-content: center;
`;

const StyledHeading = styled.Text`
  color: ${Colors.onSurface};
  font-size: ${Fonts.large};
  width: 100%;
  text-align: center;
  padding-bottom: 15px;
`;

const ButtonsContainerModal = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
