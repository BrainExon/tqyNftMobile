import React from 'react';
import {
  Modal,
  Image,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';
import {isTablet, setOutline} from '../../util/util';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

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
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      paddingVertical: isTablet(size.width, size.height) ? hp('15') : wp('8'),
      paddingHorizontal: isTablet(size.width, size.height) ? hp('15') : wp('8'),
      marginVertical: isTablet(size.width, size.height) ? hp('15') : wp('8'),
      borderStyle: 'solid',
      borderColor: GlobalStyles.colors.primary400,
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('12') : wp('6'),
    },
    uModalContentError: {
      width: isTablet(size.width, size.height) ? hp('60') : wp('70'),
      backgroundColor: 'rgba(180, 20, 40, 0.4)',
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
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      borderStyle: 'solid',
      borderColor: GlobalStyles.colors.primary400,
      paddingVertical: isTablet(size.width, size.height) ? hp('2') : wp('3'),
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('3'),
    },
    uModalButtonError: {
      width: isTablet(size.width, size.height) ? hp('48') : wp('38'),
      backgroundColor: 'rgba(180, 20, 40, 0.4)',
      borderStyle: 'solid',
      borderColor: 'red',
      paddingVertical: isTablet(size.width, size.height) ? hp('2') : wp('3'),
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('3'),
    },
    uModalButtonText: {
      color: 'white',
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

interface UserModalProps {
  visible: boolean;
  message: string | null;
  error: string | null;
  onClose: (error: string | null) => void;
  showActivity: boolean;
  imageSource: string | null;
}

const UserModal: React.FC<UserModalProps> = ({
  visible,
  message,
  error,
  onClose,
  showActivity,
  imageSource,
}) => {
  console.log(`[UserModal]: visible: ${visible}`);
  console.log(`[UserModal]: message: ${JSON.stringify(message)}`);
  console.log(`[UserModal]: error: ${JSON.stringify(error)}`);
  console.log(`[UserModal]: showActivity: ${JSON.stringify(showActivity)}`);

  const puSize = useWindowDimensions();
  const styles = generateUModalStyles(puSize);

  return (
    <Modal transparent={visible} animationType="fade" visible={visible}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onClose && onClose(error)}
        style={styles.uModalContainer}>
        <View>
          {error && (
            <View style={styles.uModalContentError}>
              <Text style={styles.uModalText}>{error ? error : message}</Text>
            </View>
          )}
          {!error && (
            <View style={styles.uModalContent}>
              {imageSource && (
                <Image source={{uri: imageSource}} style={styles.uModalImage} />
              )}
              <Text style={styles.uModalText}>{error ? error : message}</Text>
            </View>
          )}
          {showActivity && (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
export default UserModal;
