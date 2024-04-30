import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ChallengeScreen from '../../screens/ChallengeScreen';
import {useWindowDimensions} from 'react-native';
import {isTablet} from '../../util/util';
import GlobalStyles from '../../constants/GlobalStyles';
import CreateUserChallenge from '../CreateUserChallenge';
import CreateChallenge from '../CreateChallenge';
import SignupScreen from '../../screens/SignupScreen';
import UserScreen from '../../screens/UserScreen';
import LoginScreen from '../../screens/LoginScreen';
import ImageDetail from '../../screens/ImageDetail';
import NftMinter from '../NftMinter';
import {Header} from '../Header';
const BottomTabs = createBottomTabNavigator();
const setTabBarVisible = name => {
  switch (name) {
    case 'GameBoardScreen':
      return 'none';
    case 'GameCategoryScreen':
      return 'none';
    case 'GameQuizScreen':
      return 'none';
    default:
      return 'flex';
  }
};

function TabsNavigator() {
  const screenSize = useWindowDimensions();
  return (
    <BottomTabs.Navigator
      screenOptions={({route}) => {
        const options = {
          headerStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            borderTopColor: 'rgba(0, 0, 0, 0.9)',
            borderBottomColor: 'rgba(0, 0, 0, 0.9)',
            borderLeftColor: 'rgba(0, 0, 0, 0.9)',
            borderRightColor: 'rgba(0, 0, 0, 0.9)',
            height: isTablet(screenSize.width, screenSize.height)
              ? hp('25')
              : wp('20'),
          },
          headerTitleStyle: {
            fontSize: isTablet(screenSize.width, screenSize.height)
              ? hp('10')
              : wp('8'),
          },
          headerTitleAlign: 'center',
          headerTintColor: GlobalStyles.colors.primary30,
          tabBarStyle: {
            borderTopWidth: 2,
            borderTopColor: GlobalStyles.colors.primary400,
            borderBottomWidth: 2,
            borderBottomColor: GlobalStyles.colors.primary400,
            borderLeftWidth: 2,
            borderLeftColor: GlobalStyles.colors.primary400,
            borderRightWidth: 2,
            borderRightColor: GlobalStyles.colors.primary400,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: setTabBarVisible(route?.name),
            paddingTop: isTablet(screenSize.width, screenSize.height)
              ? hp('1')
              : wp('2'),
            paddingBottom: isTablet(screenSize.width, screenSize.height)
              ? hp('2')
              : wp('4'),
            height: isTablet(screenSize.width, screenSize.height)
              ? hp('8')
              : wp('20'),
          },
          tabBarLabelStyle: {
            fontSize: isTablet(screenSize.width, screenSize.height)
              ? hp('1.5')
              : wp('3.5'),
          },
          tabBarLabelPosition: 'below-icon',
          tabBarActiveTintColor: GlobalStyles.colors.primary200,
          tabBarInactiveTintColor: GlobalStyles.colors.primary500,
        };
        return options;
      }}>
      <BottomTabs.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          title: 'Toqyn',
          tabBarLabel: 'Login',
          headerShown: true, // Hide the header for this screen
          tabBarIcon: ({color, size}) => (
            <Icon
              color={color}
              size={
                isTablet(screenSize.width, screenSize.height)
                  ? hp('3')
                  : wp('5')
              }
              name="lock"
            />
          ),
        }}
      />
      <BottomTabs.Screen
        name="UserScreen"
        component={UserScreen}
        options={{
          title: 'Toqyn',
          tabBarLabel: 'Home',
          headerShown: true,
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({color, size}) => (
            <Icon
              color={color}
              size={
                isTablet(screenSize.width, screenSize.height)
                  ? hp('3')
                  : wp('5')
              }
              name="home"
            />
          ),
        }}
      />
      <BottomTabs.Screen
        name="SignupScreen"
        component={SignupScreen}
        options={{
          title: 'Toqyn',
          tabBarLabel: 'Signup',
          headerShown: true, // Hide the header for this screen
          tabBarIcon: ({color, size}) => (
            <Icon
              color={color}
              size={
                isTablet(screenSize.width, screenSize.height)
                  ? hp('3')
                  : wp('5')
              }
              name="trophy"
            />
          ),
        }}
      />
      <BottomTabs.Screen
        name="ChallengeScreen"
        component={ChallengeScreen}
        options={{
          title: 'Toqyn',
          tabBarLabel: 'Challenges',
          headerShown: true, // Hide the header for this screen
          tabBarIcon: ({color, size}) => (
            <Icon
              color={color}
              size={
                isTablet(screenSize.width, screenSize.height)
                  ? hp('3')
                  : wp('5')
              }
              name="trophy"
            />
          ),
        }}
      />
      <BottomTabs.Screen
        name="NftMinter"
        component={NftMinter}
        options={{
          title: 'Toqyn',
          tabBarLabel: 'Mint',
          headerShown: false, // Hide the header for this screen
          tabBarIcon: ({color, size}) => (
            <Icon
              color={color}
              size={
                isTablet(screenSize.width, screenSize.height)
                  ? hp('3')
                  : wp('5')
              }
              name="bitcoin"
            />
          ),
        }}
      />
      <BottomTabs.Screen
        name="ImageDetail"
        component={ImageDetail}
        options={{
          title: 'Toqyn',
          tabBarVisible: false,
          headerShown: false, // Hide the header for this screen
          tabBarButton: props => null,
        }}
      />
      <BottomTabs.Screen
        name="CreateChallenge"
        component={CreateChallenge}
        options={{
          title: 'Toqyn',
          tabBarVisible: true,
          headerShown: true, // Hide the header for this screen
          tabBarButton: props => null,
        }}
      />
      <BottomTabs.Screen
        name="CreateUserChallenge"
        component={CreateUserChallenge}
        options={{
          title: 'Toqyn',
          tabBarVisible: false,
          headerShown: false,
          tabBarButton: props => null,
        }}
      />
    </BottomTabs.Navigator>
  );
}
export default TabsNavigator;
