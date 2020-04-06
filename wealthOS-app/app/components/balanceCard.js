import React, { Component } from 'react';
import styled from 'styled-components';
import { Colors, Fonts } from '../theme';

export default class BalanceCard extends Component {
  render() {
    return (
      <Card color={this.props.color}>
        <Container>
          <AccountInfo>
            <Name>{this.props.name}</Name>
            <Mask>**** **** {this.props.mask}</Mask>
            <Date>Last Updated: {this.props.lastUpdated}</Date>
          </AccountInfo>
          <Balance>${this.props.balance}</Balance>
        </Container>
      </Card>
    );
  }
}

const Card = styled.View`
  width: 100%;
  height: 100px;
  background-color: ${(props) => (props.color ? props.color : `${Colors.surface}`)};
  display: flex;
  padding: 10px;
  justify-content: center;
  box-shadow: 0px -4px 4px rgba(0, 0, 0, 0.1);
`;

const AccountInfo = styled.View``;

const Container = styled.View`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

const Balance = styled.Text`
  color: ${Colors.onBackground};
  font-size: ${Fonts.large};
  font-weight: 400;
`;

const Name = styled.Text`
  color: ${Colors.onBackground};
  font-size: ${Fonts.regular};
  font-weight: bold;
  margin-bottom: 5px;
`;

const Mask = styled.Text`
  color: ${Colors.onBackground};
  font-size: ${Fonts.medium};
  margin-bottom: 5px;
  font-weight: 300;
`;

const Date = styled.Text`
  color: ${Colors.onBackground};
  font-size: ${Fonts.small};
`;
