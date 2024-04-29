import React from 'react';
import {
  TouchableOpacity,
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
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {getUserState} from '../redux/userSlice';

/**
 * {
 *   "name": "Test_020b5",
 *   "doubloon": "http://127.0.0.1:3030/image/e22a1b9d-b604-4a53-88cb-667ccddb3bfb.png",
 *   "nft": "8848d458-34eb-4b45-81da-b19e6b696258"
 * }
 */
const generateChListStyles = (size: any) => {
  const chListStyles = StyleSheet.create({
    chListItem: {
      flexDirection: 'row',
      padding: isTablet(size.width, size.height) ? hp('40') : wp('4'),
    },
    chListImage: {
      width: isTablet(size.width, size.height) ? hp('20') : wp('15'),
      height: isTablet(size.width, size.height) ? hp('20') : wp('15'),
      marginRight: isTablet(size.width, size.height) ? hp('40') : wp('4'),
    },
    textContainer: {
      marginLeft: isTablet(size.width, size.height) ? hp('40') : wp('4'),
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
  const userState = useSelector(getUserState);
  const chListSize = useWindowDimensions();
  const styles = generateChListStyles(chListSize);
  const navigation = useNavigation();

  const handleChallengeItem = item => {
    navigation.navigate('CreateUserChallenge', {
      ownerId: userState.userId,
      nftId: item.nft,
      chId: item.chId,
      doubloon: item.doubloon,
    });
  };

  const renderItem = ({item}) => (
    <View style={styles.chListItem}>
      <TouchableOpacity onPress={() => handleChallengeItem(item)}>
        <Image source={{uri: item.doubloon}} style={styles.chListImage} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.chListText}>Challenge: "{item.name}"</Text>
        <Text style={styles.chListText}>Description: "{item.description}"</Text>
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
