import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import Config from 'react-native-config';
import {isTablet, setOutline} from '../util/util';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
function generateLoginStyles(size: any) {
  const headerStyles = StyleSheet.create({
    header: {
      paddingVertical: isTablet(size.width, size.height) ? hp('8') : wp('12'),
      backgroundColor: 'transparent',
    },
    title: {
      color: '#fff',
      fontSize: isTablet(size.width, size.height) ? hp('4') : wp('6'),
      fontWeight: '700',
      textAlign: 'center',
      backgroundColor: 'transparent',
    },
  });
  const styles = JSON.parse(JSON.stringify(headerStyles));
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
}

export function Header() {
  const headSize = useWindowDimensions();
  const styles = generateLoginStyles(headSize);
  // const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{Config.META_APP_NAME}</Text>
    </View>
  );
}
