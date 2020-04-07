import React from 'react';
import styled from 'styled-components';
import AnimatedMultistep from 'react-native-animated-multistep';
import { Colors, Fonts } from '../theme';
import Input from '../components/input';
import Button from '../components/button';

export default class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  render() {
    return (
      <Screen>
        <AnimatedMultistep steps={allSteps} />
      </Screen>
    );
  }
}

class StepOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
    };
  }

  nextStep = () => {
    const { next, saveState } = this.props;
    // Save state for use in other steps
    saveState(this.state);
    // Go to next step
    next();
  };

  render() {
    return (
      <InputContainer>
        <StyledText>Whats your name?</StyledText>
        <Input
          placeholder="First name"
          value={this.state.firstName}
          onChangeText={(text) => this.setState({ firstName: text })}
        />
        <Input placeholder="Last name" onChangeText={(text) => this.setState({ lastName: text })} />
        <ButtonContainer>
          <Button title="Next" small primary onPress={this.nextStep} />
        </ButtonContainer>
      </InputContainer>
    );
  }
}

class StepTwo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  nextStep = () => {
    const { next, saveState } = this.props;
    // Save state for use in other steps
    saveState(this.state);
    // Go to next step
    next();
  };

  render() {
    return (
      <InputContainer>
        <StyledText>Whats your email?</StyledText>
        <Input
          placeholder="Email"
          value={this.state.firstName}
          onChangeText={(text) => this.setState({ email: text })}
        />
        <ButtonContainer>
          <Button title="Back" small onPress={this.props.back} />
          <Button title="Next" small primary onPress={this.nextStep} />
        </ButtonContainer>
      </InputContainer>
    );
  }
}

const allSteps = [
  { name: 'step 1', component: StepOne },
  { name: 'step 2', component: StepTwo },
];

const Screen = styled.SafeAreaView`
  background-color: ${Colors.background};
  display: flex;
  flex: 1;
`;

const InputContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  justify-content: space-around;
`;

const StyledText = styled.Text`
  font-size: ${Fonts.regular};
  color: ${Colors.onBackground};
  margin-bottom: 10px;
`;
