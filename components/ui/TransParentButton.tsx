import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {isTablet, setOutline} from '../../util/util';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const generateTransButtonStyles = size => {
  const transStyles = StyleSheet.create({
    tButton: {
      backgroundColor: '#D3D3D3',
      borderWidth: 2,
      borderColor: 'black',
      width: isTablet(size.width, size.height) ? hp('40') : wp('30'),
      borderRadius: isTablet(size.width, size.height) ? hp('4') : wp('4'),
      //paddingVertical: isTablet(size.width, size.height) ? hp('4') : wp('1'),
      paddingHorizontal: isTablet(size.width, size.height) ? hp('4') : wp('1'),
      //padding: isTablet(size.width, size.height) ? hp('4') : wp('6'),
      alignItems: 'center',
    },
    tText: {
      color: 'black',
      fontSize: isTablet(size.width, size.height) ? hp('4') : wp('6'),
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
  const styles = JSON.parse(JSON.stringify(transStyles));
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
};

const TransparentButton = ({onPress, title}) => {
  const tButtonSize = useWindowDimensions();
  const styles = generateTransButtonStyles(tButtonSize);
  return (
    <TouchableOpacity style={styles.tButton} onPress={onPress}>
      <Text style={styles.tText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default TransparentButton;
