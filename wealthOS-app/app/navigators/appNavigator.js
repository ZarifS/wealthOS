import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../theme';
import AuthScreen from '../containers/authScreen';
import SplashScreen from '../containers/splashScreen';
import HomeScreen from '../containers/homeScreen';
import ProfileScreen from '../containers/profileScreen';
import AccountsScreen from '../containers/accountsScreen';
import BudgetsScreen from '../containers/budgetsScreen';
import TransactionsScreen from '../containers/transactionsScreen';

/**
 * The root screen contains the application's navigation.
 *
 * @see https://reactnavigation.org/docs/en/hello-react-navigation.html#creating-a-stack-navigator
 */

/**
 * Config options for stacks such as header
 */
const StackConfig = {
  headerMode: 'float',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: `${Colors.surface}`,
      borderBottomColor: `transparent`,
      shadowColor: 'black',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 4,
    },
    headerTitleStyle: {
      color: `${Colors.onSurface}`,
      fontSize: 16,
    },
  },
};

const DashboardStack = createStackNavigator(
  {
    DashboardScreen: {
      screen: HomeScreen,
      navigationOptions: { title: 'Dashboard' },
    },
  },
  StackConfig
);

const ProfileStack = createStackNavigator(
  {
    ProfileScreen: {
      screen: ProfileScreen,
      navigationOptions: { title: 'Profile' },
    },
  },
  StackConfig
);

const AccountsStack = createStackNavigator(
  {
    AccountsScreen: {
      screen: AccountsScreen,
      navigationOptions: { title: 'Accounts' },
    },
  },
  StackConfig
);

const TransactionsStack = createStackNavigator(
  {
    TransactionsScreen: {
      screen: TransactionsScreen,
      navigationOptions: { title: 'Transactions' },
    },
  },
  StackConfig
);

const BudgetsStack = createStackNavigator(
  {
    BudgetsScreen: {
      screen: BudgetsScreen,
      navigationOptions: { title: 'Budgets' },
    },
  },
  StackConfig
);

const TabNavigator = createBottomTabNavigator(
  {
    Transactions: {
      screen: TransactionsStack,
      navigationOptions: {
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ focused, tintColor: color }) => (
          <Icon name="comment" size={30} color={color} solid />
        ),
      },
    },
    Accounts: {
      screen: AccountsStack,
      navigationOptions: {
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ focused, tintColor: color }) => (
          <Icon name="comment" size={30} color={color} />
        ),
      },
    },
    Dashboard: {
      screen: DashboardStack,
      navigationOptions: {
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ focused, tintColor: color }) => (
          <Icon name="comment" size={30} color={color} solid />
        ),
      },
    },
    Budgets: BudgetsStack,
    Profile: ProfileStack,
  },
  {
    initialRouteName: 'Dashboard',
    tabBarOptions: {
      activeTintColor: `${Colors.primary}`,
      labelStyle: {
        fontSize: 10,
        textAlign: 'center',
      },
      style: {
        backgroundColor: `${Colors.surface}`,
        borderTopColor: `transparent`,
        height: 60,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -5 },
        shadowRadius: 4,
      },
    },
  }
);

const MainStackNavigator = createStackNavigator(
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
    Main: { screen: TabNavigator, navigationOptions: { headerShown: false } },
    // See https://reactnavigation.org/docs/
  },
  { initialRouteName: 'Main' }
);

export default createAppContainer(MainStackNavigator);
