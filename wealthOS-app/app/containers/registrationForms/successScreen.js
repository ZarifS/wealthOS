import React, { Component } from 'react';
import styled from 'styled-components';
import { Colors, Fonts } from '../../theme';
import NavigationService from '../../services/navigation';
import Divider from '../../components/divider';
import Button from '../../components/button';

export default class SuccessScreen extends Component {
  render() {
    return (
      <StyledSuccessScreen>
        <SuccessContainer>
          <StyledText>
            {"You've been successfully registered! Please sign in to continue."}
          </StyledText>
          <Divider></Divider>
          <ButtonContainer>
            <Button
              title="Okay"
              small
              primary
              onPress={() => NavigationService.navigate('AuthScreen')}
            />
          </ButtonContainer>
        </SuccessContainer>
      </StyledSuccessScreen>
    );
  }
}

const StyledSuccessScreen = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 100%;
`;

const SuccessContainer = styled.View`
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
