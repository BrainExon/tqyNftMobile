import {
  View,
  Button,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {dbFetch, dbUpsert} from '../util/dbUtils';
import React, {useState, useCallback} from 'react';
import {getUrlFileName, isTablet, setOutline} from '../util/util';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {v4 as uuidv4} from 'uuid';
import UserModal from './ui/UserModal';
import {useNavigation} from '@react-navigation/native';
import {UserChallenge} from './models/UserChallenge';
import NftImage from '../../../../../../../Express/functions/models/NftImage';

const CreateUserChallenge = ({route}) => {
  const {ownerId, nftId, chId, doubloon} = route.params;
  const navigation = useNavigation();
  const chSize = useWindowDimensions();
  const styles = generateChallengeStyles(chSize);
  const [errorMsg, setErrorMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  const handleErrorCallback = (errMsg: any) => {
    setErrorMsg(errMsg);
    setShowModal(true);
  };

  const getDoubloonVersion = useCallback(async image => {
    try {
      const filename = getUrlFileName(image);
      const versionImage = `version_image?filename=${filename}`;
      console.log(`endpoint: ${versionImage}`);
      return await dbFetch({endPoint: versionImage}, handleErrorCallback);
    } catch (error: any) {
      handleErrorCallback(
        `[getDoubloonVersion] Error fetching versioned image: ${JSON.stringify(
          error ?? 'unknown error',
        )}`,
      );
    }
  }, []);

  const handleUserChPress = () => {
    setShowModal(false);
    navigation.navigate('ChallengeScreen');
  };

  const handleButtonClose = () => {
    setShowModal(false);
    navigation.navigate('ChallengeScreen');
  };

  const handleSubmit = async () => {
    try {
      /**
       * userChallengeId: string;
       * userId: string,
       * chId: string;
       * nftId: string;
       * doubloon: string;
       * date: number;
       * dateCompleted: number | null;
       */
      const doubloonVersion = await getDoubloonVersion(doubloon);
      const userChallenge = new UserChallenge(
        uuidv4(),
        ownerId,
        chId,
        nftId,
        doubloonVersion.data,
        Date.now(),
        null,
      );
      console.log(
        `[CreateUserChallenge] new Challenge: ${JSON.stringify(
          userChallenge,
          null,
          2,
        )}`,
      );
      await dbUpsert({
        endPoint: 'upsert_user_challenge',
        conditions: userChallenge,
        callback: handleErrorCallback,
      });
      //const nftImage = new NftImage();
      setShowModal(true);
      setMessage('User Challenge created!');
    } catch (e: any) {
      console.log(
        '[CreateUserChallenge] Error adding user challenge:',
        e.message,
      );
      setErrorMsg(
        'Failed to create a Toqyn User Challenge. Please check your network connection and try again.',
      );
      setShowModal(true);
    }
  };

  return showModal ? (
    <UserModal
      visible={showModal}
      message={message}
      error={errorMsg}
      onClose={handleButtonClose}
      showActivity={false}
    />
  ) : (
    <View style={styles.uchContainer}>
      <TouchableOpacity onPress={() => handleUserChPress()}>
        <View style={styles.uchImgContainer}>
          <Image source={{uri: doubloon}} style={styles.uchImgImage} />
        </View>
      </TouchableOpacity>
      <View style={styles.uchImgButtonGroup}>
        <View style={styles.uchChButton}>
          <Button title="Accept Challenge" onPress={() => handleSubmit()} />
        </View>
        <View style={styles.uchCancelButton}>
          <Button title="Cancel" onPress={() => handleUserChPress()} />
        </View>
      </View>
    </View>
  );
};

function generateChallengeStyles(size: any) {
  const chStyles = StyleSheet.create({
    uchContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      //padding: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    chContent: {
      width: isTablet(size.width, size.height) ? hp('60') : wp('70'),
      backgroundColor: 'rgba(150, 150, 150, 1)',
      //backgroundColor: 'rgba(180, 0, 0, 0.4)',
      paddingVertical: isTablet(size.width, size.height) ? hp('15') : wp('8'),
      paddingHorizontal: isTablet(size.width, size.height) ? hp('15') : wp('8'),
      marginVertical: isTablet(size.width, size.height) ? hp('15') : wp('8'),
      borderStyle: 'solid',
      borderColor: 'red',
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('12') : wp('6'),
    },
    chText: {
      fontSize: isTablet(size.width, size.height) ? hp('2') : wp('4'),
      lineHeight: isTablet(size.width, size.height) ? hp('2') : wp('7'),
      flexDirection: 'row',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
    },
    chButton: {
      width: isTablet(size.width, size.height) ? hp('48') : wp('38'),
      backgroundColor: 'rgba(200, 200, 200, 0.75)',
      borderStyle: 'solid',
      borderColor: 'red',
      paddingVertical: isTablet(size.width, size.height) ? hp('2') : wp('3'),
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('3'),
    },
    chButtonText: {
      color: 'black',
      fontSize: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      textAlign: 'center',
    },
    chInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    chInputDesc: {
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    uchImgContainer: {
      marginVertical: isTablet(size.width, size.height) ? hp('6') : wp('8'),
      alignItems: 'center',
      paddingVertical: isTablet(size.width, size.height) ? hp('2') : wp('2'),
    },
    uchImgImage: {
      width: 200,
      height: 200,
      resizeMode: 'cover',
    },
    uchImgButtonGroup: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    uchChButton: {
      flex: 1,
      paddingHorizontal: isTablet(size.width, size.height) ? hp('2') : wp('2'),
      marginHorizontal: isTablet(size.width, size.height) ? hp('2') : wp('2'),
    },
    uchCancelButton: {
      flex: 1,
      paddingHorizontal: isTablet(size.width, size.height) ? hp('2') : wp('2'),
      marginHorizontal: isTablet(size.width, size.height) ? hp('2') : wp('2'),
    },
    modalImage: {
      width: isTablet(size.width, size.height) ? hp('80') : wp('60'),
      height: isTablet(size.width, size.height) ? hp('80') : wp('60'),
      marginBottom: isTablet(size.width, size.height) ? hp('20') : wp('35'),
      backgroundColor: 'transparent',
    },
    textTitle: {
      paddingTop: isTablet(size.width, size.height) ? hp('4') : wp('3'),
      paddingHorizontal: isTablet(size.width, size.height) ? hp('5') : wp('3'),
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  const styles = JSON.parse(JSON.stringify(chStyles));
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

export default CreateUserChallenge;
