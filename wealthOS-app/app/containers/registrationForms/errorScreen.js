import React, { Component } from 'react';
import styled from 'styled-components';
import { Colors, Fonts } from '../../theme';
import NavigationService from '../../services/navigation';
import Divider from '../../components/divider';
import Button from '../../components/button';

export default class ErrorScreen extends Component {
  render() {
    return (
      <StyledErrorScreen>
        <ErrorContainer>
          <StyledText>
            Sorry it looks like there were some issues with your registration.
          </StyledText>
          {this.props.errorMessages}
          <Divider></Divider>
          <ButtonContainer>
            <Button title="Back" small onPress={() => NavigationService.navigate('AuthScreen')} />
          </ButtonContainer>
        </ErrorContainer>
      </StyledErrorScreen>
    );
  }
}

const StyledErrorScreen = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 100%;
`;

const ErrorContainer = styled.View`
  width: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  margin-bottom: 50px;
  justify-content: space-around;
`;

const StyledText = styled.Text`
  font-size: ${Fonts.regular};
  color: ${Colors.onBackground};
  margin-bottom: 10px;
  text-align: center;
`;
