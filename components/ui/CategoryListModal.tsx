import React, {useState} from 'react';
import {
  Text,
  View,
  Button,
  Modal,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {isTablet, setOutline} from '../../util/util';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import GlobalStyles from '../../constants/GlobalStyles';
import CategoryList from '../CategoryList';

const CategoryModal = ({show, onClose, onCallback}) => {
  console.log('[CategoryModal]...');
  const catSize = useWindowDimensions();
  const styles = generateCatModalStyles(catSize);
  const handleCategoryCallback = cat => {
    console.log(`[CategoryModal] category: ${JSON.stringify(cat)}`);
    onCallback(cat);
  };
  return (
    <Modal visible={show} animationType="slide">
      <View style={styles.catModalContainer}>
        <CategoryList categoryCallback={handleCategoryCallback} />
        <Button title="Close Modal" onPress={onClose} />
      </View>
    </Modal>
  );
};

function generateCatModalStyles(size: any) {
  const catModalStyles = StyleSheet.create({
    catModalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    catModalContent: {
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
    catModalContentError: {
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
    catModalTitle: {
      fontSize: isTablet(size.width, size.height) ? hp('8') : wp('6'),
      lineHeight: isTablet(size.width, size.height) ? hp('9') : wp('8'),
      flexDirection: 'row',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
    },
    catModalImage: {
      width: isTablet(size.width, size.height) ? hp('80') : wp('60'),
      height: isTablet(size.width, size.height) ? hp('80') : wp('60'),
      marginBottom: isTablet(size.width, size.height) ? hp('20') : wp('35'),
      backgroundColor: 'transparent',
    },
    catModalButtonGroup: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    catModalButton: {
      width: isTablet(size.width, size.height) ? hp('48') : wp('38'),
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      borderStyle: 'solid',
      borderColor: GlobalStyles.colors.primary400,
      paddingVertical: isTablet(size.width, size.height) ? hp('2') : wp('3'),
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('3'),
    },
    catModalButtonError: {
      width: isTablet(size.width, size.height) ? hp('48') : wp('38'),
      backgroundColor: 'rgba(180, 20, 40, 0.4)',
      borderStyle: 'solid',
      borderColor: 'red',
      paddingVertical: isTablet(size.width, size.height) ? hp('2') : wp('3'),
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('3'),
    },
    catModalText: {
      fontSize: isTablet(size.width, size.height) ? hp('2') : wp('4'),
      lineHeight: isTablet(size.width, size.height) ? hp('2') : wp('7'),
      flexDirection: 'row',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
    },
    catModalButtonText: {
      color: 'white',
      fontSize: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      textAlign: 'center',
    },
  });
  const styles = JSON.parse(JSON.stringify(catModalStyles));
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
export default CategoryModal;
