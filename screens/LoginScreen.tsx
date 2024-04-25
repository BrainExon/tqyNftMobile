import {TextInput, View, StyleSheet, useWindowDimensions} from 'react-native';
import React, {useState} from 'react';
import TransparentButton from '../components/ui/TransParentButton';
import UserModal from '../components/ui/UserModal';
import {v4 as uuidv4} from 'uuid';
import {addUser} from '../util/dbUtils';
import {User} from '../components/models/User';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {isTablet, setOutline} from '../util/util';
import {useNavigation} from '@react-navigation/native';
import ProcessingModal from '../components/ui/ProcessingModal';

function LoginScreen() {
  console.log('[LoginScreen]...');
  const boardSize = useWindowDimensions();
  const styles = generateLoginStyles(boardSize);
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleProcessingClose = () => {
    setLoading(false); // Update the state to hide the modal
  };
  const handleErrorCallback = async (errMsg: any) => {
    console.log(
      `[LoginScreen][handleErrorCallback]: ${JSON.stringify(errMsg)}`,
    );
    setError(errMsg);
  };
  const handleButtonClose = async () => {
    navigation.navigate('UserScreen');
  };
  const handlePress = async (phoneNumber: string) => {
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
      const response = await addUser({user}, handleErrorCallback);
      if (response) {
        setShowModal(true);
        //navigation.navigate('UserScreen');
      }
    } catch (e: any) {
      console.error('Error adding user:', e.message);
      setError(
        `[LoginScreen] Failed to add user to the Toqyn system. Please check your network connection and try again: ${JSON.stringify(
          e.message,
        )}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.loginContainer}>
      <View style={styles.boxHeader} />
      <TextInput
        style={styles.login_input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={text => {
          let formattedText = text.replace(/\D/g, ''); // Remove all non-numeric characters
          if (formattedText.length <= 10) {
            // Format the phone number as (XXX) XXX-XXXX if it's 10 characters or less
            formattedText = formattedText.replace(
              /(\d{3})(\d{0,3})(\d{0,4})/,
              '($1) $2-$3',
            );
            setPhone(formattedText);
          }
        }}
      />
      <View style={styles.boxMiddle} />
      {phone ? (
        <TransparentButton onPress={() => handlePress(phone)} title=">>>" />
      ) : null}
      {showModal ? (
        <UserModal
          visible={showModal}
          message={'Login success!'}
          onClose={handleButtonClose}
        />
      ) : null}
      <ProcessingModal
        visible={loading}
        error={error}
        onClose={handleProcessingClose}
      />
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
    login_input: {
      height: 40,
      width: isTablet(size.width, size.height) ? hp('85%') : wp('65%'),
      borderColor: 'white',
      borderWidth: 2,
      marginHorizontal: isTablet(size.width, size.height) ? hp('1%') : wp('2%'),
      paddingHorizontal: isTablet(size.width, size.height)
        ? hp('1%')
        : wp('2%'),
    },
    login_button: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: 5,
      padding: isTablet(size.width, size.height) ? hp('2%') : wp('2%'),
      alignItems: 'center',
    },
    login_text: {
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

export default LoginScreen;
