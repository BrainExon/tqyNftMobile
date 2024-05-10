import React, {useState} from 'react';
import Config from 'react-native-config';
import {
  TouchableOpacity,
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {formatDate, isTablet, setOutline} from '../util/util';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {getUserState} from '../redux/userSlice';
import PromptModal from './ui/PromptModal';

/**
 * {
 *   "name": "Test_020b5",
 *   "doubloon": "http://127.0.0.1:3030/image/e22a1b9d-b604-4a53-88cb-667ccddb3bfb.png",
 *   "nft": "8848d458-34eb-4b45-81da-b19e6b696258"
 * }
 */
const generateChListStyles = (size: any) => {
  const uacListStyles = StyleSheet.create({
    uacListItem: {
      flexDirection: 'column',
      //alignItems: 'center',
      padding: 10,
    },
    uacListImage: {
      width: isTablet(size.width, size.height) ? hp('20') : wp('20'),
      height: isTablet(size.width, size.height) ? hp('20') : wp('20'),
      borderRadius: 25,
    },
    textContainer: {
      alignItems: 'flex-start',
      margin: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      paddingLeft: isTablet(size.width, size.height) ? hp('6') : wp('4'),
    },
    uacListTitle: {
      fontSize: isTablet(size.width, size.height) ? hp('6') : wp('5'),
      marginBottom: 5,
      textAlign: 'left',
      color: 'white',
    },
    uacListText: {
      fontSize: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      fontStyle: 'italic',
      marginBottom: 5,
      textAlign: 'left',
      color: 'white',
    },
    uacListStatus: {
      fontSize: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      marginBottom: 5,
      textAlign: 'left',
      color: 'red',
    },
    uacListStatusVerified: {
      fontSize: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      marginBottom: 5,
      textAlign: 'left',
      color: 'green',
    },
    mask: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  });
  const styles = JSON.parse(JSON.stringify(uacListStyles));
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
const UserAcceptChallengeList = ({items}) => {
  /*console.log(
    `[UserAcceptChallengeList] Items List: ${JSON.stringify(items, null, 2)}`,
  );*/
  const userState = useSelector(getUserState);
  const chListSize = useWindowDimensions();
  const styles = generateChListStyles(chListSize);
  const navigation = useNavigation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [message, setMessage] = useState('');
  const [vibsible, setVisible] = useState('');
  const [title, setTitle] = useState('');
  const [showMessage, setShowMessage] = useState('');
  const [showActivity, setShowActivity] = useState(false);
  const [imageSource, setImageSource] = useState('');
  const [error, setError] = useState('');

  //console.log(`USER CH LIST: userstate userId ${userState.userId}`);

  const handleOnAccept = () => {
    setShowPrompt(false);
    console.log('[handleOnAccept] ...');
  };

  const handleButtonClose = () => {
    setShowPrompt(false);
    navigation.navigate('SignupScreen');
  };

  const handleChallengeItem = item => {
    navigation.navigate('CompleteAcceptChallenge', {
      userId: userState.userId,
      nftId: item.nft,
      chId: item.chId,
      doubloon: item.doubloon,
      name: item.name,
      description: item.description,
      status: item.status,
      dataTxId: item.dataTxId,
    });
  };

  const renderItem = ({item}) => {
    const date = formatDate(item.date);
    //console.log(`[accept list] item: ${JSON.stringify(item, null, 2)}`);

    return (
      <View style={styles.uacListItem}>
        <TouchableOpacity onPress={() => handleChallengeItem(item)}>
          <Image source={{uri: item.doubloon}} style={styles.uacListImage} />
          {item.status === 'active' && <View style={styles.mask} />}
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.uacListTitle}>"{item.name}"</Text>
          <Text style={styles.uacListText}>{item.description} </Text>
          <Text style={styles.uacListText}>{date}</Text>
          <Text
            aria-label={'Status'}
            style={
              item.status === 'verified'
                ? styles.uacListStatusVerified
                : styles.uacListStatus
            }>
            {item.status}
          </Text>
        </View>
      </View>
    );
  };

  const sortedData = items.slice().sort((a, b) => b.date - a.date);

  return (
    <>
      {showPrompt ? (
        <PromptModal
          visible={showPrompt}
          title={title}
          message={message}
          showActivity={showActivity}
          imageSource={imageSource}
          error={error}
          onAccept={handleOnAccept}
          onClose={handleButtonClose}
        />
      ) : (
        <FlatList
          data={sortedData}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
      )}
    </>
  );
};

export default UserAcceptChallengeList;
