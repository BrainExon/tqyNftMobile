import {TextInput, View, StyleSheet, useWindowDimensions} from 'react-native';
import React, {useState} from 'react';
import TransparentButton from '../components/ui/TransParentButton';
import Config from 'react-native-config';
import {v4 as uuidv4} from 'uuid';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {isTablet, setOutline} from '../util/util';
import {useNavigation} from '@react-navigation/native';
import ProcessingModal from '../components/ui/ProcessingModal';
import GlobalStyles from '../constants/GlobalStyles';
import {Header} from '../components/Header';
// import ErrorOverlay from '../components/ui/ErrorOverlay';

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

function LoginScreen() {
  const boardSize = useWindowDimensions();
  const styles = generateLoginStyles(boardSize);
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePress = async phoneNumber => {
    setLoading(true);
    const timestamp = Date.now();
    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const raw = JSON.stringify({
        id: uuidv4(),
        phone: phoneNumber,
        date: timestamp,
      });
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };
      const response = await fetch(
        `${Config.NODEJS_EXPRESS_SERVER}/add_user`,
        requestOptions,
      );
      console.log('[LoginScreen] ');
      if (response.ok) {
        const data = await response.json();
        console.log('User added successfully:', data);
        navigation.navigate('UserScreen');
      } else {
        const er = `LoginScreenError adding user:  ${JSON.stringify(
          response.statusText,
        )}`;
        console.error(er);
        setError('Failed to add user. Please try again later.');
      }
    } catch (e) {
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
        onChangeText={text => setPhone(text)}
      />
      <View style={styles.boxMiddle} />
      {phone ? <TransparentButton onPress={() => handlePress(phone)} title=">>>" /> : null}
      <ProcessingModal visible={loading} />
      <View style={styles.boxFooter} />
    </View>
  );}

export default LoginScreen;
