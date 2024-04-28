import {TextInput, View, StyleSheet, useWindowDimensions} from 'react-native';
import Config from 'react-native-config';
import React, {useState} from 'react';
import TransparentButton from '../components/ui/TransParentButton';
import UserModal from '../components/ui/UserModal';
import {v4 as uuidv4} from 'uuid';
import {dbFindOne, dbUpsert} from '../util/dbUtils';
import {User, UserRole} from '../components/models/User';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {isTablet, setOutline} from '../util/util';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setUser} from '../redux/userSlice';

function LoginScreen() {
  const dispatch = useDispatch();
  const boardSize = useWindowDimensions();
  const styles = generateLoginStyles(boardSize);
  const navigation = useNavigation();
  const [phone, setPhone] = useState('(770) 289-6960');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userAccount, setUserAccount] = useState('');

  const handleErrorCallback = (errMsg: any) => {
    setError(`[Login] Error:  ${JSON.stringify(errMsg)}`);
    return;
  };

  const handleButtonClose = (error: any) => {
    if (!error) {
      if (!userAccount) {
        setError(
          '[Login] Error: null User Account. Please close the app and try again.}',
        );
        return;
      }
      dispatch(
        setUser({
          phone: userAccount.phone,
          role: userAccount.role,
          userId: userAccount.userId,
        }),
      );
      navigation.navigate('UserScreen');
    }
    setShowModal(false);
  };
  // see if we have a user, if not create one...
  const handlePress = async phoneNumber => {
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    console.log(`[handlePress] cleanPhoneNumber: ${cleanPhoneNumber}`);
    const timestamp = Date.now();
    try {
      console.log(
        '[Login] call dbFindOne and see if we have an existing user...',
      );
      const search = {
        collection: 'users',
        conditions: {
          phone: '7702896960',
        },
      };
      const response = await dbFindOne({
        endPoint: 'find_one',
        conditions: search,
        setError: handleErrorCallback,
      });
      setUserAccount(response.data ?? '');
      if (!response.data) {
        const userId = uuidv4();
        const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
        const newUser = new User(
          userId,
          cleanPhoneNumber,
          '',
          [],
          [],
          [],
          timestamp,
          UserRole.User,
        );
        const queryResult = await dbUpsert({
          endPoint: 'upsert_user',
          conditions: newUser,
          setError: handleErrorCallback,
        });
        if (!queryResult.data) {
          setError(
            'Error: there was a problem with the User Account. Please close the app and try again.',
          );
          return;
        }
        setUserAccount(queryResult.data ?? '');
      }
      dispatch(setUser({phone: userAccount.phone, role: userAccount.role}));
      setShowModal(true);
    } catch (e) {
      setError(Config.LOGIN_ERROR?.replace('${APP_NAME}', Config.APP_NAME));
      setShowModal(true);
      return;
    }
  };

  return (
    <View style={styles.loginContainer}>
      <View style={styles.boxHeader} />
      <TextInput
        style={styles.loginInput}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={text => {
          let formattedText = text.replace(/\D/g, '');
          if (formattedText.length <= 10) {
            formattedText = formattedText.replace(
              /(\d{3})(\d{0,3})(\d{0,4})/,
              '($1) $2-$3',
            );
            setPhone(formattedText);
          }
        }}
      />
      <View style={styles.boxMiddle} />
      {phone && (
        <TransparentButton onPress={() => handlePress(phone)} title=">>>" />
      )}
      {showModal && (
        <UserModal
          visible={showModal}
          message={'Login success!'}
          error={error}
          onClose={handleButtonClose}
        />
      )}
      <View style={styles.boxFooter} />
    </View>
  );
}

function generateLoginStyles(size: any) {
  // eslint-disable
  const loginStyles = StyleSheet.create({
    loginContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: isTablet(size.width, size.height) ? hp('2%') : wp('2%'),
      //padding: isTablet(size.width, size.height) ? hp('2%') : wp('2%'),
    },
    boxHeader: {
      width: isTablet(size.width, size.height) ? hp('85%') : wp('65%'),
      paddingVertical: isTablet(size.width, size.height) ? hp('2%') : wp('10%'),
    },
    boxMiddle: {
      width: isTablet(size.width, size.height) ? hp('85%') : wp('65%'),
      paddingVertical: isTablet(size.width, size.height) ? hp('2%') : wp('2%'),
    },
    boxFooter: {
      width: isTablet(size.width, size.height) ? hp('85%') : wp('65%'),
      paddingVertical: isTablet(size.width, size.height) ? hp('2%') : wp('18%'),
    },
    title: {
      fontSize: isTablet(size.width, size.height) ? hp('4') : wp('6'),
      marginBottom: isTablet(size.width, size.height) ? hp('6') : wp('8'),
    },
    loginInput: {
      height: isTablet(size.width, size.height) ? hp('25') : wp('15'),
      width: isTablet(size.width, size.height) ? hp('85') : wp('75'),
      borderColor: 'grey',
      borderWidth: 3,
      marginHorizontal: isTablet(size.width, size.height) ? hp('1%') : wp('2%'),
      paddingHorizontal: isTablet(size.width, size.height)
        ? hp('1%')
        : wp('2%'),
      textAlign: 'center',
      borderRadius: isTablet(size.width, size.height) ? hp('4') : wp('4'),
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
    },
    loginText: {
      fontSize: isTablet(size.width, size.height) ? hp('4') : wp('6'),
    },
  });
  const styles = JSON.parse(JSON.stringify(loginStyles));
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
  // eslint-enable
}

export default LoginScreen;
