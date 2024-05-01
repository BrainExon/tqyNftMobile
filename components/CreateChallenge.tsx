import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

import {dbFindOne, dbUpsert} from '../util/dbUtils';
import Config from 'react-native-config';
import React, {useState, useEffect} from 'react';
import {
  getUrlFileName,
  isObjectEmpty,
  isTablet,
  setOutline,
} from '../util/util';
import {Picker} from '@react-native-picker/picker';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {categories} from '../constants/constants';
import {v4 as uuidv4} from 'uuid';
import {Challenge} from './models/Challenge';
import UserModal from './ui/UserModal';
import {useSelector} from 'react-redux';
import {getUserState} from '../redux/userSlice';
import {useNavigation} from '@react-navigation/native';
import {generateQrCode} from '../util/httpUtils';

const CreateChallenge = ({route}) => {
  const {doubloonUri, dataTxId, nftId} = route.params;
  const navigation = useNavigation();
  const userState = useSelector(getUserState);
  const chSize = useWindowDimensions();
  const styles = generateChallengeStyles(chSize);
  const [category, setCategory] = useState('');
  const [name, setName] = useState(`Test_${uuidv4().slice(0, 5)}`);
  const [description, setDescription] = useState('default description');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  /**
   */
  const handleErrorCallback = (errMsg: any) => {
    console.log(`[CreateChallenge] error: ${JSON.stringify(errMsg)}`);
    setError(errMsg);
    setShowModal(true);
  };
  const handleButtonClose = () => {
    setShowModal(false);
    navigation.navigate('UserScreen');
  };

  useEffect(() => {
    const checkUserRole = () => {
      setError('');
      setShowModal(false);
      if (userState.role !== 'creator') {
        console.log(
          `[useEffect] userState.role is not creator?? "${userState.role}"`,
        );
        const errorMessage = Config.AUTH_ERROR?.replace(
          '${APP_NAME}',
          Config.APP_NAME,
        )?.replace('${DOUBLOON_DESIGNER}', Config.DOUBLOON_DESIGNER);
        handleErrorCallback(errorMessage);
        setShowModal(true);
      }
    };
    checkUserRole();
  }, [userState.role]);

  const handleValueChange = itemValue => {
    setCategory(itemValue);
  };
  const handleSubmit = async () => {
    console.log('Category:', category);
    console.log('Name:', name);
    console.log('Description:', description);

    try {
      //check for existing challenge first
      const challengeFind = {
        collection: 'challenges',
        conditions: {
          dataTxId: dataTxId,
        },
      };
      const existingChallenge = await dbFindOne({
        endPoint: 'find_one',
        conditions: challengeFind,
        setError: handleErrorCallback,
      });
      console.log(
        `\n====\n[CreateChallenge] EXISTING CHALLENGE: ${JSON.stringify(
          existingChallenge,
        )}\n====\n`,
      );

      setError('');
      if (existingChallenge && !isObjectEmpty(existingChallenge.data)) {
        console.log(
          `[CreateChallenge] EXISTING CHALLENGE DATA OBject is empty: ${isObjectEmpty(
            existingChallenge.data,
          )}`,
        );
        console.log(
          `\n----\n[CreateChallenge] EXISTING CHALLENGE DATA CH ID??? ${JSON.stringify(
            existingChallenge.data.chId,
          )}\n----\n`,
        );
        handleErrorCallback(
          'Challenge already exists. Mint a new NFT and to create a New Challenge.',
        );
        return;
      }
      const challengeId = uuidv4();
      const challenge = new Challenge(
        challengeId,
        name,
        Date.now(),
        userState.userId,
        [],
        doubloonUri,
        nftId,
        dataTxId,
        '',
        category,
        description,
        '',
      );

      console.log(
        `[CreateChallenge] new Challenge: ${JSON.stringify(
          challenge,
          null,
          2,
        )}`,
      );
      await dbUpsert({
        endPoint: 'upsert_challenge',
        conditions: challenge,
        callback: handleErrorCallback,
      });
      // create QR verification code
      const qrCode = generateQrCode(challengeId);
      if (qrCode.error) {
        setError('Error generating QR code: ', JSON.stringify(qrCode.error));
      }
      setShowModal(true);
      setMessage('Challenge created!');
    } catch (e: any) {
      setError(
        'Failed to create a Toqyn Challenge. Please check your network connection and try again.',
      );
      setShowModal(true);
    }
  };

  return (
    <View style={styles.chContainer}>
      <Text>Category:</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue, itemIndex) => handleValueChange(itemValue)}>
        {categories.map((category, index) => (
          <Picker.Item
            key={index}
            label={category.label}
            value={category.value}
          />
        ))}
      </Picker>
      <Text>Name:</Text>
      <TextInput
        style={styles.chInput}
        value={name}
        onChangeText={text => setName(text)}
        placeholder="Enter Name"
      />

      <Text>Description:</Text>
      <TextInput
        style={styles.chInputDesc}
        value={description}
        onChangeText={text => setDescription(text)}
        placeholder="Enter Description"
        multiline
        returnKeyType="done"
      />

      <Button title="Submit" onPress={handleSubmit} />
      {showModal && (
        <UserModal
          visible={showModal}
          message={message ?? ''}
          error={error ?? ''}
          onClose={handleButtonClose}
          showActivity={false}
        />
      )}
    </View>
  );
};
function generateChallengeStyles(size: any) {
  const chStyles = StyleSheet.create({
    chContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      padding: 20,
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
    chText: {
      fontSize: isTablet(size.width, size.height) ? hp('2') : wp('4'),
      lineHeight: isTablet(size.width, size.height) ? hp('2') : wp('7'),
      flexDirection: 'row',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
    },
    chButton: {
      width: isTablet(size.width, size.height) ? hp('48') : wp('38'),
      backgroundColor: 'rgba(200, 200, 200, 0.75)',
      borderStyle: 'solid',
      borderColor: 'red',
      paddingVertical: isTablet(size.width, size.height) ? hp('2') : wp('3'),
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('3'),
    },
    chButtonText: {
      color: 'black',
      fontSize: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      textAlign: 'center',
    },
    chInput: {
      color: 'white',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    chInputDesc: {
      color: 'white',
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
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

export default CreateChallenge;
