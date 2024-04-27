import React, {useState, useEffect, useCallback} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {dbFetchNFTs} from '../util/dbUtils';
import ImageList from '../components/ImageList';
import {isTablet, setOutline} from '../util/util';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import GlobalStyles from '../constants/GlobalStyles';

const generateItemStyles = (size: any) => {
  const baseItemStyles = StyleSheet.create({
    container: {
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
        console.error(`[UserScreen] Error fetching NFTs: ${error}`);
      }
    };

    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      <ImageList items={nfts} />
    </View>
  );
}

export default UserScreen;
