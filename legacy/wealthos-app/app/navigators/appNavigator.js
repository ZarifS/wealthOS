import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AuthScreen from '../containers/authScreen';
import RegisterScreen from '../containers/registerScreen';
import SplashScreen from '../containers/splashScreen';
import { StackConfig } from './stackNavigators';
import TabNavigator from './tabNavigator';

/**
 * The root screen contains the application's navigation.
 *
 * @see https://reactnavigation.org/docs/en/hello-react-navigation.html#creating-a-stack-navigator
 */

const MainStackNavigator = createStackNavigator(
  {
    // Create the application routes here (the key is the route name, the value is the target screen)
    // See https://reactnavigation.org/docs/en/stack-navigator.html#routeconfigs
    AuthScreen: {
      screen: AuthScreen,
      navigationOptions: { headerShown: false },
    },
    RegisterScreen: {
      screen: RegisterScreen,
      navigationOptions: {
        title: 'Sign Up',
      },
    },
    SplashScreen: {
      screen: SplashScreen,
      navigationOptions: { headerShown: false },
    },
    Main: { screen: TabNavigator, navigationOptions: { headerShown: false } },
  },
  StackConfig
);

export default createAppContainer(MainStackNavigator);
