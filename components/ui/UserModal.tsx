import React from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';
import {isTablet, setOutline} from '../../util/util';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import GenButton from './GenButton';

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
}

function generateUModalStyles(size: any) {
  const uModalStyles = StyleSheet.create({
    uModalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    uModalContent: {
      width: isTablet(size.width, size.height) ? hp('60') : wp('70'),
      backgroundColor: 'rgba(200, 200, 200, 0.75)',
      paddingVertical: isTablet(size.width, size.height) ? hp('15') : wp('8'),
      paddingHorizontal: isTablet(size.width, size.height) ? hp('15') : wp('8'),
      marginVertical: isTablet(size.width, size.height) ? hp('15') : wp('8'),
      borderStyle: 'solid',
      borderColor: 'red',
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('12') : wp('6'),
    },
    uModalText: {
      fontSize: isTablet(size.width, size.height) ? hp('2') : wp('4'),
      lineHeight: isTablet(size.width, size.height) ? hp('2') : wp('7'),
      flexDirection: 'row',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
    },
    uModalButton: {
      width: isTablet(size.width, size.height) ? hp('48') : wp('38'),
      backgroundColor: 'rgba(200, 200, 200, 0.75)',
      borderStyle: 'solid',
      borderColor: 'red',
      paddingVertical: isTablet(size.width, size.height) ? hp('2') : wp('3'),
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('3'),
    },
    uModalButtonText: {
      color: 'black',
      fontSize: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      textAlign: 'center',
    },
  });
  const styles = JSON.parse(JSON.stringify(uModalStyles));
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

const UserModal: React.FC<UserModalProps> = ({visible, message, onClose}) => {
  const pUsize = useWindowDimensions();
  const styles = generateUModalStyles(pUsize);
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.uModalContainer}>
        <View style={styles.uModalContent}>
          <Text style={styles.uModalText}>{message}</Text>
        </View>
        <GenButton
          onPress={onClose}
          style={styles.uModalButton}
          textStyle={styles.uModalButtonText}>
          >>>
        </GenButton>
      </View>
    </Modal>
  );
};

export default UserModal;