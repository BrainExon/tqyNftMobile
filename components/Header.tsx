import React, {useEffect, useCallback, useState} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import Config from 'react-native-config';
import DropdownMenu from './ui/DropdownMenu';
import {capitalizeFirstLetter, isTablet, setOutline} from '../util/util';
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
      padding: isTablet(size.width, size.height) ? hp('4') : wp('2'),
      fontSize: isTablet(size.width, size.height) ? hp('4') : wp('4'),
      color: 'white',
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
  const userState = useSelector(getUserState); // Get userState from Redux store
  const dispatch = useDispatch();

  useEffect(() => {
    // Update local state when userState changes
    setSelectedOption(null); // Reset selectedOption
  }, [userState]);

  const handleSelect = useCallback(
    async option => {
      setSelectedOption(option);
      if (option.startsWith('[Change Role]')) {
        const userStateCopy = {...userState};
        userStateCopy.role = userState.role === 'creator' ? 'user' : 'creator';
        dispatch(setUser(userStateCopy)); // Dispatch setUser with the updated userStateCopy
      }
    },
    [dispatch, userState],
  );

  const options = ['[Edit Profile]', '[Change Role]'];

  return (
    <>
      <View style={styles.headContainer}>
        <View style={styles.headLeftContainer}>
          <Text style={styles.headDropText}>
            {capitalizeFirstLetter(userState.role)}
          </Text>
        </View>
        <Text style={styles.headTitle}>{Config.META_APP_NAME}</Text>
        <View style={styles.headRightContainer}>
          <DropdownMenu options={options} onSelect={handleSelect} />
        </View>
      </View>
    </>
  );
}
