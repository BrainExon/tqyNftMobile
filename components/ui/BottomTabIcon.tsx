import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AppImages} from './AppImages';
import IconSet from 'react-native-vector-icons/FontAwesome';
const styles = StyleSheet.create({
  tabButton: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  tabTitle: {marginTop: '5%'},
});
const BottomTabIcon = ({title, focused}) => {
  console.log('[BottomTabIcon]...');
  console.log(`[BottomTabIcon] title: ${JSON.stringify(title)}`);

  const iconName = focused ? `active${title}Icon` : `inActive${title}Icon`;
  console.log(`[BottomTabIcon] iconName: ${JSON.stringify(iconName)}`);
  const imgSrc = AppImages[iconName];

  console.log(`[BottomTabIcon] imgSrc: ${JSON.stringify(imgSrc)}`);

  if (!imgSrc) {
    return null; // or handle the case when imgSrc is undefined
  }

  return (
    <View style={styles.tabButton}>
      <IconSet name={imgSrc.name} size={imgSrc.size} color={imgSrc.color} />
      <Text style={styles.tabTitle}>{title}</Text>
    </View>
  );
};
export default BottomTabIcon;
