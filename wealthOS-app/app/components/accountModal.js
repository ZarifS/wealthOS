import React, { Component } from 'react';
import styled from 'styled-components';
import Button from './button';
import Divider from './divider';
import LinkModule from './linkModule';
import { Colors, Fonts } from '../theme';

export default class AccountsModal extends Component {
  render() {
    return (
      <StyledAccountModal>
        <StyledHeading>Add an Account</StyledHeading>
        <StyledText>Which type of account do you want to add?</StyledText>
        <AccountTypesContainer>
          <AccountType>
            <LinkModule onSuccess={this.props.linkAccount}></LinkModule>
            <StyledAccountsText>
              Synched account(s) from a institution. Updated automatically. Great for spending and
              investment accounts. Limit of 5 institutions.
            </StyledAccountsText>
          </AccountType>
          <Divider tight secondary></Divider>
          <AccountType>
            <Button title="Manual" secondary small onPress={() => this.props.manualAccount()} />
            <StyledAccountsText>
              Great to keep track of Cash, Student Loans, Mortgages etc. which don't get updated
              often but will need to be updated manually. No limit.
            </StyledAccountsText>
          </AccountType>
        </AccountTypesContainer>
      </StyledAccountModal>
    );
  }
}

const StyledAccountModal = styled.View`
  display: flex;
  background-color: ${Colors.surface};
  height: 400px;
  align-items: center;
  border-radius: 4px;
`;

const StyledHeading = styled.Text`
  color: ${Colors.onSurface};
  font-size: ${Fonts.large};
  font-weight: bold;
  width: 100%;
  text-align: center;
  padding-bottom: 15px;
  padding-top: 20px;
`;

const AccountTypesContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const AccountType = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const StyledText = styled.Text`
  color: ${Colors.onSurface};
  font-size: ${Fonts.regular};
`;

const StyledAccountsText = styled.Text`
  color: ${Colors.onSurface};
  font-size: ${Fonts.small};
  max-width: 300px;
  margin-top: 10px;
`;
