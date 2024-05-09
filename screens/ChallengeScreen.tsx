import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {dbFetch, dbFind} from '../util/dbUtils';
import {isEmpty, isObjectEmpty, setOutline} from '../util/util';
import {useNavigation} from '@react-navigation/native';
import UserModal from '../components/ui/UserModal';
import ChallengesList from '../components/ChallengesList';
import {useSelector} from 'react-redux';
import {getUserState} from '../redux/userSlice';

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

function ChallengeScreen() {
  console.log('\n------\n[ChallengeScreen]\n-----\n');
  const navigation = useNavigation();
  const boardSize = useWindowDimensions();
  const styles = generateItemStyles(boardSize);
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const userState = useSelector(getUserState);
  console.log(
    `\n------\n[ChallengeScreen] userState: ${JSON.stringify(
      userState,
    )}\n-----\n`,
  );

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        /**
         * {
         *   "_id":"662fb442570342281f8b25d7",
         *   "userChallengeId":"d249da41-2e26-4df7-b7eb-2e396f0fdf8c",
         *   "userId":"dc6ddf89-37fc-4224-a0d7-5c03ae4353e7",
         *   "chId":"c0003a5f-35fc-4315-b6a4-6962547d7ea7",
         *   "nftId":"394aa4bc-4807-4b07-b0ac-dfe11653cb9d",
         *   "doubloon":"/Users/chellax/Projects/Express/functions/images_store/1842c321-c47c-4e44-9c5d-2375f84f3162_v1.png",
         *   "date":1714402370049,
         *   "dateCompleted":null
         * }
         */

        const searchByUserId = {
          collection: 'challenges',
          conditions: {
            owner: userState.userId,
          },
        };
        const foundChallenges = await dbFind({
          endPoint: 'find',
          conditions: searchByUserId,
          setError: handleErrorCallback,
        });

        //const foundChallenges = await dbFetch({endPoint: 'get_challenges'});
        if (foundChallenges.data) {
          const updatedBucketArray = [];
          foundChallenges.data.forEach(challenge => {
            /*
            console.log(
              `[ChallengeScreen] Challenge: ${JSON.stringify(
                challenge,
                null,
                2,
              )}`,
            );
            */
            if (challenge) {
              const item = {
                _id: challenge._id,
                name: challenge.name,
                doubloon: challenge.doubloon,
                nft: challenge.nft,
                chId: challenge.chId,
                date: challenge.date,
                description: challenge.description,
                category: challenge.category,
                dataTxId: challenge.dataTxId,
              };
              updatedBucketArray.push(item);
            }
          });
          setChallenges(updatedBucketArray);
        }
      } catch (error) {
        handleErrorCallback(
          `[ChallengeScreen] Error fetching Challenges: ${error}`,
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
          <ChallengesList items={challenges} />
        </View>
      )}
    </View>
  );
}

export default ChallengeScreen;
