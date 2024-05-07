import {
  View,
  Text,
  Button,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {dbFetch, dbFindOne, dbUpsert} from '../util/dbUtils';
import React, {useState, useCallback} from 'react';
import {
  getMimeType,
  getUrlFileName,
  isObjectEmpty,
  isTablet,
  setOutline,
} from '../util/util';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {v4 as uuidv4} from 'uuid';
import UserModal from './ui/UserModal';
import {useNavigation} from '@react-navigation/native';
import {UserChallenge} from './models/UserChallenge';
import {pinNftVersion} from '../ipfs/blockchain';

const CreateAcceptChallenge = ({route}) => {
  console.log('[CreateAcceptChallenge]....');
  const {ownerId, nftId, chId, doubloon, name, description, dataTxId} =
    route.params;
  console.log(`[CreateAcceptChallenge] ownerId: ${ownerId}`);
  console.log(`[CreateAcceptChallenge] nftId: ${nftId}`);
  console.log(`[CreateAcceptChallenge] chId: ${chId}`);
  console.log(`[CreateAcceptChallenge] doubloon: ${doubloon}`);
  console.log(`[CreateAcceptChallenge] name: ${name}`);
  console.log(`[CreateAcceptChallenge] description: ${description}`);
  console.log(`[CreateAcceptChallenge] dataTxId: ${dataTxId}`);

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
    navigation.navigate('ChallengeScreen');
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
    async (image: string) => {
      console.log('[generateNftVersion]...');
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
          `versioned image: ${JSON.stringify(versionedImage.data, null, 2)}`,
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
    console.log('[CreateAcceptChallenge][handleSubmit]....');
    try {
      console.log('[CreateAcceptChallenge] generate NFT Version....');
      //check for existing user challenge first
      const userChallengeFind = {
        collection: 'user_challenges',
        conditions: {
          dataTxId: dataTxId,
        },
      };
      const existingUserChallenge = await dbFindOne({
        endPoint: 'find_one',
        conditions: userChallengeFind,
        setError: handleErrorCallback,
      });
      console.log(
        `\n====\n[CreateAcceptChallenge] EXISTING User challenge: ${JSON.stringify(
          existingUserChallenge,
          null,
          2,
        )}\n====\n`,
      );

      if (existingUserChallenge && !isObjectEmpty(existingUserChallenge.data)) {
        console.log(
          `\n----\n[CreateAcceptChallenge] EXISTING User challenge DATA CH ID??? ${JSON.stringify(
            existingUserChallenge.data.chId,
          )}\n----\n`,
        );
        handleErrorCallback('Challenge already accepted.');
        setShowActivity(false);
        return;
      }
      setShowModal(true);
      setShowActivity(true);
      setMessage(`Generating challenge "${name}"`);
      const nftVersion = await generateNftVersion(doubloon);
      /**
       * userChallengeId: string;
       * userId: string,
       * chId: string;
       * nftId: string;
       * doubloon: string;
       * date: number;
       * dateCompleted: number | null;
       * status;
       */
      console.log(
        `[CreateUserChallenge] nftVersion: ${JSON.stringify(nftVersion)}`,
      );
      console.log('[CreateAcceptChallenge] create new User Challenge....');
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
      const userChallenge = new UserChallenge(
        uuidv4(),
        ownerId,
        chId,
        nftVersion.data.nftId,
        nftVersion.data.created[0].sourceUri,
        Date.now(),
        0,
        'active',
        name,
        description,
        dataTxId,
      );

      console.log(
        `[CreateUserChallenge] new User Challenge: ${JSON.stringify(
          userChallenge,
          null,
          2,
        )}`,
      );
      console.log('[CreateAcceptChallenge] db upsert new User Challenge....');
      await dbUpsert({
        endPoint: 'upsert_user_challenge',
        conditions: userChallenge,
        callback: handleErrorCallback,
      });
      // Update the challenge's participants list with the user's ID.
      const challengeFind = {
        collection: 'challenges',
        conditions: {
          chId: chId,
        },
      };
      console.log('[CreateAcceptChallenge] find original Challenge....');
      const challenge = await dbFindOne({
        endPoint: 'find_one',
        conditions: challengeFind,
        setError: handleErrorCallback,
      });
      if (challenge.error || !challenge.data) {
        handleErrorCallback(
          `Error creating the accepted challenge for userId: ${ownerId}`,
        );
      }
      //const updatedChallenge = insertChallengeUser(challenge.data, ownerId);
      console.log(
        '[CreateAcceptChallenge] add user to Original Challenge User list....',
      );
      challenge.data.users.push(ownerId);
      console.log(
        `[CreateAcceptChallenge] updatedChallenge: ${JSON.stringify(
          challenge,
          null,
          2,
        )}`,
      );

      await dbUpsert({
        endPoint: 'upsert_challenge',
        conditions: challenge.data,
        callback: handleErrorCallback,
      });

      console.log(
        '[CreateAcceptChallenge] user added to Original Challenge User list....\n-------\n',
      );
      setShowModal(true);
      setShowActivity(false);
      setMessage(`New User Challenge "${name}" created!`);
    } catch (e: any) {
      handleErrorCallback(
        'Failed to create a new Toqyn User Challenge. Please check your network connection and try again.',
      );
    }
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
        <Text style={styles.uchText}>{description}</Text>
      </View>
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
      color: 'white',
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

export default CreateAcceptChallenge;
