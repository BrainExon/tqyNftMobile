import {TextInput, View, StyleSheet, useWindowDimensions} from 'react-native';
import React, {useState} from 'react';
import TransparentButton from '../components/ui/TransParentButton';
import UserModal from '../components/ui/UserModal';
import {v4 as uuidv4} from 'uuid';
import {addUser, dbUpsert} from '../util/dbUtils';
import {User} from '../components/models/User';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {isTablet, setOutline} from '../util/util';
import {useNavigation} from '@react-navigation/native';
import ProcessingModal from '../components/ui/ProcessingModal';

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
    },
    loginText: {
      color: 'black',
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

function LoginScreen() {
  const boardSize = useWindowDimensions();
  const styles = generateLoginStyles(boardSize);
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleProcessingClose = () => {
    if (!error) {
      setLoading(false);
    }
  };

  const handleErrorCallback = errMsg => {
    console.log(
      `[LoginScreen][handleErrorCallback]: ${JSON.stringify(errMsg)}`,
    );
    setError(errMsg);
  };

  const handleButtonClose = error => {
    if (!error) {
      navigation.navigate('UserScreen');
    }
    setShowModal(false);
  };

  const handlePress = async phoneNumber => {
    setLoading(true);
    const timestamp = Date.now();
    try {
      const userId = uuidv4();
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      const user = new User(
        userId,
        cleanPhoneNumber,
        '',
        [],
        [],
        [],
        timestamp,
      );
      //const response = await addUser({user}, handleErrorCallback);
      await dbUpsert({
        endPoint: 'add_user',
        data: user,
        setError: handleErrorCallback,
      });
      // Show modal regardless of response
      setShowModal(true);
    } catch (e) {
      console.log('Error adding user:', e.message);
      setLoading(false);
      setError(
        'Failed to add user to the Toqyn system. Please check your network connection and try again.',
      );
      // Show modal in case of error
      setShowModal(true);
    } finally {
      setLoading(false);
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

export default LoginScreen;
