import {
  View,
  Text,
  Button,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import Config from 'react-native-config';
import {dbFetch, dbUpsert, verifyChallenge} from '../util/dbUtils';
import React, {useState, useCallback} from 'react';
import {
  getMimeType,
  getUrlFileName,
  isTablet,
  removeExtension,
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
import PromptModal from './ui/PromptModal';

const CompleteAcceptChallenge = ({route}) => {
  console.log('[CompleteAcceptChallenge]....');
  const {userId, nftId, chId, doubloon, name, description, status} =
    route.params;
  console.log(`\n----\n[CompleteAcceptChallenge] userId: ${userId}`);
  console.log(`[CompleteAcceptChallenge] nftId: ${nftId}`);
  console.log(`[CompleteAcceptChallenge] chId: ${chId}`);
  console.log(`[CompleteAcceptChallenge] doubloon: ${doubloon}`);
  console.log(`[CompleteAcceptChallenge] name: ${name}`);
  console.log(`[CompleteAcceptChallenge] description: ${description}`);
  console.log(`[CompleteAcceptChallenge] STATUS: ${status}\n----\n`);
  const navigation = useNavigation();
  const chSize = useWindowDimensions();
  const styles = generateChallengeStyles(chSize);
  const [errorMsg, setErrorMsg] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [image, setImage] = useState('');

  const handleUserChPress = () => {
    setShowModal(false);
    navigation.navigate('SignupScreen');
  };

  const handleImagePress = () => {
    setShowModal(false);
    console.log(`QRCODE PRESS image: ${JSON.stringify(image)}`);
    const filename = getUrlFileName(image);
    const challengeId = removeExtension(filename);
    console.log('\n-------\n');
    console.log(`QRCODE PRESS Challenge ID: ${JSON.stringify(challengeId)}`);
    console.log(`QRCODE PRESS user ID: ${JSON.stringify(userId)}`);
    console.log('\n-------\n');
    const verified = verifyChallenge(challengeId, userId);
    console.log(
      `[CompleteAcceptChallenge] verified: ${JSON.stringify(verified)}`,
    );
    navigation.navigate('SignupScreen');
  };

  const handleButtonClose = () => {
    setShowModal(false);
    navigation.navigate('SignupScreen');
  };

  const handleSubmit = async () => {
    console.log('[CompleteAcceptChallenge][handleSubmit]....');
    setShowModal(true);
    // const filename = getUrlFileName(doubloon);
    const qrCodeSource = `${Config.NODEJS_EXPRESS_SERVER}/qrcodes/${chId}.png`;
    console.log(
      '[CompleteAcceptChallenge] qrCodeSource: ',
      JSON.stringify(qrCodeSource),
    );
    setImage(qrCodeSource);
    setVisible(true);
    setErrorMsg('');
    setShowActivity(false);
    setMessage('Scan or click the QR code to verify the challenge.');
  };

  return showModal ? (
    <PromptModal
      visible={visible}
      title={name}
      message={message}
      showActivity={showActivity}
      imageSource={image}
      error={errorMsg}
      onAccept={''}
      onClose={handleButtonClose}
      handleImagePress={handleImagePress}
    />
  ) : (
    <View style={styles.compUchContainer}>
      <TouchableOpacity onPress={() => handleUserChPress()}>
        <View style={styles.compUchImgContainer}>
          <Image source={{uri: doubloon}} style={styles.uchImgImage} />
        </View>
      </TouchableOpacity>
      <View style={styles.compUchTextContainer}>
        <Text style={styles.uchTextTitle}>{name}</Text>
        <Text>{description}</Text>
        <Text>{status}</Text>
      </View>
      <View style={styles.compUchImgButtonGrp}>
        {status === 'active' && (
          <View style={styles.compChButton}>
            <Button title="Toqyn It!" onPress={() => handleSubmit()} />
          </View>
        )}
        <View style={styles.compUchCancel}>
          <Button title="Cancel" onPress={() => handleUserChPress()} />
        </View>
      </View>
      {status === 'verified' && (
        <View style={styles.compUchImgButtonGrp}>
          <View style={styles.exploreChButton}>
            <Button
              title="Blockchain"
              onPress={() => {
                Linking.openURL(`${Config.BLOCKCHAIN_URI}/${dataTxId}`).catch(
                  e => {
                    e.message;
                  },
                );
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

function generateChallengeStyles(size: any) {
  const chStyles = StyleSheet.create({
    compUchContainer: {
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
    compUchImgContainer: {
      marginVertical: isTablet(size.width, size.height) ? hp('6') : wp('8'),
      alignItems: 'center',
      paddingVertical: isTablet(size.width, size.height) ? hp('2') : wp('2'),
    },
    uchImgImage: {
      width: 200,
      height: 200,
      resizeMode: 'cover',
    },
    compUchImgButtonGrp: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    compChButton: {
      flex: 1,
      paddingHorizontal: isTablet(size.width, size.height) ? hp('2') : wp('2'),
      marginHorizontal: isTablet(size.width, size.height) ? hp('2') : wp('2'),
    },
    exploreChButton: {
      flex: 1,
      //width: isTablet(size.width, size.height) ? hp('58') : wp('48'),
      paddingVertical: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      paddingHorizontal: isTablet(size.width, size.height) ? hp('2') : wp('2'),
      marginHorizontal: isTablet(size.width, size.height) ? hp('2') : wp('2'),
      //padding: isTablet(size.width, size.height) ? hp('4') : wp('2'),
      //marginHorizontal: isTablet(size.width, size.height) ? hp('4') : wp('4'),
      //paddingHorizontal: isTablet(size.width, size.height) ? hp('4') : wp('6'),
    },
    compUchCancel: {
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
    compUchTextContainer: {
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
