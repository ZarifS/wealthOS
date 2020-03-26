import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Colors } from '../theme';
import AuthScreen from '../containers/authScreen';
import SplashScreen from '../containers/splashScreen';
import HomeScreen from '../containers/homeScreen';

/**
 * The root screen contains the application's navigation.
 *
 * @see https://reactnavigation.org/docs/en/hello-react-navigation.html#creating-a-stack-navigator
 */
const StackNavigator = createStackNavigator(
  {
    // Create the application routes here (the key is the route name, the value is the target screen)
    // See https://reactnavigation.org/docs/en/stack-navigator.html#routeconfigs
    SplashScreen: {
      screen: SplashScreen,
      navigationOptions: { headerShown: false },
    },
    AuthScreen: {
      screen: AuthScreen,
      navigationOptions: { headerShown: false },
    },
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: { title: 'Dashboard' },
    },
  },
  {
    // By default the application will show the splash screen
    initialRouteName: 'SplashScreen',
    // See https://reactnavigation.org/docs/en/stack-navigator.html#stacknavigatorconfig
    headerMode: 'float',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: `${Colors.surface}`,
      },
      headerTitleStyle: {
        color: `${Colors.onSurface}`,
        fontWeight: 'bold',
        textTransform: 'uppercase',
      },
    },
  }
);

export default createAppContainer(StackNavigator);
