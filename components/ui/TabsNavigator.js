import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useWindowDimensions} from 'react-native';
import {isTablet} from '../../util/util';
import GlobalStyles from '../../constants/GlobalStyles';
import ChallengeScreen from '../../screens/ChallengeScreen';
import SignupScreen from '../../screens/SignupScreen';
import UserScreen from '../../screens/UserScreen';
import LoginScreen from '../../screens/LoginScreen';
import ImageDetail from '../../screens/ImageDetail';
import NftMinter from '../NftMinter';
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
            backgroundColor: GlobalStyles.accent.blue200,
            height: isTablet(screenSize.width, screenSize.height)
              ? hp('88')
              : wp('32'),
          },
          headerTitleStyle: {
            fontSize: isTablet(screenSize.width, screenSize.height)
              ? hp('2')
              : wp('4'),
          },
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
          title: 'Login',
          tabBarLabel: 'Login',
          headerShown: false, // Hide the header for this screen
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
          title: 'Home',
          tabBarLabel: 'Home',
          headerShown: false, // Hide the header for this screen
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
          title: 'Signup',
          tabBarLabel: 'Signup',
          headerShown: false, // Hide the header for this screen
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
          title: 'Challenge',
          tabBarLabel: 'Challenge',
          headerShown: false, // Hide the header for this screen
          tabBarIcon: ({color, size}) => (
            <Icon
              color={color}
              size={
                isTablet(screenSize.width, screenSize.height)
                  ? hp('3')
                  : wp('5')
              }
              name="gear"
            />
          ),
        }}
      />
      <BottomTabs.Screen
        name="NFT"
        component={NftMinter}
        options={{
          title: 'NFT',
          tabBarLabel: 'NFT',
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
          title: 'Quiz',
          tabBarVisible: false,
          headerShown: false, // Hide the header for this screen
          tabBarButton: props => null,
        }}
      />
    </BottomTabs.Navigator>
  );
}
export default TabsNavigator;
