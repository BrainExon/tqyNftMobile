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
import EditChallenge from './EditChallenge';
import {formatDate, isEmpty, isTablet, setOutline} from '../util/util';
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
      alignItems: 'center',
      padding: isTablet(size.width, size.height) ? hp('40') : wp('4'),
    },
    chListImage: {
      width: isTablet(size.width, size.height) ? hp('20') : wp('15'),
      height: isTablet(size.width, size.height) ? hp('20') : wp('15'),
      marginRight: isTablet(size.width, size.height) ? hp('40') : wp('4'),
    },
    chTextContainerWrapper: {
      width: isTablet(size.width, size.height) ? hp('20') : wp('70%'),
    },
    chTextContainer: {
      marginLeft: isTablet(size.width, size.height) ? hp('40') : wp('2'),
    },
    chListText: {
      flexWrap: 'wrap',
      marginBottom: 5,
      color: 'white',
      fontStyle: 'italic',
    },
    chListTitle: {
      flexWrap: 'wrap',
      marginBottom: 5,
      color: 'white',
      fontWeight: 'bold',
      fontSize: isTablet(size.width, size.height) ? hp('7') : wp('4'),
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
  console.log('\n------\n');
  console.log('[ChallengeList]');
  console.log('\n------\n');
  const userState = useSelector(getUserState);
  console.log(
    `[ChallengeList] userState: ${JSON.stringify(userState, null, 2)}`,
  );
  const chListSize = useWindowDimensions();
  const styles = generateChListStyles(chListSize);
  const navigation = useNavigation();

  const handleChallengeItem = (item, role) => {
    console.log(`[ChallengeList] ROLE: ${JSON.stringify(role, null, 2)}`);
    if (role === 'creator') {
      console.log(`[ChallengeList] ROLE: ${JSON.stringify(role, null, 2)}`);
      navigation.navigate('EditChallenge', {
        challengeId: item.chId,
      });
    } else {
      navigation.navigate('CreateAcceptChallenge', {
        ownerId: userState.userId,
        nftId: item.nft,
        chId: item.chId,
        doubloon: item.doubloon,
        name: item.name,
        description: item.description,
        dataTxId: item.dataTxId,
      });
    }
  };

  const renderItem = ({item}) => {
    console.log('\n=====\n');
    console.log(`[ChallengeList] item: ${JSON.stringify(item, null, 2)}`);
    console.log('\n=====\n');
    const date = formatDate(item.date);
    const cat = isEmpty(item.category) ? 'default' : item.category;
    return (
      <View style={styles.chListItem}>
        <TouchableOpacity
          onPress={() => handleChallengeItem(item, userState.role)}>
          <Image source={{uri: item.doubloon}} style={styles.chListImage} />
        </TouchableOpacity>
        <View style={styles.chTextContainerWrapper}>
          <View style={styles.chTextContainer}>
            <Text style={styles.chListTitle}>{item.name}</Text>
            <Text style={styles.chListText}>{item.description}</Text>
            <Text style={styles.chListText}>{date}</Text>
            <Text style={styles.chListText}>{cat}</Text>
          </View>
        </View>
      </View>
    );
  };
  const sortedData = items.slice().sort((a, b) => b.date - a.date);

  return (
    <FlatList
      data={sortedData}
      renderItem={renderItem}
      keyExtractor={item => item._id}
    />
  );
};

export default ChallengesList;
