import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import Config from 'react-native-config';
import DropdownMenu from './ui/DropdownMenu';
import {isTablet, setOutline} from '../util/util';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {getUserState, setUser} from '../redux/userSlice';
function generateLoginStyles(size: any) {
  const headerStyles = StyleSheet.create({
    headContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: isTablet(size.width, size.height) ? hp('8') : wp('12'),
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    headLeftContainer: {
      flex: 1,
      //width: isTablet(size.width, size.height) ? hp('16') : wp('18'),
      marginHorizontal: isTablet(size.width, size.height) ? hp('16') : wp('2'),
    },
    headRightContainer: {
      flexDirection: 'row',
      flex: 1,
      marginHorizontal: isTablet(size.width, size.height) ? hp('16') : wp('2'),
    },
    headTitle: {
      color: '#fff',
      fontSize: isTablet(size.width, size.height) ? hp('4') : wp('6'),
      fontWeight: '700',
      padding: isTablet(size.width, size.height) ? hp('8') : wp('2'),
      margin: isTablet(size.width, size.height) ? hp('8') : wp('2'),
    },
    headDropText: {
      color: '#fff',
      //padding: isTablet(size.width, size.height) ? hp('4') : wp('2'),
      marginHorizontal: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      fontSize: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      fontWeight: '700',
    },
    headIconButtonContainer: {
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: isTablet(size.width, size.height) ? hp('8') : wp('2'),
    },
  });
  const styles = JSON.parse(JSON.stringify(headerStyles));
  if (setOutline()) {
    Object.keys(styles).forEach(key => {
      Object.assign(styles[key], {
        borderStyle: 'solid',
        borderColor: 'red',
        borderWidth: 2,
      });
    });
  }
  return styles;
}

export function Header() {
  const headSize = useWindowDimensions();
  const styles = generateLoginStyles(headSize);
  const [selectedOption, setSelectedOption] = useState(null);
  const userState = useSelector(getUserState);
  const dispatch = useDispatch();
  const handleSelect = useCallback(async option => {
    setSelectedOption(option);
    if (option.startsWith('Change role:')) {
      userState.role = userState.role === 'creator' ? 'user' : 'creator';
      console.log(`[Header] option selection: ${option}`);
      console.log(
        `[Header] User State ROLE Change: ${JSON.stringify(userState)}`,
      );
      dispatch(
        setUser({
          phone: userState.phone,
          role: userState.role,
          userId: userState.userId,
        }),
      );
    }
  }, []);
  const options = ['[ Edit Profile ]', `[ Change Role ]: ${userState.role}`];
  return (
    <>
      <View style={styles.headContainer}>
        <View style={styles.headLeftContainer} />
        <Text style={styles.headTitle}>{Config.META_APP_NAME}</Text>
        <View style={styles.headRightContainer}>
          <DropdownMenu options={options} onSelect={handleSelect} />
        </View>
      </View>
    </>
  );
}
