import React, {useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CreateChallenge from '../components/CreateChallenge';
import {isTablet, setOutline} from '../util/util';
import {
  Button,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Config from 'react-native-config';

const ImageDetail = ({route}) => {
  const {uri, dataTxId, nftId} = route.params;
  const boardSize = useWindowDimensions();
  const styles = generateDetailStyles(boardSize);
  const navigation = useNavigation();
  const handleImagePress = () => {
    navigation.navigate('NftScreen');
  };
  //const chainUrl = ;
  //setExplorerUrl(chainUrl);
  console.log(
    `[ImageDetail] blockchain url: ${Config.BLOCKCHAIN_URI}/${dataTxId}`,
  );
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleImagePress()}>
        <View style={styles.imgContainer}>
          <Image source={{uri: uri}} style={styles.imgImage} />
        </View>
      </TouchableOpacity>
      <View style={styles.imgButtonGroup}>
        <View style={styles.challengeButton}>
          <Button
            title="Create Challenge"
            onPress={() =>
              navigation.navigate('CreateChallenge', {
                doubloonUri: uri,
                dataTxId: dataTxId,
                nftId: nftId,
              })
            }
          />
        </View>
        <View style={styles.cancelButton}>
          <Button title="OFO Cancel" onPress={() => handleImagePress()} />
        </View>
      </View>
      <View style={styles.exploreButton}>
        <Button
          title="Blockchain"
          onPress={() => {
            Linking.openURL(`${Config.BLOCKCHAIN_URI}/${dataTxId}`).catch(e => {
              e.message;
            });
          }}
        />
      </View>
    </View>
  );
};

function generateDetailStyles(size: any) {
  const mintStyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imgContainer: {
      marginBottom: 20,
      alignItems: 'center',
    },
    imgImage: {
      width: 200,
      height: 200,
      resizeMode: 'cover',
    },
    imgButtonGroup: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: isTablet(size.width, size.height) ? hp('18') : wp('14'),
    },
    challengeButton: {
      flex: 1,
      paddingHorizontal: isTablet(size.width, size.height) ? hp('2') : wp('2'),
      marginHorizontal: isTablet(size.width, size.height) ? hp('2') : wp('2'),
    },
    exploreButton: {
      width: isTablet(size.width, size.height) ? hp('58') : wp('48'),
      paddingVertical: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      padding: isTablet(size.width, size.height) ? hp('4') : wp('2'),
      marginHorizontal: isTablet(size.width, size.height) ? hp('4') : wp('4'),
      paddingHorizontal: isTablet(size.width, size.height) ? hp('4') : wp('6'),
    },
    cancelButton: {
      flex: 1,
      paddingHorizontal: isTablet(size.width, size.height) ? hp('2') : wp('2'),
      marginHorizontal: isTablet(size.width, size.height) ? hp('2') : wp('2'),
    },
    mintThisNftButton: {
      marginHorizontal: isTablet(size.width, size.height) ? hp('8') : wp('4'),
      width: isTablet(size.width, size.height) ? hp('12') : wp('40'),
    },
    mintButton: {
      marginVertical: isTablet(size.width, size.height) ? hp('8') : wp('4'),
      marginHorizontal: isTablet(size.width, size.height) ? hp('8') : wp('4'),
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('8'),
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
  const styles = JSON.parse(JSON.stringify(mintStyles));
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

export default ImageDetail;
