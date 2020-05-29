import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import AnimatedMultistep from 'react-native-animated-multistep';
import { actions as AuthActions } from '../redux/actions/auth';
import { Colors, Fonts } from '../theme';
import NameForm from './registrationForms/nameForm';
import EmailForm from './registrationForms/emailForm';
import PasswordForm from './registrationForms/passwordForm';
import SubmitForm from './registrationForms/submitForm';
import ErrorScreen from './registrationForms/errorScreen';
import { TermsForm, PrivacyForm } from './registrationForms/tocForm';

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWizard: true,
    };
  }

  componentDidMount() {
    this.props.dispatch(AuthActions.registrationBegin());
  }

  /* define the method to be called when the wizard is finished */
  finish = (finalState) => {
    // console.log(finalState);
    // const { firstName, lastName, email, password } = finalState;
    const firstName = 'Zarif';
    const lastName = 'Shahriar';
    const email = 'Zarif.Shahriar@gmail.com';
    const password = 'password';
    this.props.dispatch(AuthActions.registerUser(firstName, lastName, email, password, password));
    this.setState({ showWizard: false });
  };

  render() {
    const errorMessages = this.props.registrationErrorMessage.map((error) => (
      <ErrorChip key="1">
        <StyledErrorText>{error}</StyledErrorText>
      </ErrorChip>
    ));
    return (
      <Screen>
        {this.props.showRegistration && (
          <AnimatedMultistep
            steps={allSteps}
            comeInOnNext="fadeInLeft"
            OutOnNext="fadeOutRight"
            comeInOnBack="fadeInRight"
            OutOnBack="fadeOut"
            onFinish={this.finish}
          />
        )}
        {this.props.registrationErrorMessage.length > 0 && (
          <ErrorScreen errorMessages={errorMessages}></ErrorScreen>
        )}
        {/* {this.props.registrationSuccess && (
          <StyledText>You've been successfully registered! Please go back to log in!</StyledText>
        )}
        {this.props.registrationIsLoading && (
          <IndicatorContainer>
            <ActivityIndicator size="large" color={Colors.primary} />
          </IndicatorContainer>
        )} */}
      </Screen>
    );
  }
}

const mapStateToProps = (state) => ({
  registrationIsLoading: state.auth.registrationIsLoading,
  // registrationErrorMessage: ['Email is already registered.'],
  registrationErrorMessage: state.auth.registrationErrorMessage,
  showRegistration: state.auth.showRegistration,
  registrationSuccess: state.auth.registrationSuccess,
});

export default connect(mapStateToProps)(RegisterScreen);

const allSteps = [
  // { name: 'step 1', component: NameForm },
  { name: 'step 2', component: EmailForm },
  { name: 'step 3', component: PasswordForm },
  { name: 'step 6', component: SubmitForm },
];

const Screen = styled.SafeAreaView`
  background-color: ${Colors.background};
  display: flex;
  flex: 1;
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

const ErrorChip = styled.View`
  padding: 10px;
  border-radius: 50px;
`;

const StyledErrorText = styled.Text`
  font-size: ${Fonts.medium};
  color: ${Colors.error};
  text-align: center;
`;

const StyledText = styled.Text`
  font-size: ${Fonts.regular};
  color: ${Colors.onBackground};
  margin-bottom: 10px;
  text-align: center;
`;
