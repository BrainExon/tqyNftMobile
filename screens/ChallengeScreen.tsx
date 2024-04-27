import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {dbFetchNFTs} from '../util/dbUtils';
import ImageList from '../components/ImageList';
import {isEmpty, isObjectEmpty, setOutline} from '../util/util';
import {useNavigation} from '@react-navigation/native';
import UserModal from '../components/ui/UserModal';
import ChallengesList from '../components/ChallengesList';

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
  const [nfts, setNfts] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foundChallenges = await dbFetchNFTs({endPoint: 'get_challenges'});
        console.log(
          `[ChallengeScreen] foundChallenges: ${JSON.stringify(
            foundChallenges,
            null,
            2,
          )}`,
        );
        if (foundChallenges.data) {
          const updatedBucketArray = [];
          foundChallenges.data.forEach(challenge => {
            if (challenge.doubloon.startsWith('http')) {
              const item = {
                name: challenge.name,
                doubloon: challenge.doubloon,
                nft: challenge.nft,
                chId: challenge.chId,
                description: challenge.description,
              };
              updatedBucketArray.push(item);
            }
          });
          setNfts(updatedBucketArray);
        }
      } catch (error) {
        handleErrorCallback(`[ChallengeScreen] Error fetching NFTs: ${error}`);
        return;
      }
    };

    const onFocus = navigation.addListener('focus', () => {
      fetchData();
    });

    return onFocus;
  }, [navigation]);
  if (nfts) {
    console.log(`[ChallengScreen] nFts: ${JSON.stringify(nfts)}`);
  }
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
          <ChallengesList items={nfts} />
        </View>
      )}
    </View>
  );
}

export default ChallengeScreen;
