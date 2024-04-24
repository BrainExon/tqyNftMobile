import React from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import GlobalStyles from '../../constants/GlobalStyles';
import {isTablet, setOutline} from '../../util/util';

const generateFlipStyles = size => {
  const baseFlipStyles = StyleSheet.create({
    genButton: {
      borderRadius: isTablet(size.width, size.height) ? hp('1') : wp('2'),
      padding: isTablet(size.width, size.height) ? hp('1%') : wp('2%'),
      backgroundColor: GlobalStyles.colors.primary300,
    },
    flat: {
      backgroundColor: 'transparent',
    },
    genButtonText: {
      color: 'white',
      textAlign: 'center',
    },
    flatText: {
      color: GlobalStyles.colors.primary200,
    },
    pressed: {
      opacity: 0.75,
      backgroundColor: GlobalStyles.colors.primary100,
      borderRadius: isTablet(size.width, size.height) ? hp('1') : wp('2'),
    },
  });
  const styles = JSON.parse(JSON.stringify(baseFlipStyles));
  if (setOutline()) {
    Object.keys(styles).forEach(key => {
      Object.assign(styles[key], {
        borderStyle: 'solid',
        borderColor: 'yellow',
        borderWidth: 1,
      });
    });
  }
  return styles;
};
function GenButton({children, onPress, mode, style, textStyle}) {
  const genButtonScreenSize = useWindowDimensions();
  const styles = generateFlipStyles(genButtonScreenSize);
  return (
    <View testID="gen-button" style={[styles.genButton, style]}>
      <Pressable
        onPress={onPress}
        style={({pressed}) => pressed && styles.pressed}>
        <Text
          style={[
            styles.genButtonText,
            mode === 'flat' && styles.flatText,
            textStyle,
          ]}>
          {children ?? 'Button'}
        </Text>
      </Pressable>
    </View>
  );
}

GenButton.defaultProps = {
  children: '',
  mode: '',
  style: () => {},
  onPress: () => {},
};
GenButton.propTypes = {
  children: PropTypes.string,
  mode: PropTypes.string,
  onPress: () => {},
  style: () => {},
};
export default GenButton;
