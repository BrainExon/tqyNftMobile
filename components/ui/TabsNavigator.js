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
        console.log(`[TabsNavigator] route: ${JSON.stringify(route)}`);
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
            backgroundColor: GlobalStyles.accent.blue200,
            display: setTabBarVisible(route?.name),
            padding: isTablet(screenSize.width, screenSize.height)
              ? hp('1')
              : wp('2'),
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
          tabBarActiveTintColor: GlobalStyles.colors.primary950,
          tabBarInactiveTintColor: GlobalStyles.colors.primary380,
        };
        return options;
      }}>
      <BottomTabs.Screen
        name="UserScreen"
        component={UserScreen}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
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
          headerStyle: {
            backgroundColor: GlobalStyles.accent.blue200,
            height: isTablet(screenSize.width, screenSize.height)
              ? hp('28')
              : wp('32'),
          },
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
          headerStyle: {
            backgroundColor: GlobalStyles.accent.blue200,
            height: isTablet(screenSize.width, screenSize.height)
              ? hp('28')
              : wp('32'),
          },
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
    </BottomTabs.Navigator>
  );
}
export default TabsNavigator;
