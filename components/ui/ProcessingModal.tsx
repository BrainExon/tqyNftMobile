import React from 'react';
import {
  Text,
  Modal,
  ActivityIndicator,
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {isTablet, setOutline} from '../../util/util';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import GenButton from './GenButton';

function generatePModalStyles(size: any) {
  const pModalStyles = StyleSheet.create({
    pModalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    pModalContent: {
      width: isTablet(size.width, size.height) ? hp('60') : wp('70'),
      backgroundColor: 'rgba(180, 0, 0, 0.4)',
      paddingVertical: isTablet(size.width, size.height) ? hp('15') : wp('8'),
      paddingHorizontal: isTablet(size.width, size.height) ? hp('15') : wp('8'),
      marginVertical: isTablet(size.width, size.height) ? hp('15') : wp('8'),
      borderStyle: 'solid',
      borderColor: 'red',
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('12') : wp('6'),
    },
    pModalText: {
      fontSize: isTablet(size.width, size.height) ? hp('2') : wp('4'),
      lineHeight: isTablet(size.width, size.height) ? hp('2') : wp('7'),
      flexDirection: 'row',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
    },
    pModalButton: {
      width: isTablet(size.width, size.height) ? hp('48') : wp('38'),
      backgroundColor: 'rgba(200, 200, 200, 0.75)',
      borderStyle: 'solid',
      borderColor: 'red',
      paddingVertical: isTablet(size.width, size.height) ? hp('2') : wp('3'),
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('3'),
    },
    pModalButtonText: {
      color: 'black',
      fontSize: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      textAlign: 'center',
    },
  });
  const styles = JSON.parse(JSON.stringify(pModalStyles));
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

const ProcessingModal = ({visible, error, onClose}) => {
  const pModalSize = useWindowDimensions();
  const styles = generatePModalStyles(pModalSize);
  console.log(`[ProcessingModal] visible: ${JSON.stringify(visible)}`);
  console.log(`[ProcessingModal] error: ${JSON.stringify(error)}`);
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.pModalContainer}>
        <View style={styles.pModalContent}>
          {error ? (
            <Text style={styles.pModalText}>{error}</Text>
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>
        <GenButton
          onPress={onClose}
          style={styles.pModalButton}
          textStyle={styles.pModalButtonText}
        />
      </View>
    </Modal>
  );
};
/*<Button title="OK" onPress={onClose} style={styles.pModalButton} />*/

export default ProcessingModal;
