import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Colors } from '../theme';
import AuthScreen from '../containers/authScreen';
import SplashScreen from '../containers/splashScreen';
import HomeScreen from '../containers/homeScreen';

/**
 * The root screen contains the application's navigation.
 *
 * @see https://reactnavigation.org/docs/en/hello-react-navigation.html#creating-a-stack-navigator
 */

const SplashStack = createStackNavigator({
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
  initialRouteName: 'SplashScreen',
  headerMode: 'float',
  // See https://reactnavigation.org/docs/
});

const HomeStack = createStackNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: { headerShown: true, title: 'Dashboard' },
    },
  },
  {
    // By default the application will show the splash screen
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

const TabNavigator = createBottomTabNavigator(
  {
    Splash: { screen: SplashStack, navigationOptions: { tabBarVisible: false } },
    Home: HomeStack,
  },
  {
    tabBarOptions: {
      activeTintColor: `${Colors.primary}`,
      labelStyle: {
        fontSize: 12,
      },
      style: {
        backgroundColor: `${Colors.surface}`,
        borderTopColor: `transparent`,
        height: 40,
      },
    },
  }
);

export default createAppContainer(TabNavigator);
