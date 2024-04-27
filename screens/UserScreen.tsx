import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {dbFetchNFTs} from '../util/dbUtils';
import ImageList from '../components/ImageList';
import {isEmpty, isObjectEmpty, setOutline} from '../util/util';

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

function UserScreen() {
  console.log('[UserScreen]');
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
    //navigation.navigate('LoginScreen');
  };

  let bucketArray = [];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const foundNfts = await dbFetchNFTs({endPoint: 'get_nfts'});
        if (foundNfts.data) {
          foundNfts.data.forEach(item => {
            item.created.forEach(createdItem => {
              if (createdItem.sourceUri) {
                const uri = createdItem.sourceUri;
                bucketArray.push(uri); // Convert object to stringch
              }
            });
          });
          setNfts(bucketArray);
        }
      } catch (error) {
        handleErrorCallback(`[UserScreen] Error fetching NFTs: ${error}`);
        return;
      }
    };
    fetchData();
  }, []);
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
        <ImageList items={nfts} />
      )}
    </View>
  );
}

export default UserScreen;
