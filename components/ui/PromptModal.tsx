import React from 'react';
import GenButton from './GenButton';
import {
  Modal,
  Image,
  View,
  Text,
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

function generateUModalStyles(size: any) {
  const proModalStyles = StyleSheet.create({
    proModalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    proModalContent: {
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
    proModalContentError: {
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
    proModalTitle: {
      fontSize: isTablet(size.width, size.height) ? hp('8') : wp('6'),
      lineHeight: isTablet(size.width, size.height) ? hp('9') : wp('8'),
      flexDirection: 'row',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
    },
    proModalImage: {
      width: isTablet(size.width, size.height) ? hp('80') : wp('60'),
      height: isTablet(size.width, size.height) ? hp('80') : wp('60'),
      marginBottom: isTablet(size.width, size.height) ? hp('20') : wp('35'),
      backgroundColor: 'transparent',
    },
    proModalButtonGroup: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    proModalButton: {
      width: isTablet(size.width, size.height) ? hp('48') : wp('38'),
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      borderStyle: 'solid',
      borderColor: GlobalStyles.colors.primary400,
      paddingVertical: isTablet(size.width, size.height) ? hp('2') : wp('3'),
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('3'),
    },
    proModalButtonError: {
      width: isTablet(size.width, size.height) ? hp('48') : wp('38'),
      backgroundColor: 'rgba(180, 20, 40, 0.4)',
      borderStyle: 'solid',
      borderColor: 'red',
      paddingVertical: isTablet(size.width, size.height) ? hp('2') : wp('3'),
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('3'),
    },
    proModalText: {
      fontSize: isTablet(size.width, size.height) ? hp('2') : wp('4'),
      lineHeight: isTablet(size.width, size.height) ? hp('2') : wp('7'),
      flexDirection: 'row',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
    },
    proModalButtonText: {
      color: 'white',
      fontSize: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      textAlign: 'center',
    },
  });
  const styles = JSON.parse(JSON.stringify(proModalStyles));
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
interface PromptModalProps {
  visible: boolean;
  title: string;
  message: string | null;
  showActivity: boolean;
  imageSource: string | null;
  error: string | null;
  onAccept: (error: string | null) => void;
  onClose: (error: string | null) => void;
}
const PromptModal: React.FC<PromptModalProps> = ({
  visible,
  title,
  message,
  showActivity,
  imageSource,
  error,
  onAccept,
  onClose,
}) => {
  console.log(`[PromptModal]: visible: ${visible}`);
  console.log(`[PromptModal]: message: ${JSON.stringify(message)}`);
  console.log(`[PromptModal]: showActivity: ${JSON.stringify(showActivity)}`);
  console.log(`[PromptModal]: imageSrc: ${JSON.stringify(imageSource)}`);

  const pUsize = useWindowDimensions();
  const styles = generateUModalStyles(pUsize);

  return (
    <Modal transparent={visible} animationType="fade" visible={visible}>
      <View style={styles.proModalContainer}>
        {error && (
          <View style={styles.proModalContentError}>
            <Text style={styles.proModalText}>{error ? error : message}</Text>
          </View>
        )}
        {!error && (
          <View style={styles.proModalContainer}>
            {imageSource && (
              <Image source={{uri: imageSource}} style={styles.proModalImage} />
            )}
            <Text style={styles.proModalTitle}>{title}</Text>
            <Text style={styles.proModalText}>{message}</Text>
          </View>
        )}
        {showActivity && (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        <View style={styles.proModalButtonGroup}>
          <GenButton
            onPress={onAccept}
            style={error ? styles.proModalButtonError : styles.proModalButton}
            textStyle={
              error ? styles.proModalButtonTextError : styles.proModalButtonText
            }>
            {'Approve'}
          </GenButton>
          <GenButton
            onPress={() => onClose && onClose(error)}
            style={error ? styles.proModalButtonError : styles.proModalButton}
            textStyle={
              error ? styles.proModalButtonTextError : styles.proModalButtonText
            }>
            {'Cancel'}
          </GenButton>
        </View>
      </View>
    </Modal>
  );
};
export default PromptModal;
