import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import NFTScreen from '../../screens/NFTScreen';
import CreateChallenge from '../CreateChallenge';
import SignupScreen from '../../screens/SignupScreen';
import BottomTabIcon from './BottomTabIcon';
import LoginScreen from '../../screens/LoginScreen';
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const screenOptions = ({route}) => ({
    headerShown: false,
    tabBarShowLabel: false,
    tabBarIcon: ({focused}) => (
      <BottomTabIcon title={route.name} focused={focused} />
    ),
  });

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="LoginScreen" component={LoginScreen} />
      <Tab.Screen name="UserScreen" component={NFTScreen} />
      <Tab.Screen name="ChallengeScreen" component={CreateChallenge} />
      <Tab.Screen name="SignupScreen" component={SignupScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
