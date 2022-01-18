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
import SuccessScreen from './registrationForms/successScreen';
import { TermsForm } from './registrationForms/tocForm';

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
    const { firstName, lastName, email, password } = finalState;
    this.props.dispatch(AuthActions.registerUser(firstName, lastName, email, password, password));
    this.setState({ showWizard: false });
  };

  render() {
    const errorMessages = this.props.registrationErrorMessage.map((error) => (
      <StyledErrorText key="1">{error}</StyledErrorText>
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
        {this.props.registrationSuccess && <SuccessScreen></SuccessScreen>}
        {this.props.registrationIsLoading && (
          <IndicatorContainer>
            <ActivityIndicator size="large" color={Colors.primary} />
          </IndicatorContainer>
        )}
      </Screen>
    );
  }
}

const mapStateToProps = (state) => ({
  registrationIsLoading: state.auth.registrationIsLoading,
  registrationErrorMessage: state.auth.registrationErrorMessage,
  showRegistration: state.auth.showRegistration,
  registrationSuccess: state.auth.registrationSuccess,
});

export default connect(mapStateToProps)(RegisterScreen);

const allSteps = [
  { name: 'step 1', component: NameForm },
  { name: 'step 2', component: EmailForm },
  { name: 'step 3', component: PasswordForm },
  { name: 'step 4', component: TermsForm },
  { name: 'step 5', component: SubmitForm },
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

const StyledErrorText = styled.Text`
  font-size: ${Fonts.medium};
  color: ${Colors.error};
  text-align: center;
  padding: 10px;
`;
