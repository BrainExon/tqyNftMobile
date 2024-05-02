import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import Config from 'react-native-config';
import {useWindowDimensions} from 'react-native';
import {dbFetch} from '../util/dbUtils';
import ImageList from '../components/ImageList';
import {isEmpty, isObjectEmpty, setOutline} from '../util/util';
import {useNavigation} from '@react-navigation/native';
import UserModal from '../components/ui/UserModal';

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

function NFTScreen() {
  console.log('[NFTScreen]');
  const navigation = useNavigation();
  const userSize = useWindowDimensions();
  const styles = generateItemStyles(userSize);
  const [nfts, setNfts] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleErrorCallback = useCallback((errorMsg: any) => {
    if (isObjectEmpty(errorMsg) || isEmpty(errorMsg)) {
      return;
    }
    const errorMessage =
      typeof errorMsg !== 'string' ? JSON.stringify(errorMsg) : errorMsg;
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
        const foundNfts = await dbFetch({endPoint: 'get_nfts'});
        //console.log(`[NFTScreen] NFT date: ${foundNfts.date}`);

        if (foundNfts.data) {
          const updatedBucketArray = [];
          foundNfts.data.forEach(nft => {
            const nftId = nft.nftId;
            const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
            const yesterdayTimestamp = Date.now() - oneDayInMilliseconds;

            if (
              Config.SORT_BY_YESTERDAY &&
              nft.date &&
              nft.date > yesterdayTimestamp
            ) {
              nft.created.forEach(createdItem => {
                if (createdItem.sourceUri) {
                  const uri = createdItem.sourceUri;
                  const item = {
                    uri: uri,
                    dataTxId: createdItem.dataTxId,
                    nftId: nftId,
                    date: nft.date,
                  };
                  updatedBucketArray.push(item);
                }
              });
            }
          });

          setNfts(updatedBucketArray);
        }
      } catch (err) {
        handleErrorCallback(`[UserScreen] Error fetching NFTs: ${err}`);
        return;
      }
    };

    const onFocus = () => {
      fetchData();
    };

    const focusListener = navigation.addListener('focus', onFocus);

    return () => {
      focusListener();
    };
  }, [navigation]);

  const sortedData = nfts.slice().sort((a, b) => b.date - a.date);

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
        <ImageList items={sortedData} />
      )}
    </View>
  );
}

export default NFTScreen;
