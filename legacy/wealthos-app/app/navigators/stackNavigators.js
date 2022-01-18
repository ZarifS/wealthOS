import { createStackNavigator } from 'react-navigation-stack';
import { Colors } from '../theme';
import HomeScreen from '../containers/homeScreen';
import ProfileScreen from '../containers/profileScreen';
import AccountsScreen from '../containers/accountsScreen';
import BudgetsScreen from '../containers/budgetsScreen';
import TransactionsScreen from '../containers/transactionsScreen';

/**
 * Config options for stacks such as header
 */
export const StackConfig = {
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
    headerTintColor: `${Colors.primary}`,
    headerTitleStyle: {
      color: `${Colors.onBackground}`,
      fontSize: 16,
    },
  },
};

export const DashboardStack = createStackNavigator(
  {
    DashboardScreen: {
      screen: HomeScreen,
      navigationOptions: { title: 'Dashboard' },
    },
  },
  StackConfig
);

export const ProfileStack = createStackNavigator(
  {
    ProfileScreen: {
      screen: ProfileScreen,
      navigationOptions: { title: 'Profile' },
    },
  },
  StackConfig
);

export const AccountsStack = createStackNavigator(
  {
    AccountsScreen: {
      screen: AccountsScreen,
      navigationOptions: { title: 'Accounts' },
    },
  },
  StackConfig
);

export const TransactionsStack = createStackNavigator(
  {
    TransactionsScreen: {
      screen: TransactionsScreen,
      navigationOptions: { title: 'Transactions' },
    },
  },
  StackConfig
);

export const BudgetsStack = createStackNavigator(
  {
    BudgetsScreen: {
      screen: BudgetsScreen,
      navigationOptions: { title: 'Budgets' },
    },
  },
  StackConfig
);
