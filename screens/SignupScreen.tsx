import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {dbFetch} from '../util/dbUtils';
import {getUrlFileName, isEmpty, isObjectEmpty, setOutline} from '../util/util';
import {useNavigation} from '@react-navigation/native';
import UserModal from '../components/ui/UserModal';
import Config from 'react-native-config';
import UserAcceptChallengeList from '../components/UserAcceptChallengesList';

const generateItemStyles = (size: any) => {
  const baseItemStyles = StyleSheet.create({
    userContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
  });
  const styles = JSON.parse(JSON.stringify(baseItemStyles));
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

function SignupScreen() {
  console.log('\n------\n[SignupScreen]\n-----\n');
  const navigation = useNavigation();
  const boardSize = useWindowDimensions();
  const styles = generateItemStyles(boardSize);
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleErrorCallback = useCallback((error: any) => {
    if (isObjectEmpty(error) || isEmpty(error)) {
      return;
    }
    const errorMessage =
      typeof error !== 'string' ? JSON.stringify(error) : error;
    console.log(`[handleErrorCallback] errorMessage: ${errorMessage}`);
    setError(errorMessage);
    setShowModal(true);
  }, []);

  const handleModalButtonClose = () => {
    setShowModal(false);
  };

  /**
   *  {
   *    "_id": "663033a811deec502d5daee5",
   *    "userChallengeId": "3a276641-9cf2-48a9-b4b4-301239c4044d",
   *    "userId": "dc6ddf89-37fc-4224-a0d7-5c03ae4353e7",
   *    "chId": "5f0ccbf9-4c31-44c0-aa0f-54e3f8eef62e",
   *    "nftId": "086108f3-ece8-44ba-b9ce-f8a4d3ca1ce0",
   *    "doubloon": "file:///Users/chellax/Projects/Express/functions/images_store/03642d02-c51c-4a48-aec7-5f3d431ed6bd_v1.png",
   *    "date": 1714434984014,
   *    "dateCompleted": 0,
   *    "status": "active",
   *    "name": "LSU Tiger Tailgate 2025 Challenge!",
   *    "description": "Annual LSU Tailgate Challenge!  Sign-up and win your  LSU Toqyn Doubloon!"
   *   }
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const foundChallenges = await dbFetch({
          endPoint: 'get_user_challenges',
        });
        if (foundChallenges.data) {
          const updatedBucketArray = [];
          foundChallenges.data.forEach(challenge => {
            const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
            const yesterdayTimestamp = Date.now() - oneDayInMilliseconds;
            if (
              !isEmpty(challenge.description) &&
              challenge.date > yesterdayTimestamp
            ) {
              const doubFilename = getUrlFileName(challenge.doubloon);
              const httpDoubloon = `${Config.NODEJS_EXPRESS_SERVER}/image/${doubFilename}`;

              const item = {
                _id: challenge._id,
                name: challenge.name,
                userId: challenge.userId,
                doubloon: httpDoubloon,
                status: challenge.status,
                nft: challenge.nftId,
                chId: challenge.chId,
                description: challenge.description,
                date: challenge.date,
              };
              updatedBucketArray.push(item);
            }
          });
          setChallenges(updatedBucketArray);
        }
      } catch (error) {
        handleErrorCallback(
          `[SignupScreen] Error fetching Challenges: ${error}`,
        );
        return;
      }
    };
    const onFocus = navigation.addListener('focus', () => {
      fetchData();
    });
    return onFocus;
  }, [navigation]);
  return (
    <View style={styles.userContainer}>
      {showModal ? (
        <UserModal
          visible={showModal}
          message={''}
          error={error ?? ''}
          onClose={handleModalButtonClose}
          showActivity={false}
        />
      ) : (
        <View>
          <UserAcceptChallengeList items={challenges} />
        </View>
      )}
    </View>
  );
}

export default SignupScreen;
