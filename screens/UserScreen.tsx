import React from "react";
import {
  Button,
  TextInput,
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {isTablet, setOutline} from '../util/util';
import GlobalStyles from '../constants/GlobalStyles';
// import ErrorOverlay from '../components/ui/ErrorOverlay';

function generateBoardStyleSheet(size) {
  // eslint-disable
  const loginStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: isTablet(size.width, size.height) ? hp('4') : wp('6'),
    },
    title: {
      fontSize: 20,
      marginBottom: isTablet(size.width, size.height) ? hp('4') : wp('6'),
    },
    input: {
      height: 40,
      width: isTablet(size.width, size.height) ? hp('80') : wp('60'),
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: isTablet(size.width, size.height) ? hp('4') : wp('6'),
      paddingHorizontal: isTablet(size.width, size.height) ? hp('4') : wp('4'),
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

function UserScreen() {
  console.log('[UserScreen]');
  const boardSize = useWindowDimensions();
  const styles = generateBoardStyleSheet(boardSize);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
      />
      <Button title="Navigate to Main Screen" />
    </View>
  );
}

export default UserScreen;
