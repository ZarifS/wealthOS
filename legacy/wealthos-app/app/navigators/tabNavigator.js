import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../theme';
import {
  TransactionsStack,
  AccountsStack,
  DashboardStack,
  BudgetsStack,
  ProfileStack,
} from './stackNavigators';

/**
 * The main app navigation method allowing the user to tab around the app. Each page has its own stack navigation for nested items.
 */

export default createBottomTabNavigator(
  {
    Transactions: {
      screen: TransactionsStack,
      navigationOptions: {
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ focused, tintColor: color }) => <Icon name="sync" size={22} color={color} />,
      },
    },
    Accounts: {
      screen: AccountsStack,
      navigationOptions: {
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ focused, tintColor: color }) => (
          <Icon name="wallet" size={22} color={color} />
        ),
      },
    },
    Dashboard: {
      screen: DashboardStack,
      navigationOptions: {
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ focused, tintColor: color }) => (
          <Icon name="compass" size={22} color={color} solid />
        ),
      },
    },
    Budgets: {
      screen: BudgetsStack,
      navigationOptions: {
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ focused, tintColor: color }) => (
          <Icon name="piggy-bank" size={22} color={color} solid />
        ),
      },
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ focused, tintColor: color }) => (
          <Icon name="user" size={22} color={color} solid />
        ),
      },
    },
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
