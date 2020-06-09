import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { ActivityIndicator } from 'react-native';
import NAVIGATION from '../services/navigation';
import API from '../services/api';
import { actions as UserActions } from '../redux/actions/user';
import BalanceCard from '../components/balanceCard';
import Button from '../components/button';
import AddAccountsModal from '../components/addAccountsModal';
import ErrorModal from '../components/errorModal';
import { Colors, Fonts } from '../theme';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountsModal: false,
      errorMessage: '',
      errorModal: false,
    };
  }

  componentDidMount() {
    // Fetch user data
    console.log('Data is being refreshed.');
    this.props.dispatch(UserActions.fetchUser(this.props.token));
  }

  refreshData = () => {
    this.props.dispatch(UserActions.fetchUser(this.props.token));
  };

  toggleModal = (modal) => {
    this.setState({ [modal]: !this.state[modal] });
  };

  logBackIn() {
    NAVIGATION.navigate('AuthScreen');
  }

  linkAccount = async (data) => {
    // To-DO Move API call to a saga and redux
    try {
      const { public_token, institution } = data;
      const institutionName = institution.name;
      await API.linkUser(this.props.token, public_token, institutionName);
      this.toggleModal('accountsModal');
      alert('Successfully linked!');
    } catch (error) {
      // To-DO Change to error message from server
      this.setState({
        errorMessage:
          'There was an issue linking your account to the institution. Please try again or contact us for help.',
      });
      this.toggleModal('accountsModal');
    }
  };

  manualAccount = () => {
    alert('Creating Manual Account');
  };

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
          <Button title="Add Account" onPress={() => this.toggleModal('accountsModal')} />
          <Button title="Refresh Data" primary onPress={this.refreshData} />
          <Button title="Log Back In" secondary onPress={this.logBackIn} />
        </ButtonsContainer>
        <ModalForAccounts
          isVisible={this.state.accountsModal}
          onBackdropPress={() => this.toggleModal('accountsModal')}
          onModalHide={() => {
            if (this.state.errorMessage !== '') {
              this.toggleModal('errorModal');
            }
          }}
          onModalShow={() => this.setState({ errorMessage: '' })}
        >
          <AddAccountsModal
            linkAccount={this.linkAccount}
            manualAccount={this.manualAccount}
            toggleModal={this.toggleModal}
          ></AddAccountsModal>
        </ModalForAccounts>
        <ModalForError
          isVisible={this.state.errorModal}
          onBackdropPress={() => this.toggleModal('errorModal')}
          animationIn={'fadeIn'}
          animationOut={'fadeOut'}
        >
          <ErrorModal
            errorTitle={'Link Error'}
            errorMessage={this.state.errorMessage}
            renderHelp
          ></ErrorModal>
        </ModalForError>
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
  userErrorMessage: state.user.userErrorMessage,
});

export default connect(mapStateToProps)(HomeScreen);

const Screen = styled.SafeAreaView`
  background-color: ${Colors.background};
  display: flex;
  flex: 1;
  padding-top: 10px;
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

const ModalForAccounts = styled(Modal)`
  justify-content: flex-end;
  margin: 0;
`;

const ModalForError = styled(Modal)``;

const ErrorContainer = styled.View`
  display: flex;
  background-color: ${Colors.surface};
  height: 140px;
  align-items: center;
  padding: 20px;
  justify-content: center;
  border-radius: 4px;
`;

const StyledErrorText = styled.Text`
  color: ${Colors.onSurface};
  font-size: ${Fonts.medium};
  text-align: center;
  margin-bottom: 15px;
`;
