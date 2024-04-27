import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {isTablet, setOutline} from '../util/util';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

/**
 * {
 *   "name": "Test_020b5",
 *   "doubloon": "http://127.0.0.1:3030/image/e22a1b9d-b604-4a53-88cb-667ccddb3bfb.png",
 *   "nft": "8848d458-34eb-4b45-81da-b19e6b696258"
 * }
 */
const generateChListStyles = (size: any) => {
  const chListStyles = StyleSheet.create({
    chListContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    chListItem: {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      padding: isTablet(size.width, size.height) ? hp('6') : wp('4'),
    },
    chListImage: {
      width: isTablet(size.width, size.height) ? hp('40') : wp('20'),
      height: isTablet(size.width, size.height) ? hp('40') : wp('20'),
      marginRight: isTablet(size.width, size.height) ? hp('8') : wp('8'),
    },
    chListText: {
      marginHorizontal: isTablet(size.width, size.height) ? hp('40') : wp('4'),
    },
    chListText: {
      marginBottom: 5,
    },
  });
  const styles = JSON.parse(JSON.stringify(chListStyles));
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
const ChallengesList = ({items}) => {
  console.log(`[ChallengesList] items: ${JSON.stringify(items, null, 2)}`);
  const chListSize = useWindowDimensions();
  const styles = generateChListStyles(chListSize);
  /*
  const renderItem = ({item}) => (
    <View style={styles.chListItem}>
      <Image source={{uri: item.doubloon}} style={styles.chListImage} />
      <Text style={styles.chListText}>Challenge: "{item.name}"</Text>
      <Text>Description: "{item.description}"</Text>
    </View>
  );
  */
  const renderItem = ({item}) => (
    <View style={styles.chListItem}>
      <Image source={{uri: item.doubloon}} style={styles.chListImage} />
      <View>
        <Text style={styles.chListText}>Challenge: "{item.name}"</Text>
        <Text>Description: "{item.description}"</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item.chId}
    />
  );
};

export default ChallengesList;
