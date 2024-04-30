import {
  View,
  Text,
  Button,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {dbFetch, dbUpsert} from '../util/dbUtils';
import React, {useState, useCallback} from 'react';
import {getMimeType, getUrlFileName, isTablet, setOutline} from '../util/util';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {v4 as uuidv4} from 'uuid';
import UserModal from './ui/UserModal';
import {useNavigation} from '@react-navigation/native';
import {UserChallenge} from './models/UserChallenge';
import {pinNftVersion} from '../ipfs/blockchain';

const CompleteAcceptChallenge = ({route}) => {
  console.log('[CompleteAcceptChallenge]....');
  const {ownerId, nftId, chId, doubloon, name, description} = route.params;
  const navigation = useNavigation();
  const chSize = useWindowDimensions();
  const styles = generateChallengeStyles(chSize);
  const [errorMsg, setErrorMsg] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  const handleErrorCallback = (errMsg: any) => {
    setErrorMsg(errMsg);
    setShowModal(true);
  };

  const handleUserChPress = () => {
    setShowModal(false);
    navigation.navigate('SignupScreen');
  };

  const handleButtonClose = () => {
    setShowModal(false);
    navigation.navigate('SignupScreen');
  };

  /**
   * Function to create an NFT version of the original NFT used in the Challenge
   * the user has chosen to accept. This is done by versioning the image used
   * in the original NFT. Once the versioned NFT is created, we then create a
   * User Challenge entry in the DB.
   */
  const generateNftVersion = useCallback(
    async image => {
      setErrorMsg('');
      try {
        const filename = getUrlFileName(image);
        const versionImage = `version_image?filename=${filename}`;
        console.log(`[generateNftVersion] endpoint: ${versionImage}`);
        const versionedImage = await dbFetch(
          {endPoint: versionImage},
          handleErrorCallback,
        );
        console.log(
          `versioned image: ${JSON.stringify(versionedImage, null, 2)}`,
        );
        const vFilename = getUrlFileName(versionedImage.data);
        const mimeType = getMimeType(vFilename);
        const ipfsData = await pinNftVersion({
          ownerId: ownerId,
          imagePath: `images_store/${vFilename}`,
          imageType: mimeType,
          imageName: vFilename,
          callback: handleErrorCallback,
        });
        console.log(
          `[generateNftVersion] IPFS response: ${JSON.stringify(ipfsData)}`,
        );
        if (ipfsData?.data && !ipfsData?.data?.created[0].dataTxId) {
          const err = '[generateNftVersion] null dataTxId!';
          handleErrorCallback(err);
        }
        return ipfsData;
      } catch (error: any) {
        handleErrorCallback(
          `[generateNftVersion] Error generating versioned NFT: ${JSON.stringify(
            error ?? 'unknown error',
          )}`,
        );
      }
    },
    [ownerId],
  );

  const handleSubmit = async () => {
    console.log('[CompleteAcceptChallenge][handleSubmit]....');
    setShowModal(true);
    setErrorMsg('');
    setMessage('Finish this verification component.');
  };

  return showModal ? (
    <UserModal
      visible={showModal}
      message={message}
      error={errorMsg}
      onClose={handleButtonClose}
      showActivity={showActivity}
    />
  ) : (
    <View style={styles.uchContainer}>
      <TouchableOpacity onPress={() => handleUserChPress()}>
        <View style={styles.uchImgContainer}>
          <Image source={{uri: doubloon}} style={styles.uchImgImage} />
        </View>
      </TouchableOpacity>
      <View style={styles.uchTextContainer}>
        <Text style={styles.uchTextTitle}>{name}</Text>
        <Text>{description}</Text>
      </View>
      <View style={styles.uchImgButtonGroup}>
        <View style={styles.uchChButton}>
          <Button title="Toqyn it!" onPress={() => handleSubmit()} />
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
    uchText: {
      fontSize: isTablet(size.width, size.height) ? hp('2') : wp('4'),
      lineHeight: isTablet(size.width, size.height) ? hp('2') : wp('7'),
      flexDirection: 'row',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
    },
    uchButton: {
      width: isTablet(size.width, size.height) ? hp('48') : wp('38'),
      backgroundColor: 'rgba(200, 200, 200, 0.75)',
      borderStyle: 'solid',
      borderColor: 'red',
      paddingVertical: isTablet(size.width, size.height) ? hp('2') : wp('3'),
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('3'),
    },
    uchButtonText: {
      color: 'black',
      fontSize: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      textAlign: 'center',
    },
    uchInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    uchInputDesc: {
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
    uchModalImage: {
      width: isTablet(size.width, size.height) ? hp('80') : wp('60'),
      height: isTablet(size.width, size.height) ? hp('80') : wp('60'),
      marginBottom: isTablet(size.width, size.height) ? hp('20') : wp('35'),
      backgroundColor: 'transparent',
    },
    uchTextTitle: {
      fontWeight: 'bold',
      fontSize: isTablet(size.width, size.height) ? hp('7') : wp('5'),
      margin: isTablet(size.width, size.height) ? hp('4') : wp('3'),
    },
    uchTextContainer: {
      alignItems: 'center',
      margin: isTablet(size.width, size.height) ? hp('4') : wp('2'),
      padding: isTablet(size.width, size.height) ? hp('8') : wp('4'),
    },
    uchCenteredView: {
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

export default CompleteAcceptChallenge;
